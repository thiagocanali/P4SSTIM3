export type Attempt = { guess: string; exact: number; misplaced: number };

export function makeCode(random: () => number = Math.random): string {
  const digits = Array.from({ length: 10 }, (_, i) => String(i));
  for (let i = digits.length - 1; i > 0; i--) {
    const n = random();
    const j = Math.min(i, Math.max(0, Math.floor(n * (i + 1))));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }
  return digits.slice(0, 3).join('');
}

export function checkGuess(code: string, guess: string): Attempt {
  if (!/^[0-9]{3}$/.test(code) || new Set(code).size !== 3) throw new Error('Invalid secret');
  if (!/^[0-9]{3}$/.test(guess) || new Set(guess).size !== 3) throw new Error('Guess must contain three unique digits');
  let exact = 0;
  let misplaced = 0;
  for (let i = 0; i < 3; i++) {
    if (guess[i] === code[i]) exact++;
    else if (code.includes(guess[i])) misplaced++;
  }
  return { guess, exact, misplaced };
}

export function codeBreakerScore(attempts: number): number {
  return Math.max(0, (9 - attempts) * 100);
}
