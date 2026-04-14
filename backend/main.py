"""
AI Learning System — FastAPI Backend
Production Entry: uvicorn main:app --host 0.0.0.0 --port $PORT
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import settings
from backend.database import create_tables
from backend.routes import auth, tasks, notes, ai


# =========================
# App Initialization
# =========================
app = FastAPI(
    title=settings.APP_NAME,
    description="Production-grade AI Learning System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)


# =========================
# CORS Middleware
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list if hasattr(settings, "origins_list") else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Startup Event
# =========================
@app.on_event("startup")
def on_startup():
    try:
        create_tables()
        print(f"[OK] {settings.APP_NAME} started - DB tables ready")
    except Exception as e:
        print(f"[ERROR] Startup failed: {e}")


# =========================
# Routes
# =========================
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])


# =========================
# Health Check (CRITICAL for Render)
# =========================
@app.get("/health", tags=["Health"])
def health():
    return {
        "status": "ok",
        "app": settings.APP_NAME,
        "version": "1.0.0"
    }


# =========================
# Root Endpoint
# =========================
@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": "/docs",
        "health": "/health"
    }
