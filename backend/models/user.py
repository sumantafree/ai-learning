from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    username: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(200), nullable=True)

    # Learning profile
    level: Mapped[str] = mapped_column(String(50), default="beginner")  # beginner | intermediate | advanced
    goals: Mapped[str] = mapped_column(String(1000), nullable=True)

    # Gamification
    streak: Mapped[int] = mapped_column(default=0)
    total_tasks_completed: Mapped[int] = mapped_column(default=0)
    xp_points: Mapped[int] = mapped_column(default=0)

    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationships
    tasks: Mapped[list["Task"]] = relationship("Task", back_populates="owner", cascade="all, delete-orphan")
    notes: Mapped[list["Note"]] = relationship("Note", back_populates="owner", cascade="all, delete-orphan")
