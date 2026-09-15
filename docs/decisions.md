# Architecture decisions

Phase: 15 — Exam readiness narrative  
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
- **Question is a separate scored-item model.** Stem, options, citations, remediation. Phase 5 seeds Chapter 1–14 MCQs from confusion-pair distinctions. Do not import the 140-item course practice exam into git.
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

## Phase 15 complete (exam readiness narrative)

Progress shows a deterministic, exam-weighted readiness block: per Pearson category counts for open mistakes, overdue SM-2 reviews, concepts in learning, and last simulation correct/answered. Headline and next-action links are template-only. Exam home shows a short strip linking to Progress. No mastery percentage bars and no predicted licensing score. Planner and readiness never call an LLM.

## Phase 15 boundaries (still in force)

Do not invent a score prediction ("you will score X"). Do not collapse KnowledgeState and PerformanceState into one mastery %. Do not add XP. Do not let an LLM narrate the plan as authority.

## Phase 14 complete (local video transcripts)

`VideoSource` catalogs lecture files under `SOURCE_MATERIAL_PATH` (including Spl_/Lawsuit dated updates). Optional local Whisper writes unverified transcript text + gitignored sidecars under `LOCAL_TRANSCRIPT_PATH`. Default CLI limit is 1 — full 17h transcription is not a product gate. Dumps stay `needs_verification` and are never Teach Me / Practice / Exam truth. No cloud upload of course video.

## Phase 14 boundaries (still in force)

Do not upload course videos to a vendor. Do not invent Wisconsin facts from ASR. Do not auto-create LearningAssets or Questions from transcripts. Do not require Whisper for core study. Do not commit video binaries or transcript dumps.

## Phase 13 complete (draft MCQ generation)

Optional overlay creates confusion-pair draft MCQs as `lifecycle: generated` only. Mock is deterministic and offline; live OpenAI is optional and shares the tutor daily spend cap. Citations are copied from existing concept records — generation never invents Wisconsin statutes, fees, form lines, or numeric keys. Drafts must still pass Phase 12 gates and an explicit activate before Teach Me / Practice / Exam can use them. Re-seed preserves non-catalog pipeline drafts.

## Phase 13 boundaries (still in force)

Do not auto-activate generated drafts. Do not invent Wisconsin cites to satisfy gates. Do not require an API key for core study. Do not generate from class-miss OCR as course truth.

## Phase 12 complete (content validation gates)

Deterministic gates enforce the Architecture Lock lifecycle for questions and learning assets. Teach Me / Practice / Exam continue to load `active` only. WI-like claims without citations fail `wi_fact_check` — gates never invent statutes, fees, or form lines. `validated` items require an explicit activate step before becoming `active`. Gate outcomes are audited in `ContentGateEvent`.

## Phase 12 boundaries (still in force)

Do not let an LLM skip gates or invent Wisconsin cites to pass wi_fact_check. Do not auto-activate rejected or unverified items. Do not feed needs_verification OCR/photo dumps into the active catalog.

## Phase 11 complete (class-miss photos)

Local photo intake on Mistakes via `ClassMissCapture`. Files stay under `LOCAL_CLASS_MISS_PATH` (gitignored). Optional Tesseract text is stored with `ocrVerified=false` / needs_verification and never becomes Teach Me content or Wisconsin course truth. Photos may optionally link a concept or an open practice Mistake, or be discarded. No cloud upload and no auto-generated MCQs from images.

## Phase 11 boundaries (still in force)

Do not upload class photos to a vendor. Do not invent WI facts from OCR. Do not auto-activate questions or Teach Me assets from photo intake. Do not commit photo binaries.

## Phase 10 complete (visual / OCR queue)

`VisualAnchor` carries `ocrStatus`, `ocrNote`, and unverified `ocrText`. Ingest sets `pending` for `needsOcr` sections and may copy a form token from the extracted heading only. Library lists a local OCR queue; section pages show status and optional local PNG / Tesseract dump. `npm run render:ocr-pages` (`pdftoppm`) and `npm run ocr:pages` (`tesseract`) are optional local tools. OCR dumps stay `ocrVerified=false` / needs_verification and are never Teach Me truth. Source PDFs stay on disk; no vendor upload. Video transcription and class-miss photo intake remain out.

