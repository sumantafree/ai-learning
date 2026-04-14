# Deployment Guide
# Render (Backend) + Supabase (DB) + cPanel Subdomain (Frontend)

---

## ARCHITECTURE

```
your-subdomain.yourdomain.com  →  Vercel (Next.js frontend)
        ↕ API calls
api.yourdomain.com (CNAME)     →  Render.com (FastAPI backend)
        ↕ DB queries
Supabase PostgreSQL (cloud DB)
```

---

## STEP 1 — Prepare Backend for Render.com

Create this file in the backend folder:

File: backend/render.yaml
```yaml
services:
  - type: web
    name: ai-learning-backend
    env: python
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: SECRET_KEY
        sync: false
      - key: OPENAI_API_KEY
        sync: false
      - key: GEMINI_API_KEY
        sync: false
      - key: ALLOWED_ORIGINS
        sync: false
```

---

## STEP 2 — Deploy Backend to Render.com

1. Push your code to GitHub:
   - Go to github.com → New repository → "ai-learning-backend"
   - Inside backend/ folder run:
     ```
     git init
     git add .
     git commit -m "Initial backend"
     git remote add origin https://github.com/YOUR_USERNAME/ai-learning-backend.git
     git push -u origin main
     ```

2. Go to render.com → Sign up free → "New Web Service"

3. Connect your GitHub repo

4. Settings:
   - Name: ai-learning-backend
   - Runtime: Python 3
   - Build Command: pip install -r requirements.txt
   - Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
   - Instance Type: Free

5. Add Environment Variables (click "Environment"):
   ```
   DATABASE_URL     = postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
   SECRET_KEY       = your-secret-key
   GEMINI_API_KEY   = AIzaSy...
   OPENAI_API_KEY   = sk-...
   ALLOWED_ORIGINS  = https://your-subdomain.yourdomain.com,http://localhost:3000
   ```

6. Click "Create Web Service"
   - Wait ~3 minutes for first deploy
   - Your backend URL will be: https://ai-learning-backend.onrender.com

7. Test it: https://ai-learning-backend.onrender.com/health
   Should return: {"status":"ok"}

---

## STEP 3 — Deploy Frontend to Vercel

1. Push frontend to GitHub:
   ```
   cd frontend
   git init
   git add .
   git commit -m "Initial frontend"
   git remote add origin https://github.com/YOUR_USERNAME/ai-learning-frontend.git
   git push -u origin main
   ```

2. Go to vercel.com → Sign up free → "New Project"

3. Import your frontend GitHub repo

4. Settings:
   - Framework: Next.js (auto-detected)
   - Root Directory: ./ (leave as is)

5. Add Environment Variable:
   ```
   NEXT_PUBLIC_API_URL = https://ai-learning-backend.onrender.com
   ```

6. Click "Deploy"
   - Your app URL: https://ai-learning-frontend.vercel.app

---

## STEP 4 — Point Your cPanel Subdomain to Vercel

This makes your app available at e.g. learn.yourdomain.com

### In cPanel:

1. Login to cPanel → "Zone Editor" or "DNS Zone Editor"

2. Add a CNAME record:
   ```
   Type:  CNAME
   Name:  learn          (this creates learn.yourdomain.com)
   Value: cname.vercel-dns.com
   TTL:   3600
   ```

3. Save

### In Vercel:

1. Go to your project → Settings → Domains
2. Add domain: learn.yourdomain.com
3. Vercel will verify the CNAME — takes 5-30 minutes

4. After verified, your app is live at: https://learn.yourdomain.com

---

## STEP 5 — Update ALLOWED_ORIGINS on Render

Once your subdomain is working, update the env var on Render:

```
ALLOWED_ORIGINS = https://learn.yourdomain.com,https://ai-learning-frontend.vercel.app
```

Go to Render → Your Service → Environment → Edit → Redeploy

---

## NOTES

### Free Tier Limits:
| Service  | Limit                              |
|----------|------------------------------------|
| Render   | Sleeps after 15 min inactivity     |
| Vercel   | 100GB bandwidth/month              |
| Supabase | 500MB DB, 2GB file storage         |
| Gemini   | 1,500 requests/day free            |

### To avoid Render sleep (optional):
Set up a free cron job at cron-job.org to ping your backend every 10 min:
```
URL: https://ai-learning-backend.onrender.com/health
Every: 10 minutes
```

---

## QUICK CHECKLIST

- [ ] Backend pushed to GitHub
- [ ] Backend deployed on Render with env vars
- [ ] Backend health check passes
- [ ] Frontend pushed to GitHub  
- [ ] Frontend deployed on Vercel
- [ ] NEXT_PUBLIC_API_URL set to Render URL
- [ ] CNAME record added in cPanel
- [ ] Custom domain verified on Vercel
- [ ] ALLOWED_ORIGINS updated on Render
- [ ] Test register + login on live URL
- [ ] Test Generate Task on live URL
