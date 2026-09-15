# Architecture decisions

Phase: 5 — Questions (Chapter 1 practice first)  
Status: locked unless a concrete technical contradiction appears.

This file records the Architecture Lock. It is binding for implementation.

## Product

- **Teach Me is the home loop.** `/` is Today's Plan. Library, Practice, Math, Exam, and Tutor are secondary.
- **Full course is the goal.** Teach Me sittings cover Chapters 1–14 sequentially. All 14 chapter sittings are built.
- **One local learner.** Stable key `local`. No authentication, billing, or social features.
- **Personal now, platform later.** Tables are keyed so a future `userId` can exist; Phase 1 does not build multi-user infrastructure.

## Knowledge and assessment

- **CourseEdition versioning.** Current edition slug: `wra-sales-2024`, jurisdiction `WI`. A later 2027 edition must not destroy 2024.
- **Exam blueprint is first-class data**, not course content. Pearson salesperson outline I–X is seeded with weights summing to 140. Concepts and questions will join to it later.
- **KnowledgeState and PerformanceState stay separate** (entities in a later phase). Understanding a concept is not the same as surviving exam conditions. Do not collapse them into a single mastery percentage.
- **ConfusionPair is an entity.** Seeded pairs are active only when both concept slugs exist. Evidence starts as `seed`; later misses can add more.
- **LearningAsset is the content model.** Extensible types: explanation, simple language, analogy, scenario, comparison, visual, recall, teach-back, application, calculation, form-line, trap, exam recognition, remediation. Do not freeze `Lesson.mode` as the schema. Phase 4 seeds explanation, simple language, scenario, comparison, teach-back, and recall for Chapters 1–14.
- **Question is a separate scored-item model.** Stem, options, citations, remediation. Phase 5 seeds Chapter 1–9 MCQs from confusion-pair distinctions. Do not import the 140-item course practice exam into git.
- **VisualAnchor** stores page-number placeholders now. OCR, bounding boxes, and rasterized page images are Phase 10.
- **Confidence 1–5** is a learning signal. Overconfident errors get repair priority.
- **Remediation = why missed + core distinction + immediate retest.**
- **No XP, levels, achievements, or leaderboards.** Progress is exam-weighted readiness and concept state. Volume of easy questions must not look like advancement.

## Sessions and planning

- **LearningSession snapshots before/after** learner state.
- **Planner and spaced repetition are deterministic.** An LLM may explain a plan; it does not invent one.
- **Sequential chapter sittings.** Ordered planner versions (`phase4-agency-v1` … `phase4-ch14-v1`). Each chapter sitting opens only after prior sittings are complete. Resume any open sitting first.
- **Adaptive difficulty** is a policy over knowledge, performance, confidence, latency, and confusion — not accuracy percentage alone.

## Math, generation, offline

- **Calculation keys come from a MathSolver only.** AI may explain or write a scenario; it never owns the numeric answer.
- **Generated content lifecycle:** generated → source_check → structural_check → answer_check → ambiguity_check → wi_fact_check → validated → active. Teach Me uses `active` only.
- **Core study works without an API key.** Tutor, LLM teach-back, and batch generation are optional overlays.

## Sources and privacy

- **`source-material/` is never committed.** Local path via `SOURCE_MATERIAL_PATH`.
- **No reconstructed course in git.** Extracted text lives in the local database.
- **Citation or label.** No confident Wisconsin fact (statute, fee, deadline, form line, protected class) without a source page. Otherwise `general_explanation` or `needs_verification`.
- **Source layers are dated**, not a single overwrite chain: course book, chapter notes, dated updates, exam blueprint, pedagogy. Updates may supersede a book section by link; both records remain.
- **Canonical book is PUB725.** Chapter-folder PDFs are aligned notes with different pagination.
- **Practice-exam stems stay in the local DB** and are not rendered in Library or committed to git.
- **Video transcription and OCR are deferred** (Phase 10). Image-heavy form pages are stored as `needsOcr` placeholders.

## Phase 5 in progress (Chapters 1–9 questions)

Hand-authored Chapter 1–9 MCQs with heading citations, confidence prompts, why-missed + distinction remediation, immediate retest queue, `QuestionAttempt`, and separate knowledge vs performance state rows. Mistakes lists open/resolved misses. No generated items, no practice-exam import, no class-miss photos yet.

## Phase 5 boundaries (still in force)

Do not invent Wisconsin facts. Do not activate unvalidated generated MCQs. Do not import the 140-item practice exam into git. Do not add photo miss intake, the live tutor, embeddings, or SRS yet.

## Phase 4 complete (Chapters 1–14)

Hand-authored learning assets with heading citations for all 14 chapters. Rule-based planners build sequential ~20 minute sittings. Start session resumes an open sitting; otherwise advances Chapter 1 → 14. Progress lists those chapters. No OpenAI client. `/` stays static for Vercel. Chapters 12–14 are book-sourced (no chapter-folder notes PDFs).

## Phase 4 boundaries (still in force)

Do not invent Wisconsin facts. Teach Me chapter sittings stay citation-bound. Do not add photo miss intake, the live tutor, embeddings, or SRS as Phase 4 work.

## Phase 3 complete

Hand-seeded Chapter 1 Agency concepts from ingested PUB725 / notes headings. Each concept has a page citation, exam-category IV, and a WI flag only where the cited heading had Wisconsin markers. Progress lists them as not started. Confusion pairs activate only when both sides exist in the catalog. Chapter 2 concepts follow the same rules (IV for Agency headings; IX for antitrust).

## Phase 3 boundaries (still in force)

Do not invent Wisconsin facts or concepts. Do not auto-extract remaining chapters yet. Do not build quizzes, the tutor, embeddings, or an OpenAI client. Do not show fake 0% mastery bars.

## Phase 2 complete

Ingest PUB725 + Chapter 1–11 notes into `SourceDocument` / `SourceSection` with page citations. Chapters 12–14 are visible as book sections. Visual anchors are page-number placeholders.

## Phase 2 boundaries (still in force)

Do not create embeddings, install an OpenAI client, build RAG, quizzes, the tutor, the math engine, the exam simulator, SRS, or adaptive mastery. Do not upload PDFs to a vendor. Do not OCR forms or transcribe video.
