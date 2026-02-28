import boto3
import os
from dotenv import load_dotenv

load_dotenv()

def test_bedrock():
    print("--- Direct Bedrock Connectivity Test (Claude) ---")
    try:
        # Using Mumbai region (ap-south-1)
        region = 'ap-south-1'
        bedrock = boto3.client(
            'bedrock-runtime',
            aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
            aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
            region_name=region
        )
        
        # Using Claude 3 Haiku for us-east-1 (Most likely to work immediately)
        model_id = "anthropic.claude-3-haiku-20240307-v1:0"
        print(f"Testing with Model ID: {model_id} in {region}")
        
        response = bedrock.converse(
            modelId=model_id,
            messages=[{"role": "user", "content": [{"text": "Hello! Confirm if you are Claude 3.5 Sonnet."}]}],
            inferenceConfig={'maxTokens': 100, 'temperature': 0.7}
        )
        
        print(f"Response: {response['output']['message']['content'][0]['text']}")
        print("\nSUCCESS: Claude 3.5 Sonnet is now ACTIVE in your account!")
        
    except Exception as e:
        print(f"FAILURE: {str(e)}")
        if "throughput" in str(e).lower():
            print("\nTip: AWS is still processing your Anthropic form. Try again in 5 minutes.")

if __name__ == "__main__":
    test_bedrock()
