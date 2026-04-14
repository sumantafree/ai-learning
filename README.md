# AI Learning System

Production-grade AI-powered learning platform. Generates personalized daily learning tasks, tracks progress, and manages your AI knowledge base.

---

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (or use Supabase/Neon free tier)
- OpenAI API key

---

## Step 1 — Backend Setup

```bash
cd backend

# 1. Create virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Mac/Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create .env file
copy .env.example .env
# Then edit .env with your values:
#   DATABASE_URL = your PostgreSQL connection string
#   SECRET_KEY   = any random string (openssl rand -hex 32)
#   OPENAI_API_KEY = sk-...

# 4. Run the API
uvicorn main:app --reload --port 8000
```

Backend will be live at: http://localhost:8000
API docs at: http://localhost:8000/docs

---

## Step 2 — Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Create .env.local
copy .env.local.example .env.local
# Default value is fine for local dev:
#   NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. Run development server
npm run dev
```

Frontend will be live at: http://localhost:3000

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login, get JWT token |
| GET | /auth/me | Get current user |
| PUT | /auth/me | Update profile |
| GET | /tasks/ | List all tasks |
| POST | /tasks/ | Create task |
| PUT | /tasks/{id} | Update task |
| DELETE | /tasks/{id} | Delete task |
| GET | /tasks/stats | Get task statistics |
| GET | /notes/ | List notes |
| POST | /notes/ | Create note |
| PUT | /notes/{id} | Update note |
| POST | /notes/{id}/summarize | AI summarize note |
| POST | /ai/generate-task | Generate AI daily task |
| GET | /ai/learning-path | Get personalized path |

---

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/ai_learning_db
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
DEBUG=True
ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Deployment

### Frontend → Vercel
```bash
cd frontend
npm run build          # verify no build errors first
npx vercel             # follow prompts
# Set env var: NEXT_PUBLIC_API_URL=https://your-backend.railway.app
```

### Backend → Railway
1. Push code to GitHub
2. Create new project on Railway → Deploy from GitHub
3. Set environment variables (DATABASE_URL, SECRET_KEY, OPENAI_API_KEY, ALLOWED_ORIGINS)
4. Railway auto-detects Python, runs: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Database → Supabase (free)
1. Create project at supabase.com
2. Go to Settings → Database → Connection string
3. Use `postgresql://...` URI as DATABASE_URL
4. Tables are auto-created on first startup

---

## Phase 2 Architecture Plan

### Multi-Agent System
```
MentorAgent     → generates learning plans, adapts to progress
BuilderAgent    → guides project implementation
DebuggerAgent   → helps fix errors, explains mistakes
OrchestratorAgent → routes tasks between agents
```
Tech: LangGraph or CrewAI, shared memory via Redis

### RAG Knowledge Base
```
User uploads docs/PDFs/notes
→ Chunked + embedded (OpenAI text-embedding-3-small)
→ Stored in pgvector (Supabase) or Pinecone
→ Retrieved during task generation for context
```

### WhatsApp + Email Automation
```
Daily digest via SendGrid/Resend (email)
WhatsApp alerts via Twilio or Meta Cloud API
Trigger: cron job at 8am → generate task → send message
```

### SaaS Multi-Tenant
```
Add: organization_id to all models
Add: Stripe subscription (Basic/Pro/Team)
Add: usage tracking per user per month
Add: admin dashboard with analytics
Auth: Switch to Clerk or Auth0 for OAuth
```
