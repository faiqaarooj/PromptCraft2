# ⚡ PromptCraft — Universal AI Prompt Engineering Toolkit

> **Stop getting bad AI outputs. Build perfect prompts for any AI tool in seconds — no experience needed.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_App-blue?style=for-the-badge)](https://your-username.github.io/promptcraft-ui)
[![GitHub Stars](https://img.shields.io/github/stars/your-username/promptcraft-ui?style=for-the-badge)](https://github.com/your-username/promptcraft-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🤔 The Problem

Most people get disappointing results from AI tools — not because the AI is bad, but because their prompts are vague. Writing good prompts is a skill that takes months to learn through trial and error.

**PromptCraft solves this in 60 seconds.**

---

## ✨ What It Does

| Feature | Description |
|---|---|
| ⚡ **Quick Generate** | Describe what you want in plain English → get an optimised prompt instantly |
| 🛠️ **Prompt Builder** | Step-by-step builder using 5 proven prompt frameworks |
| 📚 **Prompt Library** | 8+ production-tested prompts for design, code, marketing, and more |
| 📂 **History** | All your saved prompts stored locally, always accessible |
| 🎓 **Learn** | The 8 Laws of Prompt Engineering — taught by showing, not lecturing |

---

## 🏗️ 5 Prompt Frameworks — Explained

### R-C-A-T (Best for 90% of tasks)
**Role · Context · Action · Format**
The most versatile framework. Giving the AI a specific Role improves output quality by 3×.

### CO-STAR (Best for content & marketing)
**Context · Objective · Style · Tone · Audience · Response**
Forces you to think about the *reader*, not just the task. Audience-aware prompts convert better.

### RISEN (Best for complex projects)
**Role · Instructions · Steps · End Goal · Narrowing**
The Narrowing (constraints) field is the secret weapon — it prevents the AI's most common mistakes.

### S-T-A-R (Best for debugging)
**Situation · Task · Action · Result**
The debugging framework. Define the Result upfront so the AI knows what success looks like.

### C-A-R-E (Best when you have an example)
**Context · Action · Result · Example**
One concrete Example bypasses all ambiguity. Shows > tells every time.

---

## 🚀 Getting Started

### Run Locally

```bash
git clone https://github.com/your-username/promptcraft-ui.git
cd promptcraft-ui
npm install
npm start
```

Opens at `http://localhost:3000`

### Deploy to GitHub Pages

```bash
npm install --save-dev gh-pages
```

Add to `package.json`:
```json
"homepage": "https://your-username.github.io/promptcraft-ui",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Then run:
```bash
npm run deploy
```

---

## 🤖 Supported AI Tools

| Tool | Optimisation |
|---|---|
| ✨ Universal | Works across all AI tools |
| 🟠 Claude | Reasoning chains + long context |
| 🟢 ChatGPT | Numbered steps + structured instructions |
| 🔵 Gemini | Google-ecosystem tasks |
| 🎨 Stitch (Google) | Color hex values + screen names |
| 🖼️ Midjourney | --ar 16:9 --v 6 --style raw syntax |
| 🎭 DALL·E | Scene-based descriptions |
| 💻 GitHub Copilot | File context + function names |
| ⚡ Cursor AI | Codebase-aware patterns |
| 🔍 Perplexity | Cited sources |

---

## 📁 Project Structure

```
promptcraft-ui/
├── public/
│   └── index.html          # SEO meta tags, fonts
├── src/
│   ├── data/
│   │   └── index.js        # All frameworks, library, tips
│   ├── App.jsx             # Main app (all tabs)
│   └── index.js            # React entry point
├── package.json
└── README.md
```

---

## 🎯 The 8 Laws of Prompt Engineering

1. **Give the AI a specific expert role** — 3× better output
2. **Name references, not adjectives** — "Like Linear.app" beats "modern and clean"
3. **State the ONE primary action** — Design for outcomes, not aesthetics
4. **Describe emotion, not look** — "Feel like a hero" beats "look trustworthy"
5. **Tell it what NOT to do** — Exclusions eliminate clichés
6. **Add a quality checklist** — Forces self-review, catches 80% of mistakes
7. **Show an example** — One example beats 200 words of description
8. **Break tasks into phases** — Focused prompts produce exceptional output

---

## 🛠️ Built With

- **React 18** — UI components
- **localStorage** — Prompt history (no backend needed)
- **Plus Jakarta Sans** — Typography (via Google Fonts)
- **JetBrains Mono** — Code/prompt display
- Zero external UI dependencies

---

## 🤝 Contributing

Contributions welcome! 

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/add-new-framework`
3. Commit: `git commit -m "feat: add [framework name] framework"`
4. Push and open a Pull Request

Ideas for contributions:
- New prompt frameworks
- New library prompts for specific use cases
- Translations (Urdu, Arabic, etc.)
- Dark/light theme toggle

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## ⭐ Support This Project

If PromptCraft saved you time, please:
- ⭐ **Star this repo** on GitHub
- 🐦 **Share it** on Twitter/X or LinkedIn
- 🔗 **Link to it** from your blog or newsletter

---
