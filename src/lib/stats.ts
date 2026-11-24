import type { PlayedGame } from './history';

export function summarizeRounds(entries: PlayedGame[]) {
  return { rounds: entries.length, games: new Set(entries.map(e => e.gameId)).size, best: entries.reduce((best, e) => Math.max(best, e.score), 0) };
}

export function recentMilestones(entries: PlayedGame[], gameIds: string[]) {
  const played = new Set(entries.map(e => e.gameId));
  return [
    { name: 'FIRST ROUND', description: 'Complete a round', unlocked: entries.length >= 1 },
    { name: 'ARCADE EXPLORER', description: 'Complete every game', unlocked: gameIds.length > 0 && gameIds.every(id => played.has(id)) },
    { name: 'TEN ROUNDS', description: 'Complete ten rounds', unlocked: entries.length >= 10 },
    { name: 'CODE CRACKER', description: 'Earn points in Code Breaker', unlocked: entries.some(e => e.gameId === 'code-breaker' && e.score > 0) }
  ];
}
