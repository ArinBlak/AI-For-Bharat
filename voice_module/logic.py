import os
from fastapi import UploadFile, File
from sarvamai import SarvamAI
from dotenv import load_dotenv

load_dotenv()

client = SarvamAI(api_subscription_key=os.getenv("SARVAM_API_KEY"))

conversation_history = [
    {"role": "system", "content": "You are a rural government scheme assistant for Yojana-Setu. Provide helpful and concise answers."}
]

async def process_voice_input(audio_file: UploadFile = File(...)):
    temp_path = f"temp_{audio_file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await audio_file.read())

    with open(temp_path, "rb") as f:
        stt_response = client.speech_to_text.transcribe(
            file=f,
            model="saaras:v3",
            mode="transcribe"
        )
    user_text = stt_response.transcript
    os.remove(temp_path)

    conversation_history.append({"role": "user", "content": user_text})
    
    chat_response = client.chat.completions(
        messages=conversation_history
    )
    
    agent_text_response = chat_response.choices[0].message.content
    conversation_history.append({"role": "assistant", "content": agent_text_response})

    tts_response = client.text_to_speech.convert(
        text=agent_text_response,
        target_language_code="hi-IN",
        model="bulbul:v3",
        speaker="shubh" 
    )

    audio_data = tts_response.audios[0] if hasattr(tts_response, 'audios') else tts_response.get("audios", [""])[0]

    return {
        "user_text": user_text,
        "agent_text": agent_text_response,
        "audio_base64": audio_data 
    }