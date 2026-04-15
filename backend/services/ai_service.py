import json
import google.generativeai as genai
from backend.config import settings


# =========================
# Configure Gemini
# =========================
if not settings.GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set")

genai.configure(api_key=settings.GEMINI_API_KEY)
model = genai.GenerativeModel(settings.GEMINI_MODEL)


# =========================
# Generate Daily Task (FIXED)
# =========================
def generate_daily_task(level: str, goals: str, topic: str = None, provider: str = "gemini") -> dict:
    prompt = f"""
You are an AI mentor.

Create a structured daily learning task.

User Level: {level}
User Goals: {goals}
Topic Focus: {topic or "General AI Learning"}

Return ONLY valid JSON (no explanation):

{{
  "title": "Short task title",
  "description": "Detailed explanation",
  "priority": "high",
  "estimated_time": 60
}}
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()

        # 🔥 CLEAN RESPONSE PROPERLY
        if "```" in text:
            text = text.split("```")[1]
        
        if text.startswith("json"):
            text = text.replace("json", "", 1)

        # 🔥 EXTRACT JSON SAFELY
        start = text.find("{")
        end = text.rfind("}") + 1
        json_text = text[start:end]

        data = json.loads(json_text)

        return data

    except Exception as e:
        print("Gemini Error:", str(e))

        # 🔥 FALLBACK (prevents 502 crash)
        return {
            "title": "Learn AI Basics",
            "description": "Study AI fundamentals and complete a small practice task.",
            "priority": "medium",
            "estimated_time": 60
        }