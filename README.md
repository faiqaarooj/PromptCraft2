# ⚡ PromptCraft — Universal AI Prompt Engineering Toolkit

> **Stop getting bad AI outputs. Build perfect prompts for any AI tool in seconds — no experience needed.**

[![Live Demo](https://prompt-craft-gilt.vercel.app/)
[![GitHub Stars](https://img.shields.io/github/stars/faiqaarooj/promptcraft?style=for-the-badge)](https://github.com/faiqaarooj/promptcraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🤔 The Problem

Most people get disappointing results from AI tools — not because the AI is bad, but because their prompts are vague. Writing good prompts is a skill that takes months to learn through trial and error.

**PromptCraft solves this in 60 seconds.**

---

## 🗂️ Project Structure

```
PromptCraft2/
├── src/          # React frontend (Create React App)
└── backend/      # Node.js + Express REST API
```

---

## 🚀 Backend — Quick Start

The backend is a Node.js REST API that persists prompt history, favourites, and community-shared prompts to a local SQLite database.

### Setup

```bash
cd backend
cp .env.example .env        # fill in JWT_SECRET
npm install
npm start                   # runs on http://localhost:5000
```

### API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | — | Create account, returns JWT |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/history` | ✅ Bearer | List saved prompts |
| POST | `/api/history` | ✅ Bearer | Save a prompt |
| DELETE | `/api/history/:id` | ✅ Bearer | Delete a saved prompt |
| GET | `/api/favorites` | ✅ Bearer | List favorites |
| POST | `/api/favorites` | ✅ Bearer | Add a favorite |
| DELETE | `/api/favorites/:id` | ✅ Bearer | Remove a favorite |
| GET | `/api/prompts` | — | Browse community prompts |
| GET | `/api/prompts/:id` | — | Get one community prompt |
| POST | `/api/prompts` | ✅ Bearer | Share a prompt publicly |
| DELETE | `/api/prompts/:id` | ✅ Bearer | Delete your shared prompt |
| GET | `/api/health` | — | Health check |

### Auth

Include the JWT from register/login as a Bearer token:

```
Authorization: Bearer <token>
```

---
