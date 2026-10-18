# DocuBridge

**Multilingual Financial Document Intake Platform — powered end-to-end by Gemini**

Built for the [Google Cloud AI Builder Cup 2026](https://aibuildercup.com) (JAPAC) — *Build in JAPAC. Build for the world.*

🔗 **Live demo:** [docubridge.ai.studio](https://docubridge.ai.studio)

---

## The problem

Across JAPAC, financial institutions lose applicants not because of risk, but because of language and document friction. An applicant who speaks Hindi, Thai, Japanese, or Bahasa Indonesia often can't tell *why* a document was rejected. Officers manually cross-check IDs, payslips, and bank statements across a dozen scripts and currencies. And every bank builds its own one-off intake pipeline instead of sharing a battle-tested layer.

## The solution

DocuBridge is a **bank-agnostic intake platform** any lender or insurer can plug into. Every uploaded document runs through a 7-agent Gemini pipeline; every voice note is transcribed and translated by Gemini's native audio understanding; every customer-facing message can be read aloud via Gemini's native Text-to-Speech — serving users who can't read the script.

![Login screen — multi-product, multilingual](screenshots/login.png)

## Key features

- **7-agent Gemini pipeline** — Model Armor (prompt-injection screening) → Quality → Classifier → Extraction → Translation → Fraud Agent → Summary, with a **live, per-document agent execution trace** visible to the loan officer
- **Real voice notes** — applicants record in their own language; Gemini transcribes, translates, and summarizes directly from audio, no separate Speech-to-Text API
- **Native Text-to-Speech** — any customer-facing message (rejection, retake request, approval) can be read aloud in-language
- **Deterministic fraud detection** — Verhoeff checksum validation on ID numbers, payslip arithmetic reconciliation, bank-statement cross-matching
- **Page-level source citations** — click any extracted field to see its exact bounding box on the original document
- **Customer-visible transparency** — applicants see exactly when an officer opened their file or unmasked sensitive PII
- **12 languages** — Hindi, Tamil, Bengali, Gujarati, Telugu, Bahasa Indonesia, Vietnamese, Japanese, Korean, Chinese (Simplified), Thai, English
- **Multi-product platform** — Personal Loan fully live; Home Loan and Insurance Claim previewed on the same pipeline
- **Portfolio analytics** — real-time stats computed from live case data, not mocked numbers

| Staff Console — fraud alerts, agent trace, analytics | Voice note — real microphone, Gemini transcription |
|---|---|
| ![Staff Console](screenshots/staff-console.png) | ![Voice note recording](screenshots/voice-note.png) |

| Customer-facing access history | Built-With-Gemini panel |
|---|---|
| ![History tab](screenshots/history-tab.png) | ![About modal](screenshots/about-modal.png) |

## Google services used

| Capability | Service |
|---|---|
| Document field extraction, bounding-box citations, classification | **Gemini** (multimodal vision) |
| Voice note transcription & translation | **Gemini** (native audio understanding) |
| Spoken customer messages | **Gemini** (native Text-to-Speech) |
| Development | **Google AI Studio** |
| Deployment | **Google Cloud Run** |

## Tech stack

- **Frontend:** React 19, Vite, TailwindCSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **AI:** Gemini 3.5 Flash family (vision, native audio), Gemini 2.5 Flash native TTS, with multi-model fallback chains for resilience against rate limits and model deprecation
- **Testing:** Playwright + real Chrome — automated end-to-end verification across every portal, tab, and modal

## Architecture

```
Client (React/Vite)  →  Server (Express/TypeScript)  →  Gemini (multimodal vision, native audio in/out)
Dual portal: Customer / Staff Console     7-agent pipeline orchestration     Deployed on Cloud Run / AI Studio
```

Documents and audio are sent directly as inline multimodal data to Gemini — no separate OCR or Speech-to-Text service required.

## Setup

### Prerequisites

- **Node.js 20+** (tested on Node 22) and npm
- A free **Gemini API key** — see below

### 1. Clone and install

```bash
git clone https://github.com/sumitgarg9604/DocuBridge.git
cd DocuBridge
npm install
```

### 2. Get a Gemini API key (free)

1. Go to **[aistudio.google.com/apikey](https://aistudio.google.com/apikey)** and sign in with a Google account.
2. Click **"Create API key"**.
3. Choose or create a Google Cloud project when prompted — any project works, this is free-tier by default.
4. Copy the generated key (starts with `AIza...` or `AQ...`).

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set:

```bash
GEMINI_API_KEY="your-key-here"
APP_URL="http://localhost:3000"
```

`.env` is git-ignored — never commit real keys.

### 4. Run the dev server

```bash
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)**. You should see the login screen; use the "Developer Bypass" buttons to sign in instantly as either the applicant (Priya Sharma) or the loan officer (Amit Kumar) without a real account.

### 5. Verify it's working

- Hit `http://localhost:3000/api/health` — should return `{"status":"ok","geminiConfigured":true,...}`. If `geminiConfigured` is `false`, double-check your `.env` key.
- Log in as the applicant, go to **Voice Note**, tap record, say something, tap stop — you should get a real Gemini transcription back within a few seconds.

### Other useful scripts

```bash
npm run build     # production build (outputs to dist/)
npm run preview   # preview the production build locally
npm run lint      # type-check with tsc --noEmit
```

### Troubleshooting

- **`geminiConfigured: false`** — your `.env` is missing, in the wrong location (must be the repo root), or still has the placeholder `MY_GEMINI_API_KEY` value.
- **A Gemini model returns 404 ("no longer available")** — Google periodically deprecates model versions. The pipeline already retries across a fallback chain (`gemini-3.5-flash` → `gemini-3.8-flash` → ...); if all of them fail, check [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models) for current model names and update `server.ts`.
- **429 rate-limit errors** — expected occasionally on the free tier under heavy testing; the fallback chain usually absorbs these by moving to the next model.
- **Microphone recording doesn't work** — `getUserMedia` requires either `localhost` or HTTPS; it won't work over plain HTTP on a non-localhost address.

## Judging-criteria alignment

| Criterion | Weight | How DocuBridge addresses it |
|---|---|---|
| Technical Merit & Gen AI Implementation | 40% | 7-agent Gemini pipeline, native audio in/out, deterministic fraud checks, verified via exhaustive automated testing |
| Problem Alignment & Impact | 25% | Solves real JAPAC financial-inclusion friction — language barriers, manual fraud review, one-off bank builds |
| Innovation & Creativity | 25% | Bank-agnostic platform model, full voice round-trip, customer-facing transparency and trust features |
| UX & Solution Design | 10% | Dual-portal design, accessibility-first (TTS, 12 languages), crash-resilient by design |

---

DocuBridge · Google Cloud AI Builder Cup 2026 · *Build in JAPAC. Build for the world.*
