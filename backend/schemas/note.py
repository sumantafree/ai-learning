from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NoteCreate(BaseModel):
    title: str
    content: str
    tags: Optional[str] = None
    task_id: Optional[int] = None


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[str] = None


class NoteOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    owner_id: int
    title: str
    content: str
    ai_summary: Optional[str]
    tags: Optional[str]
    task_id: Optional[int]
    created_at: datetime
    updated_at: datetime


class SummarizeRequest(BaseModel):
    note_id: int
    provider: str = "openai"
