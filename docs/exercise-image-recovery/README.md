# Exercise image recovery

Inventory covers all 57 original references in 55 exercises. Each row retains its original exercise-specific path; identically named images are independent.

All 55 upstream condition URLs were checked on 2026-11-24: they redirect to `web/sessions/new` without an authenticated Hexlet session. See original-search.json. No originals were available in the previously audited local Git/workspace/server copies.

## Batch 1

Three distinct animated GIFs recorded from reference implementations: processes, rendering, use-context. Exact states and assertions are in batch-1-scenarios.json. Original solutions and starter files are unchanged. Capture uses Bootstrap 5.3.3 (presentation only), not a claim of pixel identity with the historical GIFs.

Assets are committed in `packages/web/public/exercise-assets/<slug>/example.gif`; Vite copies them to the same path under the deployment base. Each readme explicitly names its exercise namespace. Preview was checked at 1440 and 390 px; see preview-verification.json and screenshots.

Recording sources are retained under recording/. Run build.mjs with the repository dependencies installed and Bootstrap 5.3.3 CSS saved as `/tmp/exercise-recording/bootstrap.min.css`, serve `/tmp/exercise-recording` at 127.0.0.1:8767, and run record.mjs with a headless Chrome CDP endpoint in CDP_PORT (default 9337). Frames are converted with ffmpeg palettegen/paletteuse at 1 fps, looping. The renderer works outside the repository, overlays __solution__ on starters and does not publish source solutions.
