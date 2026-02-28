from agent_service import AgentService
import os
from dotenv import load_dotenv

load_dotenv()

def interactive_chat():
    service = AgentService()
    print("--- Namaste! I am Yojna Setu. ---")
    print("Type 'exit' to quit.\n")
    
    # Simulated profile for testing
    user_profile = {"name": "Arijeet", "occupation": "Farmer", "location": "West Bengal"}
    history = []
    
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['exit', 'quit']:
            break
        
        print("\nThinking...")
        response = service.chat(user_input, conversation_history=history, user_profile=user_profile)
        
        print(f"\nYojna Setu: {response}\n")
        
        # Update history (simplified for CLI demo)
        history.append({"role": "user", "content": user_input})
        history.append({"role": "assistant", "content": response})

if __name__ == "__main__":
    interactive_chat()
