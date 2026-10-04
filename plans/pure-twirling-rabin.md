# Moodboard page (brand view) + Supabase data layer

## Context
In brand view the "Moodboard" card opens a page that currently shows one paragraph (`moodText`, `PageBody` case `"moodboard"` in `src/App.tsx` ~L561). The six reference screenshots show a Mac-app style library: a left sidebar with six categories, and a content grid per category. The user wants those layouts built first, with all data later coming from Supabase. The plan builds the layouts with the data layer already wired, then asks the user for the Supabase credentials and table details.

## Reference structure (from screenshots)
Sidebar, "library": internet prime 11, brands getting it right, campaigns & content, products & packaging, newsletters & blogs. Sidebar, "interests and all": passing time 101 (no screenshot; use the same simple grid).

| Section | Intro line | Layout |
|---|---|---|
| internet prime 11 | "cool websites on the internet" | 3-4 col grid of cards: screenshot thumbnail on top, name below (clay, wispr flow, linear, mschf, stripe /microsites, vacation inc, duna, posthog, mother studio, plum, dia) |
| brands getting it right | "click to see why i probably won't skip them on my feed" | grouped by category heading with a hairline (d2c, b2b, ...). Each group: row of square logo tiles with caption; the selected tile gets an outline and shows a paragraph below the row |
| campaigns & content | "my content marketing hall of fame" | 4-col cards: image, small kicker (the big knit), bold brand, one-line description |
| products & packaging | "welp! the ads got me. ok not yet, but these look cute." | 4-col cards: image, product name, short descriptor |
| newsletters & blogs | "happily subscribed to" | 3-col text-only cards: title, coloured category label, description |
| passing time 101 | tbd | generic card grid |

## Approach
1. **Layout components** (new file `src/Moodboard.tsx`, default export; `App.tsx` renders it for `page === "moodboard" && mode === "brand"` and keeps `CasesPage` for growth). The page uses the brand-view cream/ink palette with the existing 1px `#E5E1DA` borders and brand colours (PINK/LIME/BLUE/orange), not the dark theme of the references. Existing tokens and helpers to reuse: `ImageSlot`, `Rows`-style hairlines, `back-btn`, `hl-btn`, `Chev` from `App.tsx`. Because those live in `App.tsx`, move/export only what is needed instead of duplicating.
   - Sidebar: a `<nav>` of the six sections with icons (inline SVG), active item filled with a brand colour. It collapses to a horizontal scroll tab strip under `lg`.
   - Section state is kept in `useState`; the existing header (page title + homepage button) and `useBack` behaviour stay unchanged.
   - Sections: `SitesGrid`, `BrandsGrid` (grouped, selectable tile + description), `CampaignsGrid`, `ProductsGrid`, `NewslettersGrid`, `PassingTime`.
   - Every image is a plain `<img>` (reuse the `ImageSlot` pattern, `loading="lazy"`), so images from Supabase Storage URLs drop in and the user can swap `src` in the editor.
2. **Data layer** (new `src/lib/supabase.ts` + `src/useMoodboard.ts`):
   - Install `@supabase/supabase-js` with pnpm.
   - Client from `import.meta.env.VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; no client created if either is missing.
   - One hook, `useMoodboard(section)`, returns `{ rows, loading, error }`. It queries a table per section, ordered by a `sort` column; if the client is missing or the query fails it falls back to a small seed list in `src/moodboardSeed.ts` (the items visible in the screenshots, with placeholder images) so the page renders before the keys exist.
   - Proposed tables (to be confirmed or renamed by the user): `moodboard_sites` (name, image_url, url, sort), `moodboard_brands` (name, group, logo_url, bg_color, description, sort), `moodboard_campaigns` (kicker, brand, description, image_url, url, sort), `moodboard_products` (name, descriptor, image_url, url, sort), `moodboard_newsletters` (title, category, description, url, sort), `moodboard_interests` (title, description, image_url, sort).
   - Row types live next to the hook; column names are mapped in one place so renaming to the user's real schema is a one-line change per table.
3. **Credentials**: create `.env.local` (already git-ignored via `.env*`) with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, plus a committed `.env.example` with empty values. Only the public anon key goes in the front end; the user should have Row Level Security with a public read policy on these tables. The service-role key must not be used or shared in the browser app.
4. **Ask the user** (after the layout lands): Supabase project URL, anon (public) key, actual table and column names (or let me read the schema from the REST API once the URL and key are in), whether images are Storage URLs or columns with full URLs, and the content for "passing time 101".

## Critical files
- `src/App.tsx`: swap the `"moodboard"` case in `PageBody` (brand) to render `<Moodboard />`; export/move `ImageSlot`, `Chev`.
- New: `src/Moodboard.tsx`, `src/useMoodboard.ts`, `src/lib/supabase.ts`, `src/moodboardSeed.ts`, `.env.example`, `.env.local` (values from the user).
- `src/index.css`: only if a small class is needed for the sidebar tab strip scroll behaviour.

## Verification
- `npx tsc --noEmit -p .` and `pnpm build`.
- In the preview, brand view: open Moodboard, click through all six sections, check the selected-tile description in "brands getting it right", the mobile tab strip under 1024px, back/homepage buttons, and that the page works with no env vars (seed fallback).
- After the keys are added: confirm each section loads rows from Supabase (network tab shows the REST calls) and that a deliberately wrong table name falls back to the seed without crashing.
