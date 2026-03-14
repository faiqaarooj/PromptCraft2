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

## 🖥️ Backend API

PromptCraft now ships with a lightweight **Node.js / Express** REST API so you can persist prompts and favorites on a server instead of (or in addition to) the browser's `localStorage`.

### Quick Start

```bash
# 1. Enter the backend directory
cd backend

# 2. Install dependencies (only needed once)
npm install

# 3. (Optional) create a .env file from the template
cp .env.example .env
# Edit .env to set PORT and ALLOWED_ORIGINS if needed

# 4. Start the server
npm start
# → PromptCraft API running at http://localhost:5000
```

> **No IDE required** — you can run all of the above commands directly in any terminal (including the one built into GitHub Codespaces, Replit, or a cloud shell).

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/prompts` | List all saved prompts |
| `POST` | `/api/prompts` | Save a new prompt |
| `DELETE` | `/api/prompts/:id` | Delete a prompt by ID |
| `GET` | `/api/favorites` | List all favorites |
| `POST` | `/api/favorites` | Add a prompt to favorites |
| `DELETE` | `/api/favorites/:id` | Remove a favorite by ID |

#### Example – save a prompt

```bash
curl -X POST http://localhost:5000/api/prompts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Code Review",
    "prompt": "Act as a senior engineer and review my code for bugs and improvements.",
    "tool": "ChatGPT",
    "category": "Code",
    "tone": "Professional"
  }'
```

#### POST body fields

| Field | Required | Description |
|-------|----------|-------------|
| `prompt` | ✅ | The prompt text |
| `title` | ❌ | Human-readable label (default: `"Untitled"`) |
| `tool` | ❌ | Target AI tool (e.g. `"Claude"`, `"ChatGPT"`) |
| `category` | ❌ | Prompt category |
| `tone` | ❌ | Tone/style |
| `framework` | ❌ | Prompt framework used |

### Storage

Prompts and favorites are stored as JSON files inside `backend/data/` — no database setup required.

---
