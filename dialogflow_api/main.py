from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from dialogflow_service import detect_intent_texts
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat_endpoint(req: ChatRequest):
    reply = detect_intent_texts(req.message)
    return {"reply": reply}
