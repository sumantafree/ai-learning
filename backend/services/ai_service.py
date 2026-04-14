import google.generativeai as genai
from config import settings


# =========================
# Configure Gemini
# =========================
if not settings.GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY is not set")

genai.configure(api_key=settings.GEMINI_API_KEY)

model = genai.GenerativeModel(settings.GEMINI_MODEL)


# =========================
# Generate Daily Task
# =========================
def generate_daily_task(level: str, goals: str, topic: str = None, provider: str = "gemini") -> dict:
    """
    Generate a structured AI learning task using Gemini.
    Returns data compatible with TaskCreate schema.
    """

    prompt = f"""
You are an AI mentor.

Create a structured daily learning task.

User Level: {level}
User Goals: {goals}
Topic Focus: {topic or "General AI Learning"}

Return ONLY in JSON format:

{{
  "title": "Short task title",
  "description": "Detailed explanation of what to do",
  "priority": "high",
  "estimated_time": 60
}}
"""

    try:
        response = model.generate_content(prompt)

        text = response.text.strip()

        # Clean response (Gemini may wrap JSON in markdown)
        if "```" in text:
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]

        import json
        data = json.loads(text)

        return data

    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")