from datetime import datetime
from sqlalchemy import String, Text, ForeignKey, DateTime, func, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
import enum
from database import Base


class TaskStatus(str, enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    completed = "completed"
    skipped = "skipped"


class TaskType(str, enum.Enum):
    concept = "concept"
    exercise = "exercise"
    project = "project"
    challenge = "challenge"
    daily_plan = "daily_plan"


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    title: Mapped[str] = mapped_column(String(500), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)

    # AI-generated structured content
    concept: Mapped[str] = mapped_column(Text, nullable=True)
    ai_task: Mapped[str] = mapped_column(Text, nullable=True)
    mini_project: Mapped[str] = mapped_column(Text, nullable=True)
    tools: Mapped[str] = mapped_column(Text, nullable=True)
    challenge: Mapped[str] = mapped_column(Text, nullable=True)

    task_type: Mapped[TaskType] = mapped_column(
        Enum(TaskType, name="tasktype"), default=TaskType.daily_plan
    )
    status: Mapped[TaskStatus] = mapped_column(
        Enum(TaskStatus, name="taskstatus"), default=TaskStatus.pending
    )

    # Learning metadata
    difficulty: Mapped[str] = mapped_column(String(50), default="beginner")
    topic: Mapped[str] = mapped_column(String(200), nullable=True)
    xp_reward: Mapped[int] = mapped_column(default=10)

    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())
    completed_at: Mapped[datetime] = mapped_column(DateTime, nullable=True)

    owner: Mapped["User"] = relationship("User", back_populates="tasks")
