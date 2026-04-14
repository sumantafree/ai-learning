"""
AI Learning System — FastAPI Backend
Entry point: uvicorn main:app --reload
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import create_tables
from routes import auth, tasks, notes, ai

app = FastAPI(
    title=settings.APP_NAME,
    description="Production-grade AI Learning System API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Startup ───────────────────────────────────────────────────────────────────
@app.on_event("startup")
def on_startup():
    create_tables()
    print(f"[OK] {settings.APP_NAME} started - DB tables ready")


# ── Routes ────────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(notes.router)
app.include_router(ai.router)


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health():
    return {"status": "ok", "app": settings.APP_NAME, "version": "1.0.0"}


@app.get("/", tags=["Root"])
def root():
    return {
        "message": f"Welcome to {settings.APP_NAME} API",
        "docs": "/docs",
        "health": "/health",
    }
