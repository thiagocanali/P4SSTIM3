import { describe, expect, it } from 'vitest';
import { makeDeck, memoryScore, symbols } from './memory';
describe('Signal Match rules', () => {
  it('creates eight unique pairs and sixteen stable card IDs', () => {
    const deck = makeDeck();
    expect(deck).toHaveLength(16);
    expect(new Set(deck.map(c => c.id)).size).toBe(16);
    for (const symbol of symbols) expect(deck.filter(c => c.value === symbol)).toHaveLength(2);
  });
  it('uses supplied randomness deterministically', () => {
    expect(makeDeck(() => 0)).toEqual(makeDeck(() => 0));
  });
  it('rewards fewer turns and has a score floor', () => {
    expect(memoryScore(8)).toBe(120);
    expect(memoryScore(16)).toBe(40);
    expect(memoryScore(30)).toBe(10);
  });
});
