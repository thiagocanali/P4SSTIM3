export type MemoryCard = { value: string; id: number };
export const symbols = ['★', '✿', '☀', '♥', '◆', '☁', '☂', '♫'] as const;
export function makeDeck(random: () => number = Math.random): MemoryCard[] {
  const cards = [...symbols, ...symbols].map((value, id) => ({ value, id }));
  for (let i = cards.length - 1; i > 0; i--) {
    const value = random();
    const j = Math.max(0, Math.min(i, Math.floor(value * (i + 1))));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
export function memoryScore(moves: number): number {
  return Math.max(10, 200 - moves * 10);
}
