# P4SSTIM3 — The Internet Time Killer Arcade

**Got a minute? Play something.** A free, no-sign-up browser arcade with five original playable games.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
npm run build
```

## Games

| Game | Category | Controls |
|---|---|---|
| Neon Dodger | Arcade | Arrow keys, A/D, or touch |
| Signal Match | Puzzle | Click or tap cards |
| Pixel Dash | Runner | Space, Up, or touch |
| Code Breaker | Logic | Three distinct digits |
| Chaos Button | Experimental | Click or tap when green |

## Architecture

- React 19 + TypeScript + Vite.
- Data-driven registry in `src/catalog.ts` with lazy-loaded game modules in `src/games/`.
- Guest-first, no authentication required.
- Local favorites and personal high scores stored in versioned browser storage keys.
- Homepage, catalog with search/category/duration/sorting, game pages, random discovery, fullscreen and restart.
- Responsive dark visual system with original shapes and no third-party game assets.

## Limitations / next steps

The MVP has no backend, real user ratings, global leaderboards or multiplayer. All games are local browser experiences. Scores are not verified server-side. Next: add automated gameplay tests, keyboard accessibility polish, optional accounts and secure leaderboard infrastructure.

## Deployment

Static build output: `dist/`. SPA rewrite in `vercel.json`. Avoid excessive automatic previews; CI runs on pull requests and manual dispatch only.
