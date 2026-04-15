from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
from backend.config import settings

router = APIRouter(prefix="/api/ai", tags=["AI Chat"])

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel(settings.GEMINI_MODEL)


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
def chat(req: ChatRequest):
    try:
        response = model.generate_content(req.message)
        return {"reply": response.text}
    except Exception as e:
        return {"reply": "Sorry, AI is not available right now."}