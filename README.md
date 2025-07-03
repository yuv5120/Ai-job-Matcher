#  AI Job Matcher

AI-Powered Resume and Job Matching Platform using React, Node.js, FastAPI, PostgreSQL, and Redis.

---

## 🚀 Features

- 📝 Upload resumes (PDF)
- 🤖 Auto-parse resume data using NLP (spaCy)
- ⚙️ Match resumes with jobs using semantic similarity
- 📄 View uploaded resumes & match history
- ➕ Post jobs as a recruiter
- 🔐 Firebase Authentication
- ⚡ Redis caching for resume parsing
- 🐘 PostgreSQL via Prisma ORM
- 🔗 RESTful backend (Node.js) + ML API (FastAPI)

---

## 📦 Tech Stack

| Layer       | Technology                        |
|-------------|------------------------------------|
| Frontend    | React + Tailwind CSS               |
| Auth        | Firebase Authentication            |
| Backend API | Node.js + Express + Prisma ORM     |
| ML Service  | FastAPI + Python + spaCy           |
| NLP Model   | `en_core_web_md`                   |
| DB          | PostgreSQL                         |
| Cache       | Redis                              |
| Deployment  | Render, Railway, Supabase, Vercel  |

---

## 🧪 Resume Matching Logic

1. Parse resume using spaCy and PyMuPDF
2. Extract name, email, skills, experience (section-based)
3. Fetch job descriptions from DB
4. Use `spaCy.similarity()` to compute cosine similarity
5. Return top 5 matches above threshold (0.6+)

---

## 📁 Folder Structure

ai-job-matcher/  
├── server/ # Node.js backend  
├── ml/ # FastAPI ML service  
├── client/ # React frontend (not dockerized)  
├── docker-compose.yml

---

## 🐳 Run with Docker

```bash
docker-compose up --build
```
## PORTS:

Node.js: http://localhost:5001  
FastAPI: http://localhost:8000  
PostgreSQL: localhost:5432  
Redis: localhost:6379  

---
👨‍💻 Developed By

Yuvraj Singh Gour

🔗 GitHub  
📧 goursinghyuvraj0512@gmail.com  
🌐 LinkedIn  


