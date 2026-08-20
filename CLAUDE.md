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

Do not run `npm run build` while a dev server is running against this same directory: the production build overwrites the `.next/` output that `next dev` is serving from, which breaks the running server (500s, `globals.css` stops loading) until it is restarted.

## Architecture

This is a single-page Next.js 15 App Router site. `app/page.tsx` renders a fixed sequence of section components inside `<main>`: `HeroIntro`, `CountdownSection`, `SpeakersSection`, `VenueVideoSection`, `AboutSection`, `TicketsSection`, `RegistrationSection`, `Footer`. There is no other routing besides the two API routes below. `app/icon.png` supplies the favicon by App Router convention.

**`layout.tsx` renders four things around the page.** `PageBackground` (z-index `-2`, a fixed cover photo at 50% opacity) and `MountainWatermark` (z-index `-1`, a fixed SVG silhouette at 6% opacity) rely on CSS stacking order: negative-z-index descendants paint above the body's own background but below normal-flow page content, so both watermarks are visible through every section without needing per-section opacity handling. `Navbar` is a `position: fixed` bar rendered once here, not per-page. The Meta Pixel is injected here too via `next/script`. `layout.tsx` also defines the three font CSS variables used everywhere: `--font-display` (Playfair Display, serif — hero `<h1>` and a few sub-headings), `--font-heading` (Montserrat 700 — every section `<h2>` and the large stat numbers), `--font-body` (Inter — body copy).

**Fixed navbar and anchor offsets.** Because `Navbar` is fixed, `app/globals.css` gives `#ponentes`, `#boletos` and `#registro` a `scroll-margin-top: 84px` so in-page anchors do not land underneath it. If the navbar's height changes, that value has to change with it.

**`HeroIntro.tsx`** is the first screen: a static, full-viewport flex column (logo, "Regístrate aquí" button, gradient title, event seal, subtitle) animated in with staggered Framer Motion `initial`/`animate` transitions. There is no canvas, no scroll-jacking and no frame sequence. An earlier version of this site had a `ScrollHero` canvas driven by 121 pre-extracted JPEG frames; it was removed in commit `1f8d6e2` along with `LogosSection` and `ProcessSection`, and nothing in the app reads `public/frames/` or `public/hero.mp4` anymore.

**`FadeIn.tsx`** is the shared scroll-reveal wrapper (Framer Motion `whileInView`, `once: true`, `amount: 0.3`) used by nearly every section; pass `index` to stagger the delay across sibling items (`index * 0.1s`).

**`VenueVideoSection.tsx`** embeds a youtube-nocookie iframe of the venue in a 16:9 wrapper, autoplaying muted and looping. A `useEffect` posts a `mute` command to the iframe on `load` plus once on a 1s timeout, belt-and-braces against browsers that ignore the `mute=1` query param. Below it sit the Buró de Congresos logo and the date/venue caption.

**`AboutSection`'s "book" widget** deliberately avoids Framer Motion's `AnimatePresence` for the page-flip text transition. An earlier version used it, and rapid repeated clicks left `AnimatePresence` stuck mid-transition — the `index` state kept advancing correctly but the visible DOM froze on a duplicated old node. The fix (and the pattern to keep if this is touched again) is a plain `key={index}` remount plus a CSS `@keyframes` entrance animation, no exit choreography.

**`SpeakersSection.tsx`** is a drag-and-hover-pausable marquee: the `PONENTES` list is rendered twice into `.speakers-track` and translated by a `requestAnimationFrame` loop. The wrap point is `(track.scrollWidth + gap) / 2`, not `scrollWidth / 2` — `scrollWidth` only counts the `n - 1` gaps *between* children, so halving it leaves half a gap out and the loop visibly jumps every cycle. All cards share a fixed `height: 400px` from the `.speaker-card` class, with the photo at `flex: 0 0 220px` and the green panel at `flex: 1`, so the accent block always paints to the bottom edge regardless of how long a speaker's description is.

**`TicketsSection.tsx`** owns the canonical `ZONAS` array (id/nombre/precio/ubicacion/badge) and exports `ZONAS`/`ZonaId`; `RegistrationSection.tsx` imports from here rather than duplicating zone data. The zone picker is two things kept in sync: a hand-coded SVG `VenueDiagram` (three hoverable/clickable `<rect>` bands, not AI-generated — precision mattered more than style here) and the zone cards. Both call `elegirZona()`, which dispatches a `window` CustomEvent (`"select-zone"`) that `RegistrationSection` listens for to pre-fill its zone `<select>`. This event is the only cross-component communication in the app — there's no shared state/context.

