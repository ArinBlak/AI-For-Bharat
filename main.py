from fastapi import FastAPI
from voice_module.urls import router as voice_router

app = FastAPI(title="Yojana-Setu API")

app.include_router(voice_router, prefix="/api")