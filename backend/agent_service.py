import boto3
import os
import json
from dotenv import load_dotenv

load_dotenv()

class AgentService:
    def __init__(self):
        # Using Sarvam AI for India-specific LLM support
        self.api_key = os.getenv('SARVAM_API_KEY')
        self.api_url = "https://api.sarvam.ai/v1/chat/completions" # Fixed URL

    def chat(self, user_message, conversation_history=[], user_profile={}):
        """
        AI Interaction using Sarvam AI (Best for India)
        """
        SCHEME_REQUIREMENTS = {
            "PM Awas Yojana": ["aadhar", "income", "land_status"],
            "PM Kisan": ["aadhar", "farmer_id", "bank_account"],
            "Ladli Behna": ["aadhar", "samagra_id", "bank_account"],
            "Swasthya Sathi": ["aadhar", "ration_card", "family_count"],
            "Old Age Pension": ["aadhar", "age_proof", "bank_ifsc"]
        }

        system_prompt = f"""
        You are 'Yojna Setu', a high-intent AI caseworker for rural India.
        Your goal is to get a user applied for a specific government scheme.
        
        CURRENT USER PROFILE:
        {json.dumps(user_profile, indent=2)}
        
        SCHEME KNOWLEDGE BASE:
        {json.dumps(SCHEME_REQUIREMENTS, indent=2)}
        
        STRICT OPERATING RULES:
        1. Language: Use Hinglish (Hindi + English).
        2. Selection: If the user doesn't specify a scheme, list the 5 schemes available and ask which one they want.
        3. Proactiveness: Once a scheme is chosen:
           - Cross-reference the PROFILE with the SCHEME KNOWLEDGE BASE.
           - Ask for EXACTLY the missing fields for THAT scheme (e.g., if it's PM Kisan, ask for Farmer ID).
           - Do NOT ask for everything at once if you already have some details.
        4. Action Trigger: ONLY when you have ALL required fields for the chosen scheme, you MUST apply.
           - To apply, FIRST provide a polite verbal confirmation of what you are doing (e.g. "Theek hai ji, mujhe sab mil gaya hai. Main ab application bhar raha hoon..."), then append exactly: `[ACTION: OPEN_PORTAL | scheme: <scheme_name> | details: <json_of_all_fields>]`
        5. Tone: Polite, caseworker-like, and efficient.
        """

        # Convert conversation history to Sarvam/OpenAI format
        messages = [{"role": "system", "content": system_prompt}]
        
        # Sarvam/OpenAI requires the first message after system to be 'user'
        # Our UI starts with an assistant greeting, so we skip it in the history
        active_history = []
        for msg in conversation_history:
            role = msg.get('role')
            content = msg.get('content')
            
            # Handle list-based content from Bedrock history if it exists
            if isinstance(content, list):
                content = content[0].get('text', '')
            
            if not active_history and role == 'assistant':
                continue # Skip leading assistant messages
            
            active_history.append({"role": role, "content": content})
            
        messages.extend(active_history)
        messages.append({"role": "user", "content": user_message})

        try:
            print(f"--- Calling Sarvam AI at {self.api_url} ---")
            import requests
            headers = {
                "api-subscription-key": self.api_key,
                "Content-Type": "application/json"
            }
            payload = {
                "model": "sarvam-m", 
                "messages": messages,
                "temperature": 0.7
            }
            
            response = requests.post(self.api_url, headers=headers, json=payload)
            if response.status_code != 200:
                print(f"!!! Sarvam Error Details: {response.text}")
                response.raise_for_status()
                
            return response.json()['choices'][0]['message']['content']
            
        except Exception as e:
            print(f"!!! Sarvam AI Exception: {str(e)}")
            return "Maaf kijiye, hamare AI system mein thodi takleef ho rahi hai. Kripya thodi der baad koshish karein."


        # Strategy 1.5: Explicit v2 Check (in case .env is old)
        v2_id = "anthropic.claude-3-5-sonnet-20241022-v2:0"
        if self.model_id != v2_id:
            print(f"--- Attempting Explicit v2: {v2_id} ---")
            response = self._try_model(self.primary_client, v2_id, messages, system_prompt)
            if response: return response

        # Strategy 2: Cross-Region Inference Profiles (often avoids marketplace locks)
        # Using US and EU inference profiles
        for profile_id in ["us.anthropic.claude-3-5-sonnet-20240620-v1:0", "eu.anthropic.claude-3-5-sonnet-20240620-v1:0"]:
            print(f"--- Attempting Inference Profile: {profile_id} ---")
            response = self._try_model(self.primary_client, profile_id, messages, system_prompt)
            if response: return response

        # Strategy 3: Secondary Region (US-East-1) - Direct Model Access
        print(f"--- Attempting Secondary Region: {self.secondary_region} ---")
        response = self._try_model(self.secondary_client, self.model_id, messages, system_prompt)
        if response: return response

        # Strategy 3.5: Primary Region + Claude 3 Haiku (Very cheap, usually high quota)
        haiku_id = "anthropic.claude-3-haiku-20240307-v1:0"
        print(f"--- Attempting Haiku Fallback: {haiku_id} ---")
        response = self._try_model(self.primary_client, haiku_id, messages, system_prompt)
        if response: return response + "\n\n(Note: Running on Haiku model)"

        # Strategy 4: Fallback to Llama 3 (Meta) - usually has fewer restrictions
        fallback_id = "meta.llama3-8b-instruct-v1:0"
        print(f"--- Final Fallback to {fallback_id} in {self.primary_region} ---")
        response = self._try_model(self.primary_client, fallback_id, messages, system_prompt)
        if response: return response + "\n\n(Note: Running on Mumbai Fallback)"

        # Strategy 5: US-East-1 Llama 3 Fallback (Higher Quota)
        print(f"--- Final Fallback to {fallback_id} in {self.secondary_region} ---")
        response = self._try_model(self.secondary_client, fallback_id, messages, system_prompt)
        if response: return response + "\n\n(Note: Running on US Fallback)"

        return "Service unavailable. Please ensure you have requested model access in AWS Bedrock Console for Claude or Llama 3 and check your AWS Billing dashboard."

    def _try_model(self, client, model_id, messages, system):
        try:
            response = client.converse(
                modelId=model_id,
                messages=messages,
                system=[{"text": system}],
                inferenceConfig={'maxTokens': 500, 'temperature': 0.7}
            )
            return response['output']['message']['content'][0]['text']
        except Exception as e:
            error_msg = str(e).lower()
            print(f"Model {model_id} failed: {str(e)}")
            return None

    def apply_for_scheme(self, user_phone, scheme_name, user_info):
        """
        Mock function to 'Apply' for a scheme on behalf of the user.
        In a real scenario, this would call a government API or fill a form.
        """
        # Logic to submit data to DynamoDB or another service
        application_id = f"APP-{os.urandom(4).hex().upper()}"
        print(f"Applying for {scheme_name} for user {user_phone}...")
        return {
            "status": "Success",
            "application_id": application_id,
            "message": f"Aapka {scheme_name} ke liye aavedan (application) submit ho gaya hai. Reference ID: {application_id}"
        }
