# P4SSTIM3 — The Internet Time Killer Arcade

**Got a minute? Play something.** An original, free browser arcade built with React, TypeScript and Vite. Production: https://p4sstim3.vercel.app/

## Getting started

Node.js 22 or newer recommended.

```bash
npm install
npm run dev
npm run test
npm run build
```

## Games

| Game | Genre | How to play |
| --- | --- | --- |
| Neon Dodger | Arcade | Dodge falling blocks with A/D, arrows or touch controls |
| Signal Match | Puzzle | Match eight pairs in as few moves as possible |
| Pixel Dash | Runner | Jump with Space, Up or tap |
| Code Breaker | Logic | Guess the three different digits within eight tries |
| Chaos Button | Experimental | Press when green, stop when red |

| Neon Snake | Arcade | Collect food and avoid collisions |
| Cyber Tac Toe | Logic | Play against the computer |
| Reflex Arena | Arcade | React to ten signals |
| Mine Protocol | Puzzle | Reveal safe cells |
| Color Rush | Arcade | Match the ink color |
| Fusion 2048 | Puzzle | Merge equal tiles |

## Technical architecture

- `src/catalog.ts` is the lazy-loaded registry of the eleven games.
- `src/games/` holds individual React game implementations.
- `src/lib/` holds game logic designed to be unit-testable.
- Guest favorites, high scores and a 50-session history are stored locally in browser storage. The history is available at `/history`. There is no account system or server-side leaderboard.
- `public/manifest.webmanifest` adds install metadata; a build-generated service worker precaches game bundles. Offline navigation is tested in Chromium desktop and mobile emulation.
- `npm run test` runs Vitest; `npm run build` runs TypeScript validation and the Vite production build.
- CI runs on pushes to `main`, pull requests and manual dispatch. Vercel handles Git-connected production deployments.

## Roadmap and quality gates

See [QUALITY_CHECKLIST.md](QUALITY_CHECKLIST.md). The current hosted MVP is **not yet certified production-ready** until automated CI, cross-browser/mobile gameplay and deployment smoke testing are verified.

## Deployment

Vercel builds `dist/` with a SPA fallback from `vercel.json`. There are no manual deployment steps for normal pushes to the default branch.
