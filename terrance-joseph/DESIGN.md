# Design Guidance — Terence Joseph Memorial Site
## Photo Album Section

This document records the design decisions made for the gallery/photo album section of `site/terrance-joseph/index.html`, the reasoning behind them, and rules to follow for any future updates to this section. It is grounded in the design authorities consulted via the `/frontend-design` skill.

---

## The Design Problem

The source material is a c.1959–61 Methodist missionary booklet: 27 photographs alternating with 27 typed caption pages, bound together. The challenge was to present all of this on a memorial website without:

- Losing the primary-source character of the original captions
- Making the page feel like a generic photo gallery
- Showing 27 scans of typed pages as gallery thumbnails (illegible decoration)
- Burying the family portrait in a uniform grid

---

## What the Design Authorities Said

### Butterick (*Practical Typography*) — on caption pages
**Don't show images of typed text when you can typeset the text.** Caption page scans shown as thumbnails reduce primary-source text to unreadable decoration. The honest treatment: transcribe the captions and typeset them. The scan is accessible via lightbox if a reader wants to verify the original. This is the same principle that makes endnotes work — the information is available, it's just where it belongs.

**Applied:** Caption page image files (focus_0004, focus_0006, etc.) are NOT shown as gallery images. Their text is transcribed and typeset as `.caption-verbatim` below each photograph.

### Rams (10 Principles) — on double information
**Don't say the same thing twice.** Showing a scan of typed text AND typeset text of the same caption is redundant. Pick the path that serves the reader. The path that serves the reader is readable typeset text; the path that serves the scholar is the scan in a lightbox. Separate these functions.

