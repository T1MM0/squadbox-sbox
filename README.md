# Squadbox: AI Webapp Builder

Squadbox is an AI-powered web application that builds custom websites and widgets based on user requests. Users can start from a template or describe their needs in natural language. The AI team parses, scopes, and builds the requested site, which can then be downloaded or deployed.

## Features
- Request via template or natural language
- AI-powered requirement parsing and scoping
- Automated build timeline and sequence
- Download or deploy finished sites/widgets

---

## Getting Started
1. Set up your OpenAI API key (see [OPENAI_SETUP.md](OPENAI_SETUP.md))
2. Install frontend dependencies: `npm install`
3. Install backend dependencies: `cd backend && pip install -r requirements.txt`
4. Start the backend: `cd backend && uvicorn app:app --reload`
5. In a new terminal, start the frontend: `npm run dev`
6. Open your browser to `http://localhost:5173`

---

## Tech Stack
- React + Vite (frontend)
- Node.js (backend, if needed)
- OpenAI/LLM API (AI logic)