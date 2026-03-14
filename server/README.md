# PromptCraft Backend

A lightweight Node.js / Express REST API that backs the PromptCraft frontend.
All saved prompts are stored in a local JSON file (`server/data/db.json`) — no
external database is required.

---

## Quick Start

```bash
# 1. Install dependencies
cd server
npm install

# 2. Copy and edit the environment file (optional)
cp .env.example .env

# 3. Start the server
npm start          # production
npm run dev        # auto-restarts on file changes (Node ≥ 18)
```

The API will be available at **http://localhost:4000**.

---

## Running frontend + backend together

From the **project root**:

```bash
npm install            # install frontend deps (already done if you ran before)
npm run server         # start backend only
npm run dev            # start BOTH frontend (port 3000) + backend (port 4000)
```

`npm run dev` requires the `concurrently` package which is installed automatically when you run `npm install` in the root.

Then create a **`.env`** file in the project root so the React app knows the backend URL:

```
REACT_APP_API_URL=http://localhost:4000
```

Without this variable the frontend works in **local-only mode** (localStorage), so it is always fully functional even without the backend running.

---

## API Reference

### Health

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Server health check |

### Saved Prompts

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/prompts` | List all saved prompts (newest first) |
| GET | `/api/prompts/:id` | Get a single prompt |
| POST | `/api/prompts` | Save a new prompt |
| DELETE | `/api/prompts` | Delete all prompts |
| DELETE | `/api/prompts/:id` | Delete one prompt |

**POST /api/prompts body** (JSON):

```json
{
  "text":      "Your full prompt text (required)",
  "framework": "R-C-A-T",
  "tool":      "chatgpt",
  "category":  "code",
  "score":     85
}
```

**Response**:

```json
{
  "id":        "550e8400-e29b-41d4-a716-446655440000",
  "text":      "Your full prompt text",
  "framework": "R-C-A-T",
  "tool":      "chatgpt",
  "category":  "code",
  "score":     85,
  "createdAt": "2025-01-01T12:00:00.000Z"
}
```

### Prompt Library (read-only)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/library` | List all templates |
| GET | `/api/library?category=code` | Filter by category |
| GET | `/api/library?tool=claude` | Filter by tool |
| GET | `/api/library/:id` | Get a single template |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Port the server listens on |
| `CORS_ORIGIN` | `http://localhost:3000` | Comma-separated list of allowed origins |

---

## Project Structure

```
server/
├── data/
│   ├── store.js     ← file-based JSON storage helpers
│   └── db.json      ← auto-created on first run (gitignored)
├── routes/
│   ├── prompts.js   ← CRUD endpoints for saved prompts
│   └── library.js   ← read-only prompt template library
├── server.js        ← Express app entry point
├── package.json
├── .env.example
└── README.md
```
