# Master Chef — Artisanal Recipe Assistant

An interactive culinary web application that transforms an unorganized list of pantry ingredients into a structured, step-by-step recipe.

Instead of outputting markdown text into a generic chatbot interface, Master Chef prompts an LLM for strictly typed structured JSON data, validating and rendering it into a tactile, asymmetric culinary journal with scalable quantities, an industrial prep timeline, and instant ingredient substitutions.

---

## Getting Started (Local Development)

### Prerequisites
- Node.js (v18+ recommended)
- A Gemini API Key (obtainable via [Google AI Studio](https://aistudio.google.com/app/apikey))

### Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vansh-tambi/MasterChef.git
   cd MasterChef
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   ```bash
   cp server/.env.example server/.env
   ```
   Open `server/.env` and paste your key:
   ```env
   PORT=3001
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```

4. **Run the development servers:**
   ```bash
   npm run dev
   ```
   - **Client:** http://localhost:5173
   - **Server:** http://localhost:3001
   - Requests to `/api/*` are automatically proxied from Vite to the Express backend.

---

## 🚀 Production Deployment Guide

Master Chef is configured for zero-config, unified full-stack deployment on any modern cloud platform.

### Option 1: Render.com (Recommended — 1-Click Blueprint)
1. Fork or push this repository to your GitHub account.
2. Go to [Render Dashboard](https://dashboard.render.com/) $\to$ **New** $\to$ **Blueprint**.
3. Select this repository. Render will automatically read [`render.yaml`](./render.yaml).
4. In the Environment Variables prompt, set:
   - `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
   - `NODE_ENV`: `production`
5. Click **Apply**. Render will build the frontend bundle and start the unified Express server with automatic `/api/health` monitoring.

---

### Option 2: Railway / Heroku / Fly.io / Self-Hosted Node.js

The root `package.json` includes full-stack build and start lifecycle scripts:

- **Build Command:**
  ```bash
  npm install && npm run build
  ```
- **Start Command:**
  ```bash
  npm start
  ```

In production (`NODE_ENV=production`), the Express server automatically hosts the optimized client bundle from `client/dist/` on the assigned `PORT` while routing API calls under `/api/*` and handling single-page app (SPA) fallback routing.

---

### Option 3: Split Deployment (Vercel Frontend + Render/Railway Backend)
- **Frontend (Vercel):** Root directory: `client/`, Build Command: `npm run build`, Output Directory: `dist`.
- **Backend (Render/Railway):** Root directory: `server/`, Start Command: `node server.js`.

---

## 📡 API Health & Endpoints

| Method | Route | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Uptime check and active Gemini model identifier |
| `POST` | `/api/recipe` | Generate a new structured recipe with schema normalization |
| `POST` | `/api/recipe/refine` | Conversationally adjust an active recipe |

---

## Architectural Overview

```
┌─────────────────────────┐          ┌───────────────────────────┐          ┌──────────────────────┐
│       Vite + React      │  /api/*  │       Node + Express      │  SDK Call│      Gemini API      │
│  (Custom Hook & Motion) ├─────────►│  (Schema Check & Timeout) ├─────────►│  (2.5 Flash Model)   │
│                         │◄─────────┤                           │◄─────────┤                      │
└─────────────────────────┘ JSON/Err └───────────────────────────┘  JSON    └──────────────────────┘
```

- **Frontend (`/client`):** Built with React 18, Tailwind CSS, and Framer Motion. Uses a **"Nordic Smoked Ceramic & Obsidian Cast Iron"** aesthetic with physical hard-offset drop shadows, an asymmetric 12-column prep timeline, and an interactive Chef's knife cursor.
- **Backend (`/server`):** A resilient ESM Express gateway enforcing schema normalization via Zod.
- **Security Guardrail:** The `GEMINI_API_KEY` is strictly confined to the backend environment, preventing token leaks in client bundles and centralizing rate limiting.

---

## Handling Bad AI Output & Resilience

- **Zod Schema Normalization:**
  Incoming LLM responses are validated server-side against a resilient Zod contract (`RecipeSchema`). Optional fields (like `swapSuggestion`), numeric coercion, and case normalization (`"EASY"` $\to$ `"easy"`) prevent 502 parse failures.

- **Timeout & Stall Protection:**
  Every AI request is bound to an `AbortController` configured with a generous 35-second threshold to accommodate LLM latency during peak traffic.

- **Race Condition Invalidation:**
  `useRecipeRequest` maintains an incrementing `activeRequestId` token. If the user edits ingredients while a request is in flight, the previous call is aborted and mismatched responses are cleanly discarded.

- **Self-Healing Recovery UX:**
  Intentional recovery panels retain user inputs with single-click retry mechanisms for network drops, timeouts, and API disruptions.

---

## Stretch Goals & Polish Completed

- [x] **Light & Dark Theme:** Nordic Alabaster & Ceramic (light) $\leftrightarrow$ Obsidian Cast Iron (dark) with instant CSS-variable reactive toggling.
- [x] **Save & Reload Sessions:** Automatic session hydration from `localStorage` (`master_chef_session_v1`) with "Start Fresh" control.
- [x] **Refinement Loop:** Inline recipe adjustment sending active JSON plus user instructions to `POST /api/recipe/refine`.
- [x] **60 FPS Utensil Cursor:** Hardware-accelerated chef's knife cursor with idle sway and touch suppression.
- [x] **Physics-Based Motion Language:** Tactile rubber-stamp buttons, staggered plating animations, and timeline step pops.
- [x] **Production Unified Server:** Express serves built client assets with SPA fallback and `/api/health` monitoring.
