# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```
npm install      # install dependencies
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm start        # run the production build
```

No lint or test scripts are configured (`package.json` only defines `dev`/`build`/`start`). There is no test suite.

## Architecture

This is a single-page Next.js 15 App Router site (`app/page.tsx`) that renders a fixed sequence of section components inside `<main>`: `ScrollHero`, `LogosSection`, `CountdownSection`, `SpeakersSection`, `AboutSection`, `TicketsSection`, `ProcessSection`, `RegistrationSection`, `Footer`. There is no other routing besides the two API routes below.

**Layered fixed backgrounds.** `PageBackground` (z-index `-2`, a fixed cover photo) and `MountainWatermark` (z-index `-1`, a fixed SVG silhouette) are both rendered once in `app/layout.tsx`, not per-section. They rely on CSS stacking order: negative-z-index descendants paint above the body's own background but below normal-flow page content, so both watermarks are visible through every section without needing per-section opacity handling. `layout.tsx` also defines the three font CSS variables used everywhere: `--font-display` (Playfair Display, serif — hero `<h1>` and a few sub-headings), `--font-heading` (Montserrat 700 — every section `<h2>` and the large stat numbers), `--font-body` (Inter — body copy).

**Scroll-jacked hero (`ScrollHero.tsx`).** Not a `<video>` — it's a `<canvas>` driven by a `requestAnimationFrame` loop that maps scroll progress inside a 400vh wrapper to one of 121 pre-extracted JPEG frames (`/frames/frame_0001.jpg` … `frame_0121.jpg`, count in `FRAME_COUNT`) and draws it with `cover` fit (`Math.max` of the width/height ratios — deliberately not `contain`, to keep the animation full-bleed rather than letterboxed). The frame files live under `public/frames/` but are **not** committed to git (see Deployment below) — any change to them has to be re-uploaded to the server by hand.

**`FadeIn.tsx`** is the shared scroll-reveal wrapper (Framer Motion `whileInView`, `once: true`) used by nearly every section; pass `index` to stagger the delay across sibling items.

**`AboutSection`'s "book" widget** deliberately avoids Framer Motion's `AnimatePresence` for the page-flip text transition. An earlier version used it, and rapid repeated clicks left `AnimatePresence` stuck mid-transition — the `index` state kept advancing correctly but the visible DOM froze on a duplicated old node. The fix (and the pattern to keep if this is touched again) is a plain `key={index}` remount plus a CSS `@keyframes` entrance animation, no exit choreography.

**`TicketsSection.tsx`** owns the canonical `ZONAS` array (id/nombre/precio/ubicacion/badge) and exports `ZONAS`/`ZonaId`; `RegistrationSection.tsx` imports from here rather than duplicating zone data. The zone picker is two things kept in sync: a hand-coded SVG `VenueDiagram` (three hoverable/clickable `<rect>` bands, not AI-generated — precision mattered more than style here) and the zone cards. Both call `elegirZona()`, which dispatches a `window` CustomEvent (`"select-zone"`) that `RegistrationSection` listens for to pre-fill its zone `<select>`. This event is the only cross-component communication in the app — there's no shared state/context.

**Registration flow.** `RegistrationSection.tsx` posts JSON to `app/api/registro/route.ts`, which appends a row to a per-day workbook at `data/exports/registros_<AAAA-MM-DD>.xlsx` using `xlsx` (SheetJS) — it reads the whole file, appends, and rewrites it each time; there's no database. The day bucket is computed in the `America/Mexico_City` timezone regardless of where the server actually runs (flagged as an assumption in a code comment in that file). `app/api/registro/export/route.ts` is a separate GET endpoint to download a given day's workbook via `?date=AAAA-MM-DD&key=...`, gated by a single shared-secret env var `EXPORT_ACCESS_KEY` — there's no real auth/session system beyond that. Copy `.env.example` to `.env.local` to set it locally.

**Countdown target.** `CountdownSection.tsx` hardcodes the event date/time as `FECHA_EVENTO` (`2026-10-16T09:00:00-06:00`); the 9:00am start time is flagged in a comment as an assumption, not a confirmed detail.

## Deployment

The live site (foroampiags.com.mx) runs on Hostinger's Node.js hosting, deployed via hPanel's Git integration pointed at `github.com/sempagni/foroampi7` (branch `main`, auto-deploy on push, app root `./`). There's no CI config in this repo; Hostinger runs its own build/start.

`.gitignore` deliberately excludes several things that still need to exist on the server but never travel through git:
- `public/frames/` (121 JPEGs for the hero animation) and `public/hero.mp4` (the unused source video, kept only in case frames need re-extracting) — after any change to these, upload the new files by hand via Hostinger's File Manager into the deployed app's `public/frames/` folder.
- `data/exports/` — contains real registrant PII (xlsx workbooks), never belongs in git.
- `.env` / `.env.local` — real secrets.
- `/frames/`, `/hero.mp4`, `/assets/`, `/reference/` at the repo root — leftover duplicates/backups from asset iteration that the app never reads; safe to ignore or delete locally.

If the hero video is ever regenerated, re-extract frames with `ffmpeg -i hero.mp4 -vf "fps=24,scale=1920:-1" -q:v 4 "public/frames/frame_%04d.jpg"` and update `FRAME_COUNT` in `ScrollHero.tsx` if the total changes from 121.

## Content conventions

- All copy is Spanish. House rule: no em dashes or hyphens anywhere in visible text except inside correctly hyphenated compound words, URLs, or filenames — rephrase with commas instead.
- Design tokens (`--accent`, `--text-body`, `--card-shadow`, etc.) live in `app/globals.css` as CSS custom properties; reuse them instead of hardcoding colors.
