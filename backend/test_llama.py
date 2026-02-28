import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def test_llama():
    print("--- Final US-East-1 Llama 3.1 8B Instruct Test ---")
    try:
        bedrock = boto3.client(
            'bedrock-runtime',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name='us-east-1' 
        )
        
        # Using the Inference Profile ID (Required for US regions)
        model_id = "us.meta.llama3-1-8b-instruct-v1:0"
        print(f"Using Inference Profile: {model_id} in us-east-1")
        
        response = bedrock.converse(
            modelId=model_id,
            messages=[{"role": "user", "content": [{"text": "Namaste! Are you ready for AI for Bharat?"}]}],
            inferenceConfig={'maxTokens': 100, 'temperature': 0.7}
        )
        
        reply = response['output']['message']['content'][0]['text']
        print(f"\nAI Response: {reply}")
        print("\n✅ SUCCESS: We have an active AI engine for your hackathon!")
        
    except Exception as e:
        print(f"\n❌ FAILURE: {str(e)}")

if __name__ == "__main__":
    test_llama()
