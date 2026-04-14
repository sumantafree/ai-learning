from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator


class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    full_name: Optional[str] = None
    level: str = "beginner"
    goals: Optional[str] = None

    @field_validator("username")
    @classmethod
    def username_alphanumeric(cls, v: str) -> str:
        if not v.replace("_", "").replace("-", "").isalnum():
            raise ValueError("Username must be alphanumeric (underscores and hyphens allowed)")
        if len(v) < 3 or len(v) > 50:
            raise ValueError("Username must be 3–50 characters")
        return v.lower()

    @field_validator("level")
    @classmethod
    def valid_level(cls, v: str) -> str:
        allowed = {"beginner", "intermediate", "advanced"}
        if v not in allowed:
            raise ValueError(f"Level must be one of: {', '.join(allowed)}")
        return v

    @field_validator("password")
    @classmethod
    def password_min_length(cls, v: str) -> str:
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    level: Optional[str] = None
    goals: Optional[str] = None


class UserOut(BaseModel):
    model_config = {"from_attributes": True}

    id: int
    email: str
    username: str
    full_name: Optional[str]
    level: str
    goals: Optional[str]
    streak: int
    total_tasks_completed: int
    xp_points: int
    is_active: bool
    created_at: datetime


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class TokenData(BaseModel):
    user_id: Optional[int] = None
