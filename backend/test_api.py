import requests
import json

# Replace with your actual backend URL if different
BASE_URL = "http://localhost:8000"

def test_root():
    response = requests.get(f"{BASE_URL}/")
    print(f"Root: {response.json()}")

def test_chat(message):
    print(f"\nTesting Chat: {message}")
    data = {
        "message": message,
        "phone": "9876543210",
        "history": json.dumps([])
    }
    response = requests.post(f"{BASE_URL}/chat", data=data)
    if response.status_code == 200:
        print(f"AI Response: {response.json()['reply']}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

def test_apply(scheme):
    print(f"\nTesting Apply: {scheme}")
    data = {
        "scheme_name": scheme,
        "phone": "9876543210"
    }
    response = requests.post(f"{BASE_URL}/apply", data=data)
    print(f"Apply Result: {response.json()}")

if __name__ == "__main__":
    import sys
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    print("--- Yojana Setu Backend Test Script ---")
    try:
        test_root()
        test_chat("Namaste, mujhe PM Awas Yojana ke baare mein bataiye.")
        test_chat("Mera ghar toot gaya hai baarish ki wajah se.")
        test_apply("PM Awas Yojana")
    except Exception as e:
        print(f"Could not connect to backend. Is uvicorn running? \nError: {e}")
