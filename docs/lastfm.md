# Recent listens

The Brand “What I’m up to” page reads album art from `/api/lastfm/recent-tracks`. Click **listentome** to start the trail, move the pointer to leave covers, and click a cover to flip and keep it visible. Double-click, Escape, or **stop** ends the trail. **next cover** also works on touch screens and with a keyboard.

For local development, copy `.env.example` to `.env.local`, set `LASTFM_API_KEY`, and restart `npm run dev`. `LASTFM_USERNAME` defaults to `rutzonline`. `.env.local` is ignored by Git. Never prefix the key with `VITE_`: it is server-only.

For the hosted site, set the same server environment variables in Vercel and redeploy. Local environment values are not uploaded by a Git push. Vercel serves `api/lastfm/recent-tracks.ts`; Vite provides the same endpoint during development. Static-only hosting and `vite preview` do not run the API.

Without a key the icon shows “recent listens, coming soon.” The UI offers retry when Last.fm is unavailable. The endpoint limits the upstream request to eight seconds, removes duplicate covers, and caches successful responses for two minutes on the CDN. It never returns or logs the key.
