# Rutuja Rochkari's portfolio

React, TypeScript and Vite portfolio with Growth and Brand modes. Public content is edited in source files and the existing Supabase project.

## Development and checks

```sh
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

`npm run preview` serves the production build locally. `typecheck` rejects unused imports, locals and parameters. The tests cover routing, legacy links, consumption date handling, publication filtering and pagination.

## File conventions

- React components: `PascalCase.tsx`, such as `PhotoGallery.tsx` and `ContentComponents.tsx`.
- Hooks: `useName.ts`, such as `useMoodboard.ts`.
- Content and utilities: `camelCase.ts`, such as `statePlateCase.ts`, `aboutContent.ts` and `panelScroll.ts`.
- Images, JSON and documentation: descriptive `kebab-case`, such as `growth-portrait.png`, `photo-thumbnails.json` and `consumption-log.md`. Numbered sets use two digits, such as `sample-01.jpg`.
- Framework entry points and configuration keep their conventional names (`main.tsx`, `index.css`, `vite.config.ts`).

Active bundled images live in `src/imports`. Older unreferenced artwork is retained there as source material; it is not included in the Vite build. Existing files in `public` retain their URLs, because externally managed content and shared links can refer to them. Update all references when renaming an asset; don't rename public uploads just for stylistic consistency.

## Content map

- `src/App.tsx`: portfolio shell, homepage, experience and case-study rendering.
- `src/aboutContent.ts`: About copy and interest photos.
- `src/growthNotes.ts`, `src/brandNotes.ts`: full notes, without unused previews.
- `src/portfolioCases.ts`, `src/wisprCase.ts`, `src/statePlateCase.ts`: case-study copy.
- `src/caseVisuals.ts`: case-study image and caption mappings.
- `src/useMoodboard.ts`, `src/consumption/data.ts`: published content from Supabase.
- `.figma/make/site.json`, `index.html`: metadata; `vite.config.ts` emits the generated head tags.

See [navigation](docs/navigation.md), [consumption data and RLS](docs/consumption-log.md), and the [design and code audit](docs/portfolio-audit.md).
