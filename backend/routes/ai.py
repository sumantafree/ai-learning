from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.user import User
from schemas.task import TaskOut, GenerateTaskRequest
from schemas.task import TaskCreate
from services import ai_service, task_service
from core.dependencies import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Mentor"])


@router.post("/generate-task", response_model=TaskOut)
def generate_task(
    req: GenerateTaskRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Generate a structured daily AI learning task using the AI Mentor engine.
    The task is automatically saved to the user's task list.
    """
    level = req.level or current_user.level
    goals = req.goals or current_user.goals or "Become an AI generalist"

    try:
        ai_data = ai_service.generate_daily_task(
            level=level,
            goals=goals,
            topic=req.topic,
            provider=req.provider,
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"AI generation failed: {str(e)}")

    task_data = TaskCreate(**ai_data)
    return task_service.create_task(db, current_user.id, task_data)


@router.get("/learning-path")
def get_learning_path(
    current_user: User = Depends(get_current_user),
):
    """Return a static learning path recommendation based on user level."""
    paths = {
        "beginner": [
            "Week 1: Python for AI — NumPy, Pandas basics",
            "Week 2: Machine Learning fundamentals — scikit-learn",
            "Week 3: Deep Learning intro — PyTorch / TensorFlow",
            "Week 4: LLMs & Prompt Engineering",
            "Week 5: Build your first AI app with OpenAI API",
            "Week 6: RAG systems & vector databases",
        ],
        "intermediate": [
            "Week 1: Advanced Prompt Engineering & Chain-of-Thought",
            "Week 2: LangChain / LlamaIndex — building AI pipelines",
            "Week 3: RAG systems in production",
            "Week 4: Fine-tuning LLMs (LoRA, PEFT)",
            "Week 5: AI Agents — ReAct, tool use, planning",
            "Week 6: Deploy AI apps — FastAPI + Vercel + Railway",
        ],
        "advanced": [
            "Week 1: Multi-agent systems design",
            "Week 2: Custom model training — distributed setup",
            "Week 3: MLOps — experiment tracking, model serving",
            "Week 4: AI product architecture & SaaS patterns",
            "Week 5: AI safety & evaluation frameworks",
            "Week 6: Build & launch a production AI SaaS",
        ],
    }
    return {
        "level": current_user.level,
        "goals": current_user.goals,
        "path": paths.get(current_user.level, paths["beginner"]),
        "xp_points": current_user.xp_points,
        "streak": current_user.streak,
    }
