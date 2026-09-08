# Wisconsin Exam Coach

Personal learning system for the Wisconsin real estate **salesperson** exam. Teach Me is the home loop.

This repository is **Phase 3**: foundation, local ingestion, and a hand-seeded Chapter 1 Agency concept graph. Teach Me sessions are not built yet.

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

The second `npx prisma db seed` attaches Chapter 1 concepts to ingested section IDs. `npm run ingest` also re-seeds those concepts after writing sections.

The database listens on **localhost:5433** so it does not collide with a local Postgres on 5432.

If Docker Desktop is not running, the Teach Me shell still renders from the in-code exam blueprint. Persistence and ingested sections require the database.

## What Phase 3 includes

- Everything in Phase 1–2 (shell, ingest, Library)
- Hand-seeded Chapter 1 Agency concepts with page citations
- Exam-category IV joins and WI jurisdiction flags from inspected headings
- Seeded confusion pairs (active only when both concepts exist)
- Progress list of not-started concepts and a concept detail page
- Architecture lock in [docs/decisions.md](docs/decisions.md)

## What Phase 3 does not include

Quizzes, Teach Me session runner, tutor, math solver, exam simulator, embeddings, OpenAI, OCR, video, XP, authentication, auto-extracted concepts for chapters 2–14.

## What Phase 2 includes

- Next.js App Router, TypeScript, Tailwind
- Prisma + Docker Compose PostgreSQL
- Seeded `CourseEdition` `wra-sales-2024` and exam categories I–X (weights sum to 140)
- Singleton local learner (`key = local`)
- Teach Me empty state recommending Agency (32 items)
- Ingest CLI for PUB725 + Chapter 1 notes
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
