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

## 🖥️ Backend Setup

PromptCraft now includes an **Express.js REST API** — no external IDE required, just Node.js installed on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Folder structure

```
PromptCraft2/
├── src/          ← React frontend
├── public/
├── backend/      ← Express backend
│   ├── server.js
│   ├── routes/
│   │   ├── history.js    # saved prompts
│   │   ├── favorites.js  # starred library prompts
│   │   └── prompts.js    # prompt library
│   ├── .env.example
│   └── package.json
└── package.json
```

### Run the backend

```bash
# 1. Install backend dependencies (one-time)
npm run backend:install

# 2. Copy the example env file and edit if needed
cp backend/.env.example backend/.env

# 3. Start the backend (http://localhost:4000)
npm run backend

# Or start with auto-reload during development
npm run backend:dev
```

### Run the frontend (separate terminal)

```bash
npm install   # install frontend deps (one-time)
npm start     # http://localhost:3000
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server health check |
| `GET` | `/api/prompts` | List all library prompts |
| `GET` | `/api/prompts?category=code&tool=claude&search=debug` | Filter prompts |
| `GET` | `/api/prompts/:id` | Get a single prompt |
| `GET` | `/api/history` | List saved prompt history |
| `POST` | `/api/history` | Save a prompt to history |
| `DELETE` | `/api/history` | Clear all history |
| `DELETE` | `/api/history/:id` | Remove a single history entry |
| `GET` | `/api/favorites` | List favorite prompt IDs |
| `POST` | `/api/favorites` | Add a prompt to favorites |
| `DELETE` | `/api/favorites/:id` | Remove a prompt from favorites |

### Example request

```bash
# Save a prompt to history
curl -X POST http://localhost:4000/api/history \
  -H "Content-Type: application/json" \
  -d '{"prompt":"You are an expert…","framework":"R-C-A-T","tool":"Claude","score":90}'
```

> **Note:** The backend currently uses an **in-memory store** — data resets when the server restarts.
> Swap the arrays in `backend/routes/history.js` and `backend/routes/favorites.js` with a database
> (e.g. MongoDB, PostgreSQL, or SQLite) when you need persistence.

---
