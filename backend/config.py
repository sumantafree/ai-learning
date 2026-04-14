from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional, List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

    # =========================
    # Database
    # =========================
    DATABASE_URL: str = ""

    # =========================
    # Security (JWT)
    # =========================
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    # =========================
   # AI Configuration
   # =========================
   GEMINI_API_KEY: str
   GEMINI_MODEL: str = "gemini-1.5-flash"

   OPENAI_API_KEY: Optional[str] = None  # not used
   OPENAI_MODEL: Optional[str] = None

    # =========================
    # App Config
    # =========================
    APP_NAME: str = "AI Learning System"
    DEBUG: bool = False  # IMPORTANT: False for production
    ALLOWED_ORIGINS: str = "*"  # Allow all (safe for API stage)

    # =========================
    # Derived Properties
    # =========================
    @property
    def origins_list(self) -> List[str]:
        if self.ALLOWED_ORIGINS == "*":
            return ["*"]
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]

    @property
    def db_url(self) -> str:
        """
        Convert postgresql:// to postgresql+psycopg:// for psycopg3 driver
        (Required for SQLAlchemy + psycopg3)
        """
        url = self.DATABASE_URL

        if not url:
            raise ValueError("DATABASE_URL is not set")

        if url.startswith("postgresql://") or url.startswith("postgres://"):
            url = url.replace("postgresql://", "postgresql+psycopg://", 1)
            url = url.replace("postgres://", "postgresql+psycopg://", 1)

        return url


# =========================
# Singleton Settings
# =========================
settings = Settings()