**Registration flow.** `RegistrationSection.tsx` posts JSON to `app/api/registro/route.ts`, which expands the purchase into one row per ticket (the buyer plus each extra attendee, all sharing one `id_compra`) and sends them to a Google Apps Script bound to a Google Sheet. That script appends the rows and emails a notification. Its source is kept in `scripts/google-apps-script.gs`, but the copy that actually runs lives in Google, pasted into the sheet's Apps Script editor: editing the file here changes nothing until it is pasted and redeployed. Configured through `REGISTROS_WEBHOOK_URL` and `REGISTROS_WEBHOOK_SECRET`.

The sheet is the store of record, and it is deliberately off-server. Registrations used to be written only to per-day workbooks at `data/exports/registros_<AAAA-MM-DD>.xlsx`, which was silent data loss: `data/exports/` is gitignored and generated at runtime, so every Hostinger redeploy replaced the app directory and took the accumulated registrations with it. This was confirmed in production on 2026-08-20, a test registration vanished the moment a push redeployed the site.

The xlsx write survives as an emergency copy only, for the case where Google is unreachable at the moment someone registers. It still goes through the module-level promise chain (`enCola`) and the `.tmp` plus `rename` commit, because the handler reads the whole workbook, appends and rewrites it: without the chain, simultaneous POSTs read the same version and one silently overwrites the other. Keep both if that path is touched. The chain only serializes within one Node process. Do not treat these files as storage, the next deploy deletes them.

`app/api/registro/export/route.ts` is a GET endpoint to download a given day's emergency copy via `?date=AAAA-MM-DD&key=...`, gated by the shared secret `EXPORT_ACCESS_KEY`. There is no auth system beyond that, and the key travels in the query string, so it lands in server access logs.

**Reporting.** `scripts/reporte-registros` is a standalone CommonJS script, run on demand, not scheduled. Default mode reports the last 7 complete days (ending yesterday, so the day in progress is never split across two reports) with a comparison against the previous 7. `--todo` prints the full roster, `--local` works offline from `data/cache-registros/`. Both modes write a CSV and an xlsx into `reportes/`. It reads the Google sheet when configured and falls back to the export endpoint otherwise.

Dates need care there. The site writes `"20/08/26, 2:24:07 a.m."` as text, but Sheets recognises the cell as a date and hands it back converted, as `"Thu Aug 20 2026 02:24:07 GMT-0600"`. `partesDeFecha()` accepts both. This matters more than it looks: the weekly report filters by day, so a date it cannot parse yields zero registrations for a week that actually had them.

`reportes/` and `data/cache-registros/` are gitignored, both hold registrant PII.

**Countdown target.** `CountdownSection.tsx` hardcodes the event date/time as `FECHA_EVENTO` (`2026-10-16T08:00:00-06:00`). The 8:00 start is confirmed by the client, not an assumption, and matches the section heading ("Te esperamos desde las 8:00 hasta las 19:00 hrs."). The component renders `--` until its `useEffect` runs so server and client markup agree.

## Deployment

The live site (foroampiags.com.mx) runs on Hostinger's Node.js hosting, deployed via hPanel's Git integration pointed at `github.com/sempagni/foroampi7` (branch `main`, auto-deploy on push, app root `./`). There's no CI config in this repo; Hostinger runs its own build/start.

Every asset the app reads lives in `public/` and is tracked in git, so a push is a complete deploy. Nothing has to be uploaded by hand through Hostinger's File Manager. (`public/LogosForo.svg` is the one tracked file nothing references; it is left over from the deleted `LogosSection`.)

`.gitignore` excludes what matters:
- `data/exports/`, `data/cache-registros/` and `reportes/` — real registrant PII, never belongs in git.
- `.env` / `.env.local` — real secrets.

Deploys are destructive to anything the app wrote at runtime. Nothing that has to outlive a push may live inside the app directory.

It also still lists `public/frames/`, `public/hero.mp4`, `/frames/`, `/hero.mp4`, `/assets/` and `/reference/`. Those are vestigial entries from the pre-redesign hero and from asset iteration; none of those paths exist and nothing reads them.

## Content conventions

- All copy is Spanish. House rule: no em dashes or hyphens anywhere in visible text except inside correctly hyphenated compound words, URLs, or filenames — rephrase with commas instead.
- Design tokens (`--accent`, `--text-body`, `--card-shadow`, etc.) live in `app/globals.css` as CSS custom properties; reuse them instead of hardcoding colors. `globals.css` also carries the `* { box-sizing: border-box }` reset that the fixed-height card layouts depend on.
