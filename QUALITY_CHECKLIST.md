# Production readiness — P4SSTIM3

This checklist is a living audit. **Implemented** is not the same as **verified**.

## Platform
- [x] Homepage with original visual identity and playable entry points
- [x] Game catalog, search, genres, duration filter and sort
- [x] Random discovery, featured collection and related games
- [x] Guest favorites persisted in localStorage
- [ ] Validate navigation and filters with browser automation on desktop and mobile (Playwright tests added; awaiting CI)

## Gameplay
- [x] Five distinct game modules available through lazy loading
- [x] Restart and fullscreen controls
- [x] Record display and persistence in localStorage
- [x] Code Breaker rules extracted for automated tests
- [ ] Test start, pause, win and loss states across all applicable games (pause not implemented for canvas games)
- [ ] Verify touch/keyboard behavior on actual mobile and desktop browsers (mobile emulation smoke tests added)
- [ ] Validate score submission, including duplicate or interrupted games

## Gamification
- [x] Local favorites and personal bests
- [x] Completed game history persisted with timestamps
- [ ] Original achievements backed by real game events
- [ ] Future backend: authentication, verified score submissions, opt-in public leaderboards

## Quality and infrastructure
- [x] TypeScript build script
- [x] Vitest test suite configured for Code Breaker rules
- [x] GitHub Actions workflow on push to main
- [x] Verify the GitHub Actions job completed successfully (run 45268990704)
- [x] Add ESLint and enforce it in CI (pending first successful run)
- [ ] Expand unit/gameplay/e2e tests to all five games (catalog and memory rules now covered)
- [ ] Verify no JS runtime errors, broken routes or inaccessible controls
- [ ] Run accessibility and responsive-layout checks
- [ ] Audit security headers and external dependencies
- [ ] Add genuine offline PWA support only after verifying caching and update behavior
- [ ] Verify deployed production site and release smoke tests

## Release gates
- [ ] Automated checks pass on the release commit
- [x] Production deployment state READY for commit 463a69d (not a complete release gate)
- [ ] All five games manually or automatically verified on desktop and mobile
- [ ] No critical defects or simulated features passed off as complete

## Working rules

Commit straight to main only as approved. Keep commits scoped; do not bypass checks. Avoid manual Vercel deploys. A Vercel READY build alone does **not** establish gameplay correctness.
