# Wisconsin Exam Coach

Personal learning system for the Wisconsin real estate **salesperson** exam. Teach Me is the home loop.

This repository is **Phase 13 (complete)**: optional draft MCQ generation into `lifecycle: generated`, on top of Phase 12 gates. Mock works offline; live is optional and shares the tutor spend cap. Drafts never auto-activate. Video transcription and embeddings are not in yet.

## Requirements

- Node.js 22+
- Docker Desktop (PostgreSQL 16), or another local Postgres
- Course files in `source-material/` on this machine (gitignored)

## Setup

```bash
cp .env.example .env
npm install
docker compose up -d
npx prisma migrate deploy
npx prisma db seed
npm run ingest
npx prisma db seed
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Library is at [http://localhost:3000/library](http://localhost:3000/library). Progress is at [http://localhost:3000/progress](http://localhost:3000/progress).

The second `npx prisma db seed` attaches Chapter 1–14 concepts, Teach Me assets, and Chapter 1–14 practice questions to ingested section IDs. `npm run ingest` also re-seeds knowledge and Teach Me assets after writing sections (PUB725 + Chapter 1–11 notes; Chapters 12–14 are book-sourced).

The database listens on **localhost:5433** so it does not collide with a local Postgres on 5432.

If Docker Desktop is not running, the Teach Me shell still renders from the in-code exam blueprint. Persistence and ingested sections require the database.

## What Phase 13 includes

- Everything in Phase 1–12
- Optional draft MCQ generation from active confusion pairs (`npm run generate:drafts`, Validation UI)
- Mock (deterministic, offline) and live (OpenAI, optional) modes
- Drafts persist as `lifecycle: generated` with concept citations only — never invent WI cites
- Seed no longer deletes non-catalog pipeline drafts
- Live generation shares the tutor daily spend cap

## What Phase 13 does not include yet

Auto-activation without review, video transcription, embeddings, photo→MCQ automation.

## What Phase 12 includes

- Everything in Phase 1–11
- Content lifecycle gates: generated → source_check → structural_check → answer_check → ambiguity_check → wi_fact_check → validated → active (or rejected)
- `/validation` review queue + `npm run validate:content`
- `ContentGateEvent` audit trail
- WI-like language without citations fails wi_fact_check (never invents cites)
- Explicit activate step from validated → active

## What Phase 11 includes

- Everything in Phase 1–10
- Class-miss photo upload on Mistakes (`ClassMissCapture`) into gitignored `data/class-miss-photos/`
- Optional local Tesseract on upload (unverified); optional concept link
- Link photo to an open practice Mistake, or discard from the queue
- Safe `/api/mistakes/class-miss/[id]` image serve for the local learner only
- No auto-generated questions or Teach Me assets from photos

## What Phase 11 does not include

Cloud photo sync, OCR-as-truth, auto MCQ generation from photos, video transcription, bounding-box editors.

## What Phase 10 includes

- Everything in Phase 1–9
- `VisualAnchor.ocrStatus` / `ocrNote` / `ocrText` (unverified) with ingest backfill for `needsOcr` sections
- Form numbers inferred only from extracted headings (e.g. WB-11)
- Library OCR queue at `/library/ocr` plus section visual/OCR status strip
- Optional local page PNG renders via `npm run render:ocr-pages` (`pdftoppm`) into gitignored `data/page-renders/`
- Optional local Tesseract via `npm run ocr:pages` — dumps marked needs_verification, never Teach Me truth
- Safe `/api/library/page-render/[assetId]` for those PNGs only
- Explicit rule: no invented OCR as course fact; PDFs stay local / never uploaded to a vendor

## What Phase 10 does not include

Cloud OCR, bounding-box capture UI, video transcription, promoting OCR dumps into Teach Me assets.

## What Phase 9 includes

- Everything in Phase 1–8
- Timed `/exam` simulation from existing active MCQs
- Blueprint seat allocation (Pearson salesperson weights, capped by inventory)
- Seeded shuffle of question and option order; concept/citation hints hidden mid-exam
- No mid-exam remediation or retest queue; category score summary at the end
- Auto-end on timeout, recent simulation history, study-simulation disclaimer

## What Phase 9 does not include

Full 140 when inventory is short, importing the course practice exam into git, generated items, photo miss intake, AI-written stems.

## What Phase 8 includes

- Everything in Phase 1–7
- Deterministic solvers: commission, seller net, LTV, loan-from-LTV, down payment, points, simple interest, 365/360 prorations, transfer fee (rate as input)
- Guided steps + optional attempt-check with error-kind hints (no AI keys)
- Teach Me adaptive math-repair insertion for mapped concepts (`calculation` items → `/math?template=…`)
- Concept detail Math repair links for mapped slugs

## What Phase 8 does not include

Timed exam-math drills, hardcoded Wisconsin statutory fee tables, AI-calculated keys (never).

## What Phase 7 includes

- Everything in Phase 1–6
- Tutor modes: **Off** (default), **Mock** (no API spend), **Live** (needs `OPENAI_API_KEY`)
- Soft daily spend cap for live mode; Live disabled while offline
- Keyword retrieval to matching concepts / assets / Library headings (no embeddings yet)
- Learner-state pointers for open mistakes and overdue reviews
- New conversation control to clear the local thread
- Mock and live prompts refuse to invent Wisconsin statutes / fees / deadlines / form lines
- Chat persistence for the local learner

## What Phase 7 does not include

Embedding/RAG lanes, voice, unconstrained PDF chat, LLM narration of the study plan.

## What Phase 6 includes

- Everything in Phase 1–5
- `ReviewSchedule` rows updated from practice attempts via deterministic SM-2 (no LLM)
- Adaptive Teach Me prefix (cap 3): open mistakes → overdue schedules → overconfidence misses
- Sequential chapter sittings remain the base plan; adaptive items are prepended only
- Progress review queue (overdue + open mistakes counts) and Teach Me adaptive hint
- Completing Teach Me review/repair items advances the SM-2 schedule (quality 4)
- Due-review practice sitting from overdue concepts (existing MCQs, cross-chapter, cap 8)
- Concept detail shows due date / interval / last quality (still no mastery %)

## What Phase 6 does not include

Full FSRS package, exam-weighted mastery %, LLM narration, class-miss photo intake, live tutor, XP.

## What Phase 5 includes

- Everything in Phase 1–4
- Hand-authored Chapter 1–14 MCQs from seeded confusion pairs, with heading citations
- Practice runner with confidence (1–5), remediation on miss, and immediate retest queue
- `QuestionAttempt`, separate `KnowledgeState` / `PerformanceState`, and Mistakes list
- Architecture lock in [docs/decisions.md](docs/decisions.md)

## What Phase 5 does not include

Generated MCQs through validation gates, class-miss photo intake, tutor, math solver, exam simulator, embeddings, OpenAI, OCR, video, XP, authentication.

## What Phase 4 includes

- Everything in Phase 1–3
- Hand-authored Chapter 1–14 learning assets (explanation, simple language, scenario, comparison, teach-back, recall) with heading citations
- Sequential Teach Me planners through Chapter 14 Trust Accounts (`phase4-ch14-v1`)
- Start session / Resume on the local database (`/` stays static for Vercel)
- Progress lists Chapters 1–14 and may mark taught concepts as learning — still no 0% bars
- Architecture lock in [docs/decisions.md](docs/decisions.md)

## What Phase 4 does not include

Quizzes beyond Phase 5 chapter practice, class-miss photo intake, tutor, math solver, exam simulator, embeddings, OpenAI, OCR, video, XP, authentication.

## What Phase 3 includes

- Everything in Phase 1–2 (shell, ingest, Library)
- Hand-seeded Chapter 1 Agency concepts with page citations
- Exam-category IV joins and WI jurisdiction flags from inspected headings
- Seeded confusion pairs (active only when both concepts exist)
- Progress list of not-started concepts and a concept detail page
- Architecture lock in [docs/decisions.md](docs/decisions.md)

## What Phase 3 does not include

Quizzes, tutor, math solver, exam simulator, embeddings, OpenAI, OCR, video, XP, authentication, auto-extracted concepts for chapters 6–14. Teach Me sessions arrived in Phase 4.

## What Phase 2 includes

- Next.js App Router, TypeScript, Tailwind
- Prisma + Docker Compose PostgreSQL
- Seeded `CourseEdition` `wra-sales-2024` and exam categories I–X (weights sum to 140)
- Singleton local learner (`key = local`)
- Teach Me empty state recommending Agency (32 items)
- Ingest CLI for PUB725 + Chapter 1–11 notes
- Layered `SourceDocument` / `SourceSection` records with page citations
- Chapters 12–14 visible in Library (book-only; no chapter-folder notes)
- VisualAnchor page-number placeholders (no OCR / page images)
- Practice-exam text stored locally and hidden in Library
- Architecture lock in [docs/decisions.md](docs/decisions.md)

## What Phase 2 does not include

Quizzes, tutor, math solver, exam simulator, embeddings, OpenAI, OCR, video, XP, authentication (those remain out in Phase 3 as well).

## Source material

Course files live in `source-material/` on this machine. That directory is gitignored. Set `SOURCE_MATERIAL_PATH` if you move it. Never commit PDFs, videos, or extracted course text.

`npm run ingest` writes extracted text to Postgres only.

## Deploy on Vercel

1. Import this GitHub repository in Vercel.
2. Set **Framework Preset** to **Next.js**. Leave **Output Directory** blank (do not set it to `public`).
3. Use a lowercase project name such as `wisconsin-exam-coach`.
4. `DATABASE_URL` is optional for the Teach Me shell. Ingested sections will not appear on Vercel unless you migrate a hosted database **and** run ingest somewhere that has `source-material/`. Do not upload course PDFs to Vercel.
5. Open the **Deployment** `.vercel.app` URL from the Deployments tab — not a Storage/database page.

If you see Vercel's `404: NOT_FOUND` page with a `Code: NOT_FOUND` id, the CDN never reached Next.js. Check that the Framework Preset is Next.js, Output Directory is empty, the latest deployment is Ready, and you are opening the app URL.

`/api/health` should return `{"ok":true}` when the app is actually deployed.

After a successful deploy, you can migrate a hosted database with:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Do not add `source-material/` or `.env` in Vercel. Do not run ingest against a hosted database from this repo if that would copy course text off this machine.

## Tests

```bash
npm test
```

Unit tests always run. Database integration tests run when Postgres is reachable at `DATABASE_URL`.

Docker Compose is the documented default (`localhost:5433`). This project was also verified against a local Homebrew Postgres 14 database named `wisconsin_exam_coach` on port 5432.
