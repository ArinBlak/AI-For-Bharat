from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
import uvicorn
import os
import uuid
from dotenv import load_dotenv

# Import our custom services
from voice_service import VoiceService
from agent_service import AgentService
from storage_service import StorageService

load_dotenv()

app = FastAPI(title="Yojana-Setu API")

# Enable CORS for frontend simulator
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
# In a real app, these would be injected or properly handled
voice_service = VoiceService()
agent_service = AgentService()
storage_service = StorageService()

@app.get("/")
async def root():
    return {"message": "Welcome to Yojana-Setu AI Backend (Hackathon Ready)"}

@app.post("/register")
async def register(
    username: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...)
):
    """
    Registers a new user and saves to DynamoDB.
    """
    try:
        profile = {
            "user_id": phone,
            "username": username,
            "email": email,
            "phone": phone,
            "aadhar": "", # To be collected by AI
            "district": "", # To be collected by AI
            "status": "Registered"
        }
        success = storage_service.save_user_profile(profile)
        if success:
            return {"status": "Success", "message": f"User {username} registered successfully"}
        else:
            raise HTTPException(status_code=500, detail="Failed to save to database")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
async def chat(
    message: str = Form(...), 
    phone: str = Form(...), 
    history: str = Form("[]")
):
    """
    Handles text-based interaction from the UI.
    Uses the real profile from DynamoDB.
    """
    try:
        # 1. Fetch User Profile from DynamoDB
        user_profile = storage_service.get_user_profile(phone)
        
        # 2. Convert history string to list
        import json
        history_list = json.loads(history)
        
        # 3. Get AI Response
        reply = agent_service.chat(message, history_list, user_profile)
        
        # Update profile if AI extracted new info (Simplified for demo)
        # In a real app, the AI would return structured data to update DynamoDB
        
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-voice")
async def process_voice(
    file: UploadFile = File(...), 
    phone: str = Form("9876543210"),
    language: str = Form("hi-IN")
):
    """
    Handles Voice Notes: Upload to S3 -> Transcribe -> Bedrock -> Polly -> Response
    """
    try:
        # 1. Upload to S3
        file_content = await file.read()
        file_name = f"voice/{phone}/{uuid.uuid4()}.mp3"
        s3_uri = storage_service.upload_to_s3(file_content, file_name)
        
        if not s3_uri:
            return JSONResponse({"error": "S3 Upload failed"}, status_code=500)
        
        # 2. Transcribe
        transcript = voice_service.speech_to_text(s3_uri, language_code=language)
        if not transcript:
            return JSONResponse({"error": "Transcription failed"}, status_code=500)
            
        # 3. Get AI Response
        user_profile = storage_service.get_user_profile(phone)
        reply = agent_service.chat(transcript, [], user_profile)
        
        # 4. (Optional) Convert reply to speech using Polly
        audio_reply = voice_service.text_to_speech(reply, language_code=language)
        
        return {
            "transcript": transcript, 
            "reply": reply,
            "has_audio": audio_reply is not None
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/apply")
async def apply(
    scheme_name: str = Form(...), 
    phone: str = Form(...)
):
    """
    Endpoint for the agent to 'auto-apply' for a scheme.
    """
    user_profile = storage_service.get_user_profile(phone)
    result = agent_service.apply_for_scheme(phone, scheme_name, user_profile)
    return result

if __name__ == "__main__":
    # Ensure region is set for boto3
    if not os.getenv('AWS_REGION'):
        os.environ['AWS_REGION'] = 'ap-south-1'
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
