from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from backend.models.task import TaskStatus, TaskType


class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    concept: Optional[str] = None
    ai_task: Optional[str] = None
    mini_project: Optional[str] = None
    tools: Optional[str] = None
    challenge: Optional[str] = None
    task_type: TaskType = TaskType.daily_plan
    difficulty: str = "beginner"
    topic: Optional[str] = None
    xp_reward: int = 10


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    concept: Optional[str] = None
    ai_task: Optional[str] = None
    mini_project: Optional[str] = None
    tools: Optional[str] = None
    challenge: Optional[str] = None
    difficulty: Optional[str] = None
    topic: Optional[str] = None


class TaskOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    owner_id: int
    title: str
    description: Optional[str]
    concept: Optional[str]
    ai_task: Optional[str]
    mini_project: Optional[str]
    tools: Optional[str]
    challenge: Optional[str]
    task_type: TaskType
    status: TaskStatus
    difficulty: str
    topic: Optional[str]
    xp_reward: int
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime]


class GenerateTaskRequest(BaseModel):
    topic: Optional[str] = None
    level: Optional[str] = None       # override user level
    goals: Optional[str] = None       # override user goals
    provider: str = "auto"            # auto | openai | gemini
