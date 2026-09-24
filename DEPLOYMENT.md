# NextGenAI Buddy — Deployment Guide

This guide details deployment procedures across local workstations, containerized Docker environments, and cloud platforms (Vercel, Netlify, Render, Fly.io).

---

## 1. Local Production Deployment (macOS / Linux / Windows)

### Prerequisites
- Python 3.10+ (Built-in standard library, zero pip dependencies required)
- Modern web browser (Chrome, Safari, Edge, Firefox)

### Running Full-Stack Server
```bash
cd /Users/snehamehta/.gemini/antigravity/scratch/nextgenai-buddy
python3 server.py
```
Platform launches at `http://localhost:8000`.  
The database `nextgenai.db` is automatically created with tables and realistic seed data on first boot.

### 1-Click Launch on macOS
Simply double-click `Launch_Website.command` in Finder.

---

## 2. Containerized Deployment (Docker)

Create a `Dockerfile` in the project root:

```dockerfile
FROM python:3.14-slim

WORKDIR /app
COPY . /app

# Ensure correct permissions
RUN chmod +x /app/server.py

EXPOSE 8000
ENV PORT=8000
ENV HOST=0.0.0.0

CMD ["python3", "server.py"]
```

### Build & Run
```bash
docker build -t nextgenai-buddy .
docker run -p 8000:8000 -v $(pwd)/data:/app/data nextgenai-buddy
```

---

## 3. Serverless Cloud Platforms

### Deploying Full-Stack to Render / Railway / Fly.io
1. Connect your GitHub repository.
2. Select **Web Service**.
3. Set **Build Command**: `python3 build_standalone.py`
4. Set **Start Command**: `python3 server.py`
5. Configure Environment Variables:
   - `PORT`: `8000`
   - `SECRET_KEY`: `<your-production-secret-key>`
6. Deploy!

### Deploying Static Frontend to Vercel / Netlify
Because NextGenAI Buddy features a universal persistence engine, it can run as a zero-backend static SPA with in-browser LocalStorage synchronization:

1. Push the repository to GitHub.
2. Link the repository in [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. If using Vite:
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
4. If hosting standalone:
   - Simply serve `standalone.html` as the primary entry point.

---

## 4. Production Checklist

- [x] SQLite database schema initialized with indices and constraints.
- [x] Password hashing using PBKDF2-HMAC-SHA256 (100,000 rounds).
- [x] Client router handles all 18 functional routes with browser back/forward buttons.
- [x] Dual-mode data service gracefully falls back to LocalStorage when offline.
- [x] Asymptotic code evaluation verifies real inputs and edge cases.
- [x] 3-way theme system (Light `#F8F6F1` / Dark / System) verified across all pages.
- [x] Automated test suites passing 100%.