## Phase 10 boundaries (still in force)

Do not invent OCR text for image-heavy pages. Do not upload PDFs to a vendor. Do not treat OCR dumps as verified Wisconsin form lines. Do not commit rendered page images. Do not feed unverified OCR into Teach Me planners.

## Phase 9 complete (exam simulation)

Timed blueprint-balanced sitting on `/exam` using existing `active` MCQs only. Seat counts follow Pearson salesperson outline weights via largest-remainder allocation, never inventing stems or importing the course 140-item practice exam. Question and option order use a seeded shuffle. Mid-exam: no remediation banner, no immediate retest queue, and no concept/citation hints. Attempts update PerformanceState and Mistakes; they do not advance SM-2. Timer auto-ends the sitting; results show overall and primary-category scores with recent history on `/exam`. Always labeled as a study simulation — never as a live licensing exam.

## Phase 9 boundaries (still in force)

Do not import the 140-item course practice exam into git. Do not label generated or simulated items as live licensing questions. Do not invent Wisconsin facts to pad inventory. Do not let an LLM write exam keys.

## Phase 8 complete (deterministic math)

In-code math templates with fixed solvers for commission, seller net, LTV, loan-from-LTV, down payment, discount points, simple interest, 365- and 360-day prorations, and transfer fee with an explicit rate input (no hardcoded Wisconsin statutory schedule). Guided steps and optional attempt checking. The tutor / any LLM never computes the numeric key. Adaptive Teach Me prefixes insert `calculation` items for mapped math concepts (deep-link to `/math?template=…`); concept detail surfaces the same link. Completing a calculation item advances SM-2 like other repair/review steps.

## Phase 8 boundaries (still in force)

Do not let an LLM calculate answers. Do not invent Wisconsin fee schedules or statutory rates without a citation. Do not build timed exam-math mode yet.

## Phase 7 complete (optional tutor)

Socratic tutor overlay with learner-toggleable modes: `off` (default), `mock` (no API key / no spend), `live` (requires `OPENAI_API_KEY` and network). Soft daily spend cap for live. Keyword retrieval points at matching concepts, Teach Me assets, and Library sections (not embeddings). Learner-state lane adds open mistakes and overdue review pointers. Tutor never invents Wisconsin statutes, fees, deadlines, or form-line text. Live is blocked offline; Mock still works. Threads can be cleared for a new conversation. Planner and SRS still never call the LLM. Core study works with Tutor fully off.

## Phase 7 boundaries (still in force)

Do not build unconstrained PDF chat, voice, or embedding-based RAG yet. Do not let the tutor invent the study plan or mastery percentages. Do not require an API key for Teach Me, Practice, Progress, or Library.

## Phase 6 complete (adaptive planner)

Deterministic SM-2 `ReviewSchedule` per concept, updated from practice attempts (correct + confidence → quality) and from Teach Me review/repair item completion (fixed quality 4 until a confidence UI exists). New Teach Me sittings prepend up to three repair/review assets from open mistakes, overdue schedules, then overconfidence misses for the chapter. Progress shows overdue counts and concept links; concept detail shows the schedule fields; Teach Me surfaces an adaptive hint from the same counts. Due-review practice (`phase6-due-review-v1`) picks existing MCQs for overdue concepts across chapters (cap 8). Planner and SRS never call an LLM. No XP. KnowledgeState and PerformanceState stay separate from ReviewSchedule.

## Phase 6 boundaries (still in force)

Do not invent Wisconsin facts. Do not add photo miss intake, the live tutor, embeddings, or LLM narration to the planner. Do not replace sequential chapter sittings with a free-form queue. Do not show fake mastery percentages.

## Phase 5 complete (Chapters 1–14 questions)

Hand-authored Chapter 1–14 MCQs with heading citations, confidence prompts, why-missed + distinction remediation, immediate retest queue, `QuestionAttempt`, and separate knowledge vs performance state rows. Mistakes lists open/resolved misses. No generated items, no practice-exam import, no class-miss photos yet.

## Phase 5 boundaries (still in force)

Do not invent Wisconsin facts. Do not activate unvalidated generated MCQs. Do not import the 140-item practice exam into git. Do not add photo miss intake, the live tutor, or embeddings as Phase 5 work.

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
