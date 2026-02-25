from fastapi import APIRouter
from .logic import process_voice_input

router = APIRouter(tags=["Voice Services"])

router.post("/process-voice")(process_voice_input)