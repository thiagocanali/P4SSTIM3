import { describe, expect, it } from 'vitest';
import { summarizeRounds, recentMilestones } from './stats';
const round = (gameId: string, score: number) => ({ gameId, score, playedAt: '2026-01-01T00:00:00Z' });
describe('recent round statistics', () => {
  it('handles empty history', () => expect(summarizeRounds([])).toEqual({ rounds: 0, games: 0, best: 0 }));
  it('counts completed rounds including defeats', () => expect(summarizeRounds([round('code-breaker', 0), round('code-breaker', 800), round('pixel-dash', 20)])).toEqual({ rounds: 3, games: 2, best: 800 }));
  it('requires actual completion and a positive Code Breaker score', () => {
    expect(recentMilestones([round('code-breaker', 0)], ['code-breaker', 'pixel-dash']).map(m => m.unlocked)).toEqual([true, false, false, false]);
    expect(recentMilestones([round('code-breaker', 800), round('pixel-dash', 20)], ['code-breaker', 'pixel-dash']).map(m => m.unlocked)).toEqual([true, true, false, true]);
  });
});
