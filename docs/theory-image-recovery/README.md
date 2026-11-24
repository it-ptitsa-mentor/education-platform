# Theory images recovered from Buildin

Baseline: main 6fa3a70 (PR #81 merged). 235 IMG markers in 131 lessons.

228 original images retrieved from the lesson's Buildin image blocks. The old cdn2.buildin.ai URLs fail; the corresponding cdn.buildin.ai paths return the original files. Files were validated as images, matched to markers in source order, and copied without transcoding. The original SVGs in the Git lesson were detected by content, not URL extension. Source block IDs, stable source URLs and SHA-256 are in recovery.json. Temporary signed query strings and access credentials are excluded.

Seven missing originals are replaced with code-native SVG diagrams drawn from the adjacent lesson text and examples: Emmet expansion (1), stacking axes/order (2), Grid lines/tracks/cells (2), implicit grid (1), React one-way data flow (1). These are teaching diagrams, not purported original screenshots; provenance distinguishes them explicitly.

Manual alignment exceptions:
- HTML introduction: the first original was previously replaced with the supplied pilot PNG; the remaining marker is the tag anatomy diagram (second source image).
- DOM: source image 1 is an unrelated GitHub screenshot. Use source images 2/3/4 for request/DOM/rendering, HTML-to-tree and malformed HTML recovery, respectively. No unrelated screenshot inserted.

The lesson index and 235 original marker contexts are in inventory-before.json. recovery.json lists each lesson and local file. No IMG markers remain after this batch. The three supplied pilot PNGs remain byte-for-byte unchanged.

## Reimport preservation

content/theory-images.json maps stable Buildin block IDs to local assets and alt text. import-buildin-theory.py emits those image links during reimport and preserves content/theory/assets even if FROZEN_MODULES is empty. The registry lives outside the directory replaced by the importer. M1/M2 text remains protected by FROZEN_MODULES; M3–M6 source text still belongs to Buildin. To replace a mapped illustration, update the asset/registry in Git; do not insert expiring CDN links into Markdown.

CI runs filesystem integration tests for reimport preservation, mapped emission, missing assets and every registered image. Course content generation copies images into the web build. Screenshots and browser verification are recorded separately after preview deployment.
