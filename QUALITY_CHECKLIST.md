# Production readiness — P4SSTIM3

This checklist is a living audit. **Implemented** is not the same as **verified**.

## Platform
- [x] Homepage with original visual identity and playable entry points
- [x] Game catalog, search, genres, duration filter and sort
- [x] Random discovery, featured collection and related games
- [x] Guest favorites persisted in localStorage
- [x] Validate navigation and filters with browser automation on desktop and mobile emulation (CI run 45272799533)

## Gameplay
- [x] Five distinct game modules available through lazy loading
- [x] Restart and fullscreen controls
- [x] Record display and persistence in localStorage
- [x] Code Breaker rules extracted for automated tests
- [ ] Test start, pause, win and loss states across all applicable games (pause/resume smoke-tested; win/loss coverage pending)
- [ ] Verify touch/keyboard behavior on actual mobile and desktop browsers (mobile emulation smoke tests added)
- [ ] Validate score submission, including duplicate or interrupted games (Code Breaker win/loss verified in CI 45300159087; completion tests for all five games passed in CI 45311590918)

## Gamification
- [x] Local favorites and personal bests
- [x] Completed game history persisted with timestamps
- [x] Permanent local achievements backed by game events (CI 45370443021)
- [ ] Future backend: authentication, verified score submissions, opt-in public leaderboards

## Quality and infrastructure
- [x] TypeScript build script
- [x] Vitest test suite configured for Code Breaker rules
- [x] GitHub Actions workflow on push to main
- [x] Verify the GitHub Actions job completed successfully (run 45268990704)
- [x] Add ESLint and enforce it in CI (run 45272799533)
- [ ] Expand unit/gameplay/e2e tests to all five games (catalog and memory rules now covered)
- [ ] Verify no JS runtime errors, broken routes or inaccessible controls (five-game browser smoke tests passed; full audit pending)
- [ ] Run accessibility and responsive-layout checks
- [ ] Audit security headers and external dependencies
- [x] Offline navigation and all five game modules verified on desktop/mobile emulation (CI 45371689608)
- [ ] Verify installation on physical devices and cache updates across releases
- [ ] Verify deployed production site and release smoke tests (Vercel READY for 8bf480c; browser tests run against local preview)

## Release gates
- [x] Automated checks pass on commit 1bf5f7c (unit, lint, build, Playwright desktop/mobile emulation)
- [x] Production deployment state READY for commit 1bf5f7c (not a complete release gate)
- [ ] All five games manually or automatically verified on desktop and mobile
- [ ] No critical defects or simulated features passed off as complete

## Working rules

Commit straight to main only as approved. Keep commits scoped; do not bypass checks. Avoid manual Vercel deploys. A Vercel READY build alone does **not** establish gameplay correctness.

## Audit baseline — 2026-11-26
- [x] Eleven registered games; route, pause/restart and offline smoke tests passed on commit e26a66e (CI 45748267168: 21 unit and 26 browser tests).
- [ ] Validate the new first-click mine protection, pause-aware reaction timing and Color Rush countdown under repeated input.
- [ ] Verify category deduplication and updated homepage count in CI.

- [ ] Session completion guard and integer score validation implemented; unit and browser regression tests added, CI pending.
