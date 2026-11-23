import { describe, expect, it } from 'vitest';
import { checkGuess, codeBreakerScore, makeCode } from './codeBreaker';

describe('Code Breaker rules', () => {
  it('generates a three-digit code with no repeated digits', () => {
    for (let i = 0; i < 100; i++) {
      const code = makeCode();
      expect(code).toMatch(/^[0-9]{3}$/);
      expect(new Set(code).size).toBe(3);
    }
  });
  it('counts exact and misplaced digits without double counting', () => {
    expect(checkGuess('123', '123')).toEqual({ guess: '123', exact: 3, misplaced: 0 });
    expect(checkGuess('123', '321')).toEqual({ guess: '321', exact: 1, misplaced: 2 });
    expect(checkGuess('123', '456')).toEqual({ guess: '456', exact: 0, misplaced: 0 });
    expect(checkGuess('012', '102')).toEqual({ guess: '102', exact: 1, misplaced: 2 });
  });
  it('rejects invalid guesses', () => {
    expect(() => checkGuess('123', '112')).toThrow();
    expect(() => checkGuess('123', '12')).toThrow();
  });
  it('awards more points for fewer attempts', () => {
    expect(codeBreakerScore(1)).toBe(800);
    expect(codeBreakerScore(8)).toBe(100);
    expect(codeBreakerScore(9)).toBe(0);
  });
});
