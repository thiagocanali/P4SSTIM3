import { beforeEach, describe, expect, it, vi } from 'vitest';
import { normalizeHistory, readHistory, recordHistory } from './history';

describe('local game history', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => { storage.set(key, value); },
    });
  });
  it('returns an empty history when storage is empty', () => {
    expect(readHistory()).toEqual([]);
  });
  it('saves sessions newest first', () => {
    recordHistory('neon-dodger', 42, '2026-11-23T12:00:00.000Z');
    recordHistory('pixel-dash', 67, '2026-11-23T13:00:00.000Z');
    expect(readHistory().map(h => h.gameId)).toEqual(['pixel-dash', 'neon-dodger']);
  });
  it('discards malformed records and limits history length', () => {
    expect(normalizeHistory([null, {}, { gameId: 'x', score: -1, playedAt: 'bad' }])).toEqual([]);
    for (let i = 0; i < 60; i++) recordHistory('signal-match', i, '2026-11-23T13:00:00.000Z');
    expect(readHistory()).toHaveLength(50);
  });
  it('continues even if storage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
    });
    expect(recordHistory('code-breaker', 100)).toHaveLength(1);
  });
});
