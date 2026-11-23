export type PlayedGame = {
  gameId: string;
  score: number;
  playedAt: string;
};

const KEY = 'p4:history';
const MAX_MATCHES = 50;

export function normalizeHistory(input: unknown): PlayedGame[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((entry): entry is PlayedGame => typeof entry === 'object' && entry !== null &&
      typeof entry.gameId === 'string' && entry.gameId.length > 0 &&
      typeof entry.score === 'number' && Number.isFinite(entry.score) && entry.score >= 0 &&
      typeof entry.playedAt === 'string' && !Number.isNaN(Date.parse(entry.playedAt)))
    .slice(0, MAX_MATCHES);
}

export function readHistory(): PlayedGame[] {
  try {
    return normalizeHistory(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
  } catch {
    return [];
  }
}

export function recordHistory(gameId: string, score: number, playedAt = new Date().toISOString()): PlayedGame[] {
  const current = readHistory();
  const next = normalizeHistory([{ gameId, score, playedAt }, ...current]);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Private browsing and disabled storage must not block gameplay.
  }
  return next;
}
