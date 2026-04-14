"""
AI Service Layer
────────────────
Supports OpenAI and Gemini.
Auto-selects Gemini if no OpenAI key is set.
"""

import json
import re
from typing import Optional
from config import settings


# ── Provider auto-detection ───────────────────────────────────────────────────

def _default_provider() -> str:
    """Prefer Gemini when GEMINI_API_KEY is set."""
    if settings.GEMINI_API_KEY:
        return "gemini"
    return "openai"


# ── Prompt Templates ──────────────────────────────────────────────────────────

TASK_GENERATION_PROMPT = """
You are an expert AI Mentor specializing in teaching AI/ML concepts to learners of all levels.
Create a comprehensive daily AI learning plan for:
- Level: {level}
- Goals: {goals}
- Topic focus: {topic}

Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{{
  "title": "Daily AI Learning: <short topic title>",
  "description": "2-3 sentence overview of today's learning journey",
  "concept": "Detailed explanation of the core concept (3-5 paragraphs)",
  "ai_task": "Step-by-step practical task the learner must complete (numbered list)",
  "mini_project": "A mini project to build that applies today's concept (with clear deliverable)",
  "tools": "Comma-separated list of tools, libraries, or platforms to use today",
  "challenge": "A stretch challenge for learners who finish early",
  "topic": "Single topic label (e.g. Prompt Engineering)",
  "difficulty": "{level}",
  "xp_reward": 20
}}
""".strip()

NOTE_SUMMARY_PROMPT = """
You are a knowledge curator. Summarize this note and extract key insights.

Title: {title}
Content: {content}

Return ONLY valid JSON (no markdown, no extra text) with this exact structure:
{{
  "summary": "Concise 2-4 sentence summary",
  "key_points": ["point 1", "point 2", "point 3"],
  "action_items": ["action 1", "action 2"],
  "suggested_tags": ["tag1", "tag2", "tag3"]
}}
""".strip()


# ── Gemini call ───────────────────────────────────────────────────────────────

def _call_gemini(prompt: str) -> str:
    from google import genai
    from google.genai import types
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
        ),
    )
    return response.text


# ── OpenAI call ───────────────────────────────────────────────────────────────

def _call_openai(prompt: str) -> str:
    from openai import OpenAI
    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        response_format={"type": "json_object"},
    )
    return response.choices[0].message.content


# ── Core dispatcher ───────────────────────────────────────────────────────────

def _llm_call(prompt: str, provider: Optional[str] = None) -> dict:
    if not provider or provider == "auto":
        provider = _default_provider()

    if provider == "gemini":
        raw = _call_gemini(prompt)
    else:
        raw = _call_openai(prompt)

    # Strip markdown code fences if model wraps them anyway
    clean = re.sub(r"```(?:json)?|```", "", raw).strip()
    return json.loads(clean)


# ── Public service functions ──────────────────────────────────────────────────

def generate_daily_task(
    level: str,
    goals: str,
    topic: Optional[str] = None,
    provider: Optional[str] = None,
) -> dict:
    prompt = TASK_GENERATION_PROMPT.format(
        level=level,
        goals=goals or "Become an AI generalist",
        topic=topic or "any relevant AI/ML topic",
    )
    data = _llm_call(prompt, provider)

    def to_str(val, default="") -> str:
        """Coerce list/dict to string — Gemini sometimes returns lists."""
        if isinstance(val, list):
            return "\n".join(f"{i+1}. {item}" for i, item in enumerate(val))
        if isinstance(val, dict):
            return str(val)
        return val or default

    return {
        "title":        to_str(data.get("title"), "Daily AI Learning Task"),
        "description":  to_str(data.get("description")),
        "concept":      to_str(data.get("concept")),
        "ai_task":      to_str(data.get("ai_task")),
        "mini_project": to_str(data.get("mini_project")),
        "tools":        to_str(data.get("tools")),
        "challenge":    to_str(data.get("challenge")),
        "topic":        to_str(data.get("topic"), topic or "General AI"),
        "difficulty":   to_str(data.get("difficulty"), level),
        "xp_reward":    int(data.get("xp_reward", 20)),
        "task_type":    "daily_plan",
    }


def summarize_note(
    title: str,
    content: str,
    provider: Optional[str] = None,
) -> dict:
    prompt = NOTE_SUMMARY_PROMPT.format(title=title, content=content)
    data = _llm_call(prompt, provider)
    return {
        "summary":        data.get("summary", ""),
        "key_points":     data.get("key_points", []),
        "action_items":   data.get("action_items", []),
        "suggested_tags": data.get("suggested_tags", []),
    }
