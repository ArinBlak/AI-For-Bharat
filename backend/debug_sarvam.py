import requests
import os
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv('SARVAM_API_KEY')
api_url = "https://api.sarvam.ai/v1/chat/completions"

headers = {
    "api-subscription-key": api_key,
    "Content-Type": "application/json"
}

payload = {
    "model": "sarvam-m",
    "messages": [
        {"role": "system", "content": "Test prompt"},
        {"role": "user", "content": "Hello"}
    ],
    "temperature": 0.7
}

try:
    print(f"Testing Sarvam AI with Key: {api_key[:5]}...")
    response = requests.post(api_url, headers=headers, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
