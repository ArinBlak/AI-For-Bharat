from agent_service import AgentService
import os
from dotenv import load_dotenv

load_dotenv()

def test_sarvam():
    print("--- Testing Sarvam AI (India's Own AI) ---")
    service = AgentService()
    
    msg = "Namaste! Mujhe kisan yojna ke bare mein batao."
    profile = {"name": "Arijeet", "occupation": "Farmer"}
    
    response = service.chat(msg, conversation_history=[], user_profile=profile)
    
    print(f"\nAI Response:\n{response}")
    if len(response) > 5:
        print("\nSUCCESS: Sarvam AI is responding! Your AI case worker is now alive.")
    else:
        print("\nFAILURE: Empty response from AI. Check API Key.")

if __name__ == "__main__":
    test_sarvam()
