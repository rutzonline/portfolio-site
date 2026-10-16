# Consumption Log

The public read-only log is embedded directly below the existing rows in Growth → What I’m up to (`/#growth/what-im-up-to`). Calendar and List stay in that page’s scrolling panel, with the desktop image/contact sidebar visible. Old `/consumption` bookmarks (including the trailing slash) resolve to the Vite entry point and are replaced with the Growth page URL; there is no separate log page. Existing API endpoints stay unchanged.

## Existing database and pending migration

The feature uses the site's existing Supabase project and public anon key in `src/lib/supabase.ts`. It does not create a table, seed sample data, or use service-role credentials. Only GET requests are made. The UI explicitly requests `published=is.true` and rejects any false/NULL published rows again before rendering.

Live inspection on 2026-10-15 found these fields: `id`, `created_at`, `consumed_on`, `title`, `url`, `category`, `platform`, `published`. There were 11 explicitly published entries. The live table lacks `sort_order`. An unfiltered anonymous read also returned two `published=NULL` rows, so current live access rules do **not** satisfy the required published-only restriction.

**Database-owner action remains pending, per the user's instruction:** run `supabase/migrations/20261015000000_consumption_public_read.sql` in the existing project's SQL editor. It adds `sort_order` with default 0, enables RLS, adds a restrictive published-only SELECT policy, grants public SELECT, and revokes public write privileges. It does not replace, delete, or republish entries. Supabase Dashboard administration continues to work. The migration includes queries to inspect the resulting RLS configuration.

After applying it, verify anonymous unfiltered reads return only `published=true`; queries for false or NULL should return no rows. Verify the restrictive SELECT policy is present and RLS enabled. Change a published entry's `sort_order` in Supabase to verify ordering among entries on the same date. No database-owner credential is available in this workspace, so the migration has **not** been run here.

Until then, the UI supports the existing schema by assigning missing sort orders 0 and using ID as a stable tie-breaker. This compatibility path does not provide database-level enforcement. Do not describe RLS setup as complete until the SQL is applied and verified.

## Behavior

Calendar starts at the visitor's current month, with previous/next month and Today controls. Calendar weeks start Sunday, matching the original implementation. A populated date opens List and focuses/scrolls its group. List includes every published entry, newest dates first, then ascending `sort_order` and ID. API pagination handles server-imposed page caps and requests an exact count so entries beyond the first page are included.

Dates remain `YYYY-MM-DD` civil dates; timezone-independent arithmetic and formatting never interpret them as local timestamps. Today uses the visitor's local day. Titles and category badges come from Supabase; platform values remain in the data but are not displayed; valid HTTP(S) links open in a new tab. Invalid URLs retain their title with a “link unavailable” note. No fallback/sample entries, search, filters, or admin interface are included.

Loading and retry states are explicit; requests abort on navigation and time out after 20 seconds. Reduced-motion preferences disable smooth list scrolling. Calendar dates have descriptive accessible names and category text in addition to colored top-edge lines.

## Validation

- `npm run test:consumption`: date boundaries/leap years/DST/timezones, strict published filtering, within-day sorting, safe links, multi-page fetching, legacy schema, error propagation.
- `npx tsc --noEmit`
- `npm run build`
- Live browser checks passed at 1440px, 390px and 320px in Asia/Kolkata, America/Los_Angeles and Pacific/Kiritimati: Growth entry point, direct route/refresh, calendar controls, date-to-list keyboard focus/scroll, complete published list and external links.
- Empty/error responses were simulated in browser tests only; retry recovered to real Supabase data.
