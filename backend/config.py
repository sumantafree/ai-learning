from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/ai_learning_db"

    # JWT
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    # Gemini (optional)
    GEMINI_API_KEY: Optional[str] = None

    # App
    APP_NAME: str = "AI Learning System"
    DEBUG: bool = True
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    @property
    def origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    @property
    def db_url(self) -> str:
        """Convert postgresql:// to postgresql+psycopg:// for psycopg3 driver."""
        url = self.DATABASE_URL
        if url.startswith("postgresql://") or url.startswith("postgres://"):
            url = url.replace("postgresql://", "postgresql+psycopg://", 1)
            url = url.replace("postgres://", "postgresql+psycopg://", 1)
        return url


settings = Settings()
