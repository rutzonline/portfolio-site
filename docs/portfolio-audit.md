# Portfolio audit — 18 October 2026

## Scope

Reviewed both modes and the home, About, Skills & Stack, Notes, Experience, case-study, Moodboard and What I'm Up To layouts at 390px and 1440px. This is a consistency and maintenance pass, not a redesign or a rewrite of published case studies.

## Changes made

- Removed the disconnected music trail, its Last.fm API/server integration, local Vite middleware, obsolete setup instructions and unused environment template. Existing local/hosted secrets were not changed.
- Removed the unused `BrandSplit`, `BrandLogoStrip` and `TapDeck` components. The current moodboard and looping campaigns remain in place.
- Removed hidden experience dates and duplicate company data; experience uses the existing jobs list throughout.
- Removed unused logo-domain entries, unused imports/local variables, and the generic image-placeholder string. Images now require an explicit source; About's image data is required by its type.
- Removed unused compact-calendar branches and retired week/year styles while retaining the live log header, month calendar, list, hover titles, loading and error states.
- Standardized component/data/JSON filenames and renamed 24 active bundled image assets with descriptive names. Image contents and public URLs are preserved.
- Renamed the misleading `font-body-serif` class to `font-body-light`, keeping its original font and weight.
- Enabled TypeScript's unused-local and unused-parameter checks and added `typecheck` and combined `test` scripts.

## Design consistency fixes

- Moodboard descriptions now use the shared 16px body size; platform labels, counters, captions and category badges remain smaller supporting text.
- Raised low-contrast note indexes, case navigation/captions and supporting text to the existing 60% dark-text treatment. Decorative borders and the explicitly requested muted mode label are unchanged.
- Standardized shared back controls and calendar/list controls to 44px height; mobile previous/next-month controls now also have 44px width.
- Removed the duplicate mobile case-detail back link. Case details now use the same slim back/home navigation pattern as experience details.
- Retained mode colors, lowercase copy, heading hierarchy, image grids, reduced-motion behavior, shared scrollbar treatments and desktop camera animation.

## Verification

- Production build and strict TypeScript checks pass.
- All 10 existing routing and consumption tests pass, covering legacy links, SPA fallbacks, date-only arithmetic, filtering and pagination.
- Before/after browser sweep: 26 route/viewport combinations; no page-level horizontal overflow or uncaught JavaScript errors.
- All statically referenced local public assets exist. Bundled image renames resolve during the production build.
- Browser interaction checks passed for back/forward navigation, shared mobile back controls, image expansion/Escape, desktop gallery opening and all 21 freelance samples.
- The live consumption log loaded on both device sizes; populated dates opened the list without moving the document, and toolbar targets met 44px minimums.
- Representative screenshots were inspected for mobile case-detail navigation, desktop home layout and the consumption toolbar.

## Remaining considerations

- Public asset names are intentionally stable, including user-uploaded artwork. Older source artwork is retained rather than deleting potentially useful originals.
- Some logos, campaign images, fonts and gallery content depend on external hosts. Their availability and rendering can vary with network access; local builds do not prove every third-party asset is available in production.
- The stylesheet contains historical responsive overrides. This pass removes verified dead feature styles, but does not flatten the whole cascade, which would risk changing previously approved layouts.
- Database-level publication enforcement still requires owner verification of the migration documented in `consumption-log.md`. This audit does not claim that the pending RLS migration has been applied.
- Vercel production behavior, preview caches and search-engine metadata refresh require checks after deployment. Existing routes and metadata were not changed in this pass.
