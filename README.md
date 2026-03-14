# ⚡ PromptCraft — Universal AI Prompt Engineering Toolkit

> **Stop getting bad AI outputs. Build perfect prompts for any AI tool in seconds — no experience needed.**

[![Live Demo](https://prompt-craft-gilt.vercel.app/)
[![GitHub Stars](https://img.shields.io/github/stars/faiqaarooj/promptcraft?style=for-the-badge)](https://github.com/faiqaarooj/promptcraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🤔 The Problem

Most people get disappointing results from AI tools — not because the AI is bad, but because their prompts are vague. Writing good prompts is a skill that takes months to learn through trial and error.

**PromptCraft solves this in 60 seconds.**

newsletter

---

## 🗂️ Project Structure

```
PromptCraft2/
├── src/               # React frontend
├── public/
├── backend/           # Node.js / Express REST API  ← NEW
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   │   ├── prompts.js
│   │   ├── favorites.js
│   │   └── templates.js
│   ├── data/
│   │   └── promptLibrary.js
│   └── package.json
└── package.json
```

---

## 🚀 Running Locally

### Frontend only (no backend required)

The app works completely in the browser using `localStorage`.  No IDE or server needed for this mode.

```bash
npm install
npm start          # opens http://localhost:3000
```

### Frontend + Backend (persistent server-side storage)

**Step 1 — start the backend**

```bash
cd backend
npm install
cp .env.example .env   # optional: change PORT or CORS_ORIGIN
npm start              # starts http://localhost:4000
```

**Step 2 — tell the frontend where the API lives**

```bash
# in the repo root
cp .env.example .env.local
# .env.local already contains: REACT_APP_API_URL=http://localhost:4000
```

**Step 3 — start the frontend**

```bash
npm start              # opens http://localhost:3000
```

When `REACT_APP_API_URL` is set the frontend automatically syncs prompt history with the backend.  If the backend is unreachable the app falls back to `localStorage` transparently.

---

## 🔌 REST API Reference

All endpoints return / accept `application/json`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Server health check |
| `GET` | `/api/prompts` | List saved prompt history |
| `POST` | `/api/prompts` | Save a prompt to history |
| `DELETE` | `/api/prompts` | Clear all history |
| `DELETE` | `/api/prompts/:id` | Remove one history entry |
| `GET` | `/api/favorites` | List saved favorites |
| `POST` | `/api/favorites` | Add a prompt to favorites |
| `DELETE` | `/api/favorites` | Clear all favorites |
| `DELETE` | `/api/favorites/:id` | Remove one favorite |
| `GET` | `/api/templates` | List all prompt templates |
| `GET` | `/api/templates?category=code` | Filter templates by category |
| `GET` | `/api/templates?tool=claude` | Filter templates by AI tool |
| `GET` | `/api/templates/:id` | Get a single template |

### Example — save a prompt

```bash
curl -X POST http://localhost:4000/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "You are a senior engineer. Debug this React error...",
    "framework": "rcat",
    "tool": "claude",
    "tone": "technical",
    "score": 92
  }'
```

---

