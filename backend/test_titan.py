import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def test_titan():
    print("--- Testing AWS-Native Titan Model (No Marketplace needed) ---")
    try:
        bedrock = boto3.client(
            'bedrock-runtime',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name='ap-south-1' # Mumbai
        )
        
        # Amazon Titan Text Express v1 (Newer/Modern)
        model_id = "amazon.titan-text-express-v1"
        print(f"Testing with Model ID: {model_id}...")
        
        response = bedrock.invoke_model(
            modelId=model_id,
            body='{"inputText": "Hi, confirm if you can hear me.", "textGenerationConfig": {"maxTokenCount": 50, "temperature": 0.7}}'
        )
        
        import json
        result = json.loads(response.get('body').read())
        print(f"Titan Response: {result['results'][0]['outputText']}")
        print("\n✅ SUCCESS: Titan is working! We can use this for the hackathon.")
        
    except Exception as e:
        print(f"\n❌ FAILURE: {str(e)}")
        if "AccessDeniedException" in str(e):
            print("Tip: Even Titan is blocked. Your AWS registration MUST be completed first.")

if __name__ == "__main__":
    test_titan()
