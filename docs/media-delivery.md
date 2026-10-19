# Media delivery

The portfolio serves optimized assets locally to reduce large image transfers and repeated third-party logo requests.

- Active imported photos and screenshots have WebP delivery copies beside their originals in `src/imports`. Original files remain available for future editing.
- `src/media-map.json` maps known gallery and moodboard URLs to optimized files in `public/media`. `mediaSrc` uses the original URL when no local copy exists, so new database uploads still work.
- Gallery thumbnails stay small; the selected-photo viewer and desktop slideshow use the larger optimized copies.
- The About introduction video is served from `public/videos/introduction.mp4`: H.264/AAC, 1280×720, with fast-start metadata before the video payload. Duration/audio are preserved. The existing Liquide clip already has fast-start metadata; it has a lightweight poster now.
- Camera, folder and video-poster artwork use smaller WebP copies. Keep animation artwork and its CSS background reference in sync when changing files.
- Known tool logos are served from `public/tool-logos` via `src/toolLogos.ts`. Clay retains its existing favicon source; other tool logos do not require a third-party request.
- Vercel's SPA fallback excludes `media`, `tool-logos` and `videos`, as well as the existing static folders.

The generated image set is approximately 9.7 MB versus 115 MB for its original sources; the introduction video is approximately 8.8 MB versus 26 MB. These are asset-size comparisons, not a guarantee of a particular connection's load time. Remote images that could not be mirrored keep their existing URL.

## Updating media

Use Pillow with EXIF orientation applied, a maximum 1400px dimension and WebP quality 85 for photo delivery copies. Do not upscale small originals. The camera uses a 720px maximum dimension, the folder 480px, and the video poster 1280px. For new gallery URLs, add a local preview and mapping when desired; do not change the Supabase row to a deployment-specific URL.

For video, preserve the source and produce a web delivery copy with:

```sh
ffmpeg -i original.mp4 -vf 'scale=1280:-2' -c:v libx264 -preset fast -crf 26 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart introduction.mp4
```

## Tool-logo sources

- Simple Icons 16.35.0 (CC0): Meta, Replit, Shopify, Google Analytics, Supabase, Cursor, PostHog, Webflow, Claude, ElevenLabs, Buffer and Notion. Brand colors are applied locally.
- SVGL (`pheralb/svgl`, MIT): Ahrefs and Canva.
- `gilbarbara/logos`: Figma (original multicolor mark), Mailchimp (original Freddie symbol, without the wordmark), and Mention. The supplied wordmark viewBox is cropped to its symbol for legibility in a 24px tool badge.

Logos remain trademarks of their respective owners and identify tools used in the portfolio.
