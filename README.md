# Master Chef — Fridge-to-Recipe Assistant

An interactive culinary web tool that transforms an unorganized list of pantry ingredients into a structured, step-by-step recipe. This project fulfills the **Fridge-to-recipe** track of the Frontend Internship Assignment.

Instead of outputting markdown text into a standard chatbot interface, Master Chef prompts an LLM for strictly typed JSON data, validating and rendering it into a tactile, interactive notebook with scalable quantities, interactive step checklists, and ingredient substitutions.

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Gemini API Key (obtainable via Google AI Studio)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vansh-tambi/MasterChef.git
   cd MasterChef
   ```

2. **Install dependencies:**
   ```bash
   # From the project root (installs root, client, and server dependencies via npm workspaces)
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
   ```

4. **Run the application:**
   ```bash
   npm run dev
   ```
   This executes `concurrently` to run both services in parallel:
   - **Client dev server:** http://localhost:5173
   - **Express backend API:** http://localhost:3001
   - Requests made to `/api/*` on the client are automatically forwarded to port 3001 via Vite's proxy.

---

## Architectural Overview

```
┌─────────────────────────┐          ┌───────────────────────────┐          ┌──────────────────────┐
│       Vite + React      │  /api/*  │       Node + Express      │  SDK Call│      Gemini API      │
│  (Custom Hook & State)  ├─────────►│  (Schema Check & Timeout) ├─────────►│  (1.5 Flash Model)   │
│                         │◄─────────┤                           │◄─────────┤                      │
└─────────────────────────┘ JSON/Err └───────────────────────────┘  JSON    └──────────────────────┘
```

- **Frontend (`/client`):** Built with React (functional components, custom hooks) and Tailwind CSS. It provides a tactile "Master Chef" artisanal aesthetic (warm cream linen paper tones, terracotta primary accents, and sage green success indicators) avoiding generic SaaS design clichés.
- **Backend (`/server`):** A lightweight ESM Express server acting as a secure gateway.
- **Security Guardrail:** The `GEMINI_API_KEY` is strictly confined to the backend environment. Routing AI calls through the server prevents token exposure in client bundles, mitigates browser abuse, and centralizes rate-limit protection.

---

## Handling Bad AI Output

Handling unpredictable LLM output gracefully is the primary focus of Master Chef:

- **Schema Enforcement via Zod:**
  Incoming LLM responses are validated server-side against a strict Zod contract (`RecipeSchema`) validating required properties, types, minimum lengths, and enum values. If validation fails, the server rejects the payload with HTTP 502 (`invalid_shape`) rather than forwarding broken data to the frontend.

- **Timeout & Stall Mitigation:**
  Every AI request is bound to an `AbortController` configured with a 20-second threshold. If upstream generation stalls, the backend aborts the process and returns an HTTP 504 (`timeout`).

- **Race Conditions & Stale-Response Invalidation:**
  The custom client hook `useRecipeRequest` maintains an incrementing `activeRequestId` ref and an active client-side `AbortController`. If a user modifies their ingredients and resubmits while a request is in flight, the previous HTTP call is aborted and any out-of-order response with a mismatched request token is discarded, preventing stale data from overwriting newer submissions.

- **Defensive Client Parsing:**
  Even if an object satisfies basic schema checks, the frontend validates that ingredients and steps contain actionable entries, redirecting empty responses to a recovery state.

- **Self-Healing Recovery UX:**
  Every failure mode displays an intentional, non-technical recovery panel retaining the user's initial input with a single-click retry action:
  - **502 `invalid_shape`:** Prompts a clean re-generation.
  - **502 `ai_request_failed`:** Re-establishes connection to the AI provider.
  - **504 `timeout`:** Provides options to either keep waiting or retry immediately.
  - **Network Error:** Detects offline status and prompts reconnection.

---

## AI Usage Note

In accordance with assignment guidelines, AI assistance was leveraged as an engineering pair-programmer:

- **Scaffolding & Boilerplate:** Used AI assistants to quickly bootstrap the initial Express server configuration, monorepo `package.json` scripts, and Tailwind font imports.
- **Handwritten Core Logic:** The client-side mathematical scaling logic, the race-condition request ID hook (`useRecipeRequest`), touch-target mobile layouts, and custom interactive step states were written and verified manually.
- **Debugging & Edge Cases:** Used AI to review edge cases for Gemini's structured output schema typing (`SchemaType`) and to help refine the fallback error messaging.

---

## Known Limitations

- **Session Scope:** Persistence is strictly client-side (`localStorage`); sessions are not synced across multiple devices or persistent database layers.
- **Refinement Depth:** The recipe refinement endpoint modifies the immediate active recipe, but does not maintain a multi-turn undo/redo history tree.
- **Offline Generation:** While cached recipes load offline via local storage, generating new recipes requires an active internet connection to contact the Gemini API.

---

## Time Spent

**Total Time:** ~7.5 hours (within the suggested 8-hour target)

- Architecture, monorepo scaffolding & schema contract: ~1.5 hours
- Gemini SDK integration, structured output & timeout handling: ~1.5 hours
- Client state machine, custom hook & race-condition guards: ~1.5 hours
- Interactive recipe view, ingredient math & checklist UI: ~1.5 hours
- Responsive audit, dark mode, keyboard navigation & documentation: ~1.5 hours

---

## Stretch Goals Completed

- [x] **Dark Mode:** A cozy, late-night "warm roast espresso" theme switchable via toggle and persisted in `localStorage`.
- [x] **Save & Reload Sessions:** Automatic session hydration from `localStorage` on page reload, complete with a "Start Fresh" reset control.
- [x] **Refinement Loop:** An inline conversational adjustment input sending the current recipe JSON plus user edits to `POST /api/recipe/refine`.
- [x] **Keyboard Accessibility & Tactile Polish:** `Cmd/Ctrl + Enter` form submission, accessible 44px touch targets, visible theme-matched focus rings, and animated checklist transitions.
