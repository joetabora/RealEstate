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
2. Set **Framework Preset** to **Next.js**. Leave **Output Directory** blank (do not set it to `public`).
3. Use a lowercase project name such as `wisconsin-exam-coach`.
4. `DATABASE_URL` is optional for Phase 1. If you set it, use a real `postgresql://...` connection string (`sslmode=require` for Neon/Vercel Postgres).
5. Open the **Deployment** `.vercel.app` URL from the Deployments tab — not a Storage/database page.

If you see Vercel's `404: NOT_FOUND` page with a `Code: NOT_FOUND` id, the CDN never reached Next.js. Check that the Framework Preset is Next.js, Output Directory is empty, the latest deployment is Ready, and you are opening the app URL.

`/api/health` should return `{"ok":true}` when the app is actually deployed.

After a successful deploy, you can migrate a hosted database with:

```bash
npx prisma migrate deploy
npx prisma db seed
```

Do not add `source-material/` or `.env` in Vercel.

## Tests

```bash
npm test
```

Unit tests always run. Database integration tests run when Postgres is reachable at `DATABASE_URL`.

Docker Compose is the documented default (`localhost:5433`). This project was also verified against a local Homebrew Postgres 14 database named `wisconsin_exam_coach` on port 5432.
