import { describe, expect, it } from 'vitest';
import { games, randomGame } from './catalog';
describe('arcade catalog', () => {
  it('has ten uniquely addressable games with valid metadata', () => {
    expect(games).toHaveLength(10);
    expect(new Set(games.map(game => game.id)).size).toBe(games.length);
    for (const game of games) {
      expect(game.id).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
      expect(game.minutes).toBeGreaterThan(0);
      expect(game.instructions.length).toBeGreaterThan(10);
    }
  });
  it('never selects the game being excluded', () => {
    for (const game of games) {
      for (let i = 0; i < 30; i++) expect(randomGame(game.id).id).not.toBe(game.id);
    }
  });
});
