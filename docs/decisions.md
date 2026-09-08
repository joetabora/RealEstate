# Architecture decisions

Phase: 3 — Knowledge + blueprint mapping  
Status: locked unless a concrete technical contradiction appears.

This file records the Architecture Lock. It is binding for implementation.

## Product

- **Teach Me is the home loop.** `/` is Today's Plan. Library, Practice, Math, Exam, and Tutor are secondary.
- **One local learner.** Stable key `local`. No authentication, billing, or social features.
- **Personal now, platform later.** Tables are keyed so a future `userId` can exist; Phase 1 does not build multi-user infrastructure.

## Knowledge and assessment

- **CourseEdition versioning.** Current edition slug: `wra-sales-2024`, jurisdiction `WI`. A later 2027 edition must not destroy 2024.
- **Exam blueprint is first-class data**, not course content. Pearson salesperson outline I–X is seeded with weights summing to 140. Concepts and questions will join to it later.
- **KnowledgeState and PerformanceState stay separate** (entities in a later phase). Understanding a concept is not the same as surviving exam conditions. Do not collapse them into a single mastery percentage.
- **ConfusionPair is an entity.** Seeded pairs are active only when both concept slugs exist. Evidence starts as `seed`; later misses can add more.
- **LearningAsset is the content model** (later). Extensible types: explanation, simple language, analogy, scenario, comparison, visual, recall, teach-back, application, calculation, form-line, trap, exam recognition, remediation. Do not freeze `Lesson.mode` as the schema.
- **VisualAnchor** stores page-number placeholders now. OCR, bounding boxes, and rasterized page images are Phase 10.
- **Confidence 1–5** is a learning signal. Overconfident errors get repair priority.
- **Remediation = why missed + core distinction + immediate retest.**
- **No XP, levels, achievements, or leaderboards.** Progress is exam-weighted readiness and concept state. Volume of easy questions must not look like advancement.

## Sessions and planning

- **LearningSession snapshots before/after** learner state.
- **Planner and spaced repetition are deterministic.** An LLM may explain a plan; it does not invent one.
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

## Phase 3 complete

Hand-seeded Chapter 1 Agency concepts from ingested PUB725 / notes headings. Each concept has a page citation, exam-category IV, and a WI flag only where the cited heading had Wisconsin markers. Progress lists them as not started. Confusion pairs activate only when both sides exist in the catalog.

## Phase 3 boundaries (still in force)

Do not invent Wisconsin facts or concepts. Do not auto-extract remaining chapters yet. Do not build quizzes, the Teach Me session runner, the tutor, embeddings, or an OpenAI client. Start session stays disabled. Do not show fake 0% mastery bars.

## Phase 2 complete

Ingest PUB725 + Chapter 1 notes into `SourceDocument` / `SourceSection` with page citations. Chapters 12–14 are visible as book sections. Visual anchors are page-number placeholders.

## Phase 2 boundaries (still in force)

Do not create embeddings, install an OpenAI client, build RAG, quizzes, the tutor, the math engine, the exam simulator, SRS, or adaptive mastery. Do not upload PDFs to a vendor. Do not OCR forms or transcribe video.
