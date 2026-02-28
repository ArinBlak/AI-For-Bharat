import requests

url = "http://localhost:8000/chat"
data = {
    "message": "I want to apply for the scheme",
    "phone": "9876543210",
    "history": "[]"
}

try:
    response = requests.post(url, data=data)
    print(f"Status: {response.status_code}")
    print(f"Reply: {response.json().get('reply')}")
except Exception as e:
    print(f"Error: {e}")
