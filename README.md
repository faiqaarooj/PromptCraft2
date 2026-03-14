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

## 🚀 Running Locally (Frontend + Backend)

You don't need an IDE — a terminal is enough. The project has two parts: a **React frontend** and an **Express backend**.

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or newer (includes npm)

### 1 — Clone the repository

```bash
git clone https://github.com/faiqaarooj/PromptCraft2.git
cd PromptCraft2
```

### 2 — Start the backend

```bash
cd backend
npm install
npm start          # runs on http://localhost:3001
```

The backend exposes a REST API:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/prompts` | Fetch saved prompt history |
| `POST` | `/api/prompts` | Save a new prompt |
| `DELETE` | `/api/prompts/:id` | Remove a single prompt |
| `DELETE` | `/api/prompts` | Clear all history |
| `GET` | `/api/favorites` | Fetch favourite prompt IDs |
| `POST` | `/api/favorites/:id` | Add a prompt to favourites |
| `DELETE` | `/api/favorites/:id` | Remove from favourites |

To customise the port or allowed frontend URL, copy `.env.example` to `.env` inside the `backend/` folder and edit the values.

### 3 — Start the frontend

Open a **second terminal** and run:

```bash
# From the project root
npm install
REACT_APP_API_URL=http://localhost:3001 npm start
# runs on http://localhost:3000
```

The `REACT_APP_API_URL` variable tells the frontend where to find the backend. If you omit it the app still works, using `localStorage` for persistence instead.

> **Windows (cmd.exe):** use `set REACT_APP_API_URL=http://localhost:3001 && npm start`  
> **Windows (PowerShell):** use `$env:REACT_APP_API_URL="http://localhost:3001"; npm start`

---
