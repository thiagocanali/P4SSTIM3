import type { PlayedGame } from './history';
export type Progress = { rounds: number; games: string[]; cracked: boolean };
const key = 'p4:progress';
export function fromHistory(entries: PlayedGame[]): Progress {
  return { rounds: entries.length, games: [...new Set(entries.map(e => e.gameId))], cracked: entries.some(e => e.gameId === 'code-breaker' && e.score > 0) };
}
export function advanceProgress(p: Progress, gameId: string, score: number): Progress {
  return { rounds: p.rounds + 1, games: [...new Set([...p.games, gameId])], cracked: p.cracked || (gameId === 'code-breaker' && score > 0) };
}
export function readProgress(entries: PlayedGame[]): Progress {
  const fallback = fromHistory(entries);
  try {
    const p = JSON.parse(localStorage.getItem(key) ?? 'null');
    if (p && Number.isSafeInteger(p.rounds) && p.rounds >= 0 && Array.isArray(p.games) && p.games.every((g: unknown) => typeof g === 'string') && typeof p.cracked === 'boolean') return { rounds: Math.max(p.rounds, fallback.rounds), games: [...new Set<string>([...p.games, ...fallback.games])], cracked: p.cracked || fallback.cracked };
  } catch { /* Storage may be unavailable. */ }
  return fallback;
}
export function saveProgress(p: Progress) {
  try { localStorage.setItem(key, JSON.stringify(p)); } catch { /* Storage may be unavailable. */ }
}
export function achievements(p: Progress, gameIds: string[]) {
  return [
    { name: 'FIRST ROUND', description: 'Complete a round', unlocked: p.rounds >= 1 },
    { name: 'ARCADE EXPLORER', description: 'Complete every game', unlocked: gameIds.length > 0 && gameIds.every(id => p.games.includes(id)) },
    { name: 'TEN ROUNDS', description: 'Complete ten rounds', unlocked: p.rounds >= 10 },
    { name: 'CODE CRACKER', description: 'Earn points in Code Breaker', unlocked: p.cracked }
  ];
}