**Exception (Rams' own rule — "earns its place"):** The **booklet cover** and the **Southeast Asia map** are shown as image documents because they have visual/cartographic content that cannot be captured by text alone. These two images earn their place as documents; the caption pages do not.

**Applied:** Only `booklet-cover.jpg` and `map-southeast-asia.jpg` are shown as document images. All 25 caption pages are text-only.

### Hoefler (Hoefler&Co) — on the centrepiece
**The family portrait is not a grid item.** The only known photograph of Rev. Joseph, his wife, and their son together deserves breakout treatment — not constrained to a 280px grid cell alongside other photos. Display and hierarchy should feel intentionally contrasted, not merely different.

**Applied:** The family portrait uses `.album-portrait-hero` — centered, max-width 560px, full-width image with no `aspect-ratio: 4/3` crop, bordered by a 2px teak rule at the caption. It sits between the document pair and the first group, before the grid begins.

### Albers (*Interaction of Color*) — on the photo backgrounds
**Colours are never seen in isolation.** The `album-img-wrap` background is `hsl(40, 20%, 92%)` — an aged, warm off-white. Before a photograph loads, this tone primes the eye toward warmth and archive. After loading, it bleeds slightly at the edges of images that don't fill their container, reinforcing the archival register. This is not decorative — it is contextual colour doing perceptual work.

**Do not change this to white (`#fff`) or grey (`hsl(0,0%,92%)`)** — the warmth is load-bearing. White reads as "photo app"; cool grey reads as "tech product". The aged tone reads as "archive".

### Bringhurst (*Elements of Typographic Style*) — on caption measure and leading
Caption text (`.album-caption`, `.caption-verbatim`) is set at 0.80–0.82rem, line-height 1.62–1.65. This is below body size, which is correct for captions — they are secondary to the image. But they must remain readable: **do not go below 0.78rem** (Spiekermann minimum, ~12.5px at default root).

The verbatim captions can be long (up to 6 sentences). Bringhurst: measure for a narrow column (280px card) sits around 38–45ch, which is at the lower bound of legibility. The 0.82rem size and 1.65 leading compensate for the narrow measure. **Do not reduce font size to "save space" in the caption area** — it breaks the lower legibility bound.

### Wathan & Schoger (*Refactoring UI*) — on the grid
`repeat(auto-fill, minmax(280px, 1fr))` with `gap: 1.75rem 1.5rem`. This is a content-driven grid — it fills available space and reflows naturally at any breakpoint. No explicit breakpoint overrides are needed for the grid itself. **Do not replace this with a fixed 3-column grid** — portrait-ratio photos (Dr. Ivy Chou, Chief Sibat, Kumpang) will look awkward forced to landscape 4:3 in a rigid 3-column layout.

---

## Typeface Decisions for Captions

| Element | Font | Size | Weight | Style | Colour |
|---------|------|------|--------|-------|--------|
| Section title "The Photo Album" | Playfair Display | clamp(1.75rem, 3.5vw, 2.5rem) | 300 | normal | `var(--ink)` |
| Group labels | Inter | 0.72rem | 500 | uppercase, tracked | `var(--accent)` teak |
| Caption (modern description) | Inter | 0.80rem | 400 | normal | `var(--muted)` |
| Caption verbatim (original words) | Playfair Display | 0.82rem | 300 | italic | `var(--aged)` hsl(30,15%,42%) |
| Portrait hero verbatim | Playfair Display | 1.05rem | 300 | italic | `var(--accent)` teak |
| Portrait caption note | Inter | 0.78rem | 400 | normal | `var(--muted)` |

**Why Playfair italic for verbatim captions:** The italic signals "these are original words, not our words." The 300 weight keeps it from competing with the photograph. The `--aged` colour (warm mid-tone) is visibly distinct from `--muted` (neutral grey) — Albers: the warm hue connects the caption to the aged-paper image backgrounds, reinforcing the archival register.

---

## Structural Rules for Future Updates

### Adding new photographs
1. Copy the source file to `site/terrance-joseph/photos/` with a descriptive kebab-case name.
2. Add a `<figure class="album-item">` inside the appropriate `.album-group > .album-grid`.
3. Include a `.caption-verbatim` span with the original caption text in quotation marks, exactly as typed (all-caps is fine — reproduce the original).
4. Add `class="gallery-img"` to the `<img>` so the lightbox activates on click.
5. Add `loading="lazy"` on all new images — there are already 28 on the page.

### Adding a new group
1. Add a `<div class="album-group reveal">` with an `<h3 class="gallery-group-label">` and an `.album-grid` inside.
2. Place it in chronological/thematic order within the section.
3. Do not add a "Gallery" sub-navigation — the existing nav link to `#gallery` is sufficient. If the album grows beyond 50 photos, consider in-page group anchors at that point.

### Caption pages — what NOT to do
- Do not add caption page scans as gallery items. They are already represented as transcribed text.
- Do not skip the verbatim caption if you're adding a photo. The captions are primary source evidence; their specific words matter.
- If the original caption is not known, use plain `.album-caption` text without the `.caption-verbatim` span (see `mission-building-sarawak.jpg` as the model for this case).

### The family portrait — never gridify it
`joseph-family-portrait-1959.jpg` must stay in `.album-portrait-hero`. Do not move it into a grid. If the portrait is ever replaced with a higher-resolution version, keep the same markup — just swap the `src`.

### Rotated source photos
Several source photos (focus_0011, focus_0015, focus_0017, focus_0019, focus_0021, focus_0041, focus_0051) were scanned with the camera turned 90°. The current approach uses `object-fit: cover` in a `4/3` container — the centre of the landscape image is shown. This is an acceptable archive presentation; users can click the lightbox for the full scan. If a photo is later re-scanned or digitally rotated, update the src without changing the HTML structure.

---

## Colours in Use (Gallery Section)

| Variable | Value | Meaning |
|----------|-------|---------|
| `--bg` | hsl(60, 5%, 96%) | Page background |
| `--card` | #ffffff | Gallery section background |
| `--accent` | hsl(25, 55%, 32%) | Teak — used for group labels, portrait caption, chapter rules |
| `--ink` | hsl(0, 0%, 12%) | Primary text |
| `--muted` | hsl(0, 0%, 42%) | Secondary text (captions, source note) |
| `--aged` | hsl(30, 15%, 42%) | Warm mid-tone — verbatim caption text only |
| img-wrap bg | hsl(40, 20%, 92%) | Aged paper tone — inline in CSS, not a variable |

The `--aged` variable exists specifically for the verbatim captions. Do not use it for anything else — it has a precise perceptual function (warm, recessive, distinct from both `--muted` and `--ink`).

---

## What We Decided Not to Do (and Why)

| Option considered | Rejected because |
|-------------------|-----------------|
| Show caption page scans as gallery items | Butterick: typed text shown as 280px thumbnail is unreadable decoration |
| Show caption page scan inline beside each photo, then also transcribe | Rams: double information. One path serves the reader, one serves the scholar. Lightbox handles the scholar. |
| Uniform 4/3 grid for all photos including the family portrait | Hoefler: the centrepiece must not be grid-constrained |
| Sepia filter on photographs | Generic. The aged-paper background does the archival work without filtering the photos themselves |
| Show only a "best of" selection | User requirement: all images on the site. The full archive is the document. |
| Caption pages in a separate "Documents" section | Creates a navigation problem; separates captions from their photographs. Keeping them as text below each photo is structurally honest to the source material. |
