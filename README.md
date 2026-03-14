# ⚡ PromptCraft — Universal AI Prompt Engineering Toolkit

> **Stop getting bad AI outputs. Build perfect prompts for any AI tool in seconds — no experience needed.**

[![Live Demo](https://prompt-craft-gilt.vercel.app/)
[![GitHub Stars](https://img.shields.io/github/stars/faiqaarooj/promptcraft?style=for-the-badge)](https://github.com/faiqaarooj/promptcraft)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🏗️ Project Structure

```
PromptCraft2/
├── public/            # Static HTML
├── src/               # React frontend (Create React App)
│   ├── App.jsx        # Main application
│   ├── api.js         # Backend API service (with localStorage fallback)
│   ├── data/          # Prompt library data
│   └── index.js       # React entry point
├── server/            # Node.js / Express backend
│   ├── index.js       # Express app + route mounting
│   ├── routes/
│   │   ├── prompts.js    # GET endpoints for prompt library data
│   │   ├── history.js    # CRUD for saved prompt history
│   │   └── favorites.js  # CRUD for favourites
│   ├── data/
│   │   ├── promptData.js # Serialisable copy of the prompt library
│   │   └── store.js      # JSON file persistence layer
│   └── package.json
├── package.json       # Frontend dependencies (proxy → backend)
└── README.md
```

---

## 🚀 Running Locally

### Frontend only (no IDE needed — just a terminal)

```bash
npm install
npm start          # opens http://localhost:3000
```

History and favourites are stored in `localStorage` automatically.

### Frontend + Backend (recommended for full persistence)

Open **two terminals**:

**Terminal 1 — backend**
```bash
cd server
npm install
npm start          # starts http://localhost:5000
```

**Terminal 2 — frontend**
```bash
npm install        # (root)
npm start          # opens http://localhost:3000
```

The React dev server proxies all `/api/*` calls to `http://localhost:5000`.  
When the backend is running, history and favourites are stored server-side in `server/data/db.json` and synced to localStorage as a fallback.

---

## 🌐 Backend REST API

| Method   | Endpoint                  | Description                          |
|----------|---------------------------|--------------------------------------|
| `GET`    | `/api/health`             | Health check                         |
| `GET`    | `/api/tools`              | All AI tool definitions              |
| `GET`    | `/api/categories`         | All prompt categories                |
| `GET`    | `/api/tones`              | All tone options                     |
| `GET`    | `/api/frameworks`         | All prompt frameworks (metadata)     |
| `GET`    | `/api/tips`               | The 8 laws of prompt engineering     |
| `GET`    | `/api/prompts`            | Prompt library (filterable by `category`, `tool`, `search`) |
| `GET`    | `/api/prompts/:id`        | Single prompt by ID                  |
| `GET`    | `/api/history`            | Saved prompt history                 |
| `POST`   | `/api/history`            | Save a new prompt to history         |
| `DELETE` | `/api/history`            | Clear all history                    |
| `DELETE` | `/api/history/:id`        | Remove one history entry             |
| `GET`    | `/api/favorites`          | All favourited prompt IDs            |
| `POST`   | `/api/favorites/:id`      | Add a prompt to favourites           |
| `DELETE` | `/api/favorites/:id`      | Remove a prompt from favourites      |

---

## 🤔 The Problem

Most people get disappointing results from AI tools — not because the AI is bad, but because their prompts are vague. Writing good prompts is a skill that takes months to learn through trial and error.

**PromptCraft solves this in 60 seconds.**

newsletter

---
