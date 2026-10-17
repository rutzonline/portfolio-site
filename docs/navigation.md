# Portfolio routes

The site uses clean pathname routes, handled by `src/navigation.ts` and the existing Vercel SPA fallback. No routing package or extra navigation UI is required.

| View | Main routes |
| --- | --- |
| Both modes | `/growth` and `/brand` |
| Both modes | `/{mode}/about`, `/{mode}/skills-and-stack`, `/{mode}/notes`, `/{mode}/experience`, `/{mode}/what-im-up-to` |
| Growth cases | `/growth/case-studies/{cursor,revolut,wispr-flow,heyclicky}` |
| Brand moodboard | `/brand/moodboard` |
| Experience details | `/{mode}/experience/{freelance-marketer,the-state-plate,hopstack,liquide}` |
| Note details | `/{mode}/notes/{slugified-note-title}` |
| Photos | `/{mode}/photos` on mobile; `/brand/what-im-up-to/photos` also supports desktop |

Old `/#growth/...` and `/#brand/...` links are replaced with their clean paths, including when a legacy hash is opened while the app is running. Existing `/cursor`, `/wispr`, `/revolut`, `/heyclicky`, `/writing` and `/consumption` shortcuts remain compatible. Query parameters are retained during normalization. Section anchor links remain section anchors.

Navigation updates the History API; Back/Forward subscribes through `useSyncExternalStore`. Detail return buttons go back to their parent history entry where available, or replace a directly opened detail URL with its list. Mode remains explicit in every path. The existing mobile homepage scroll restoration stays in the App shell.

Vercel already rewrites SPA routes to `index.html`. Static asset and API prefixes are excluded; public assets keep their existing absolute URLs and imported images remain under `/assets` after building.

Validation: `npm run test:navigation`, `npx tsc --noEmit`, `npm run build`, plus browser checks for direct entry/reload, all detail pages, legacy links, Back/Forward, gallery routes, and homepage scroll restoration in both modes.
