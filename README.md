# Wisconsin Exam Coach

Personal learning system for the Wisconsin real estate **salesperson** exam. Teach Me is the home loop.

This repository is **Phase 1**: app foundation, exam blueprint, local learner, and a polished empty Teach Me shell. Course PDFs are not ingested yet.

## Requirements

- Node.js 22+
- Docker Desktop (PostgreSQL 16)

## Setup

```bash
cp .env.example .env
npm install
docker compose up -d
npx prisma migrate dev --name phase1_foundation
npx prisma db seed
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The database listens on **localhost:5433** so it does not collide with a local Postgres on 5432.

If Docker Desktop is not running, the Teach Me shell still renders from the in-code exam blueprint and will say that Postgres is disconnected. Persistence (learner row, sessions) requires the database.

To apply the checked-in migration and seed after Postgres is up:

```bash
npx prisma migrate deploy
npx prisma db seed
```

## What Phase 1 includes

- Next.js App Router, TypeScript, Tailwind
- Prisma + Docker Compose PostgreSQL
- Seeded `CourseEdition` `wra-sales-2024`
- Official salesperson exam categories I–X (weights sum to 140)
- Singleton local learner (`key = local`)
- Teach Me empty state recommending Agency (32 items) from the blueprint
- Placeholder routes: Progress, Practice, Math, Mistakes, Exam, Tutor, Library
- Architecture lock in [docs/decisions.md](docs/decisions.md)

## What Phase 1 does not include

PDF ingestion, quizzes, tutor, math solver, exam simulator, embeddings, OpenAI, OCR, video, XP, authentication.

## Source material

Course files live in `source-material/` on this machine. That directory is gitignored. Set `SOURCE_MATERIAL_PATH` if you move it. Never commit PDFs, videos, or extracted course text.

## Deploy on Vercel

1. Import this GitHub repository in Vercel.
2. Add a hosted Postgres database (Vercel Postgres or [Neon](https://neon.tech)).
3. Set environment variables:
   - `DATABASE_URL` — the pooled or direct Postgres URL from that host
4. After the first successful deploy, run migrations and seed against that database:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Course PDFs are not in this repo and are not needed for Phase 1. Teach Me will still render the exam blueprint if the database is unset; learner persistence requires `DATABASE_URL`.

Do not add `source-material/`, `.env`, or API keys in Vercel.

## Tests

```bash
npm test
```

Unit tests always run. Database integration tests run when Postgres is reachable at `DATABASE_URL`.

Docker Compose is the documented default (`localhost:5433`). This project was also verified against a local Homebrew Postgres 14 database named `wisconsin_exam_coach` on port 5432.
