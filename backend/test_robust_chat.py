from agent_service import AgentService
import json

def test_robust_chat():
    service = AgentService()
    print("Testing Robust Chat Service...")
    
    user_msg = "Mujhe kisan yojna ke baare mein batao."
    user_profile = {"name": "Arijeet", "occupation": "Farmer"}
    
    response = service.chat(user_msg, user_profile=user_profile)
    print(f"\nFINAL AI RESPONSE:\n{response}")

if __name__ == "__main__":
    test_robust_chat()
