import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Props } from '../catalog';
import { checkGuess, codeBreakerScore, makeCode } from '../lib/codeBreaker';
import type { Attempt } from '../lib/codeBreaker';

export default function CodeBreaker({ onScore }: Props) {
  const [code] = useState(makeCode);
  const [guess, setGuess] = useState('');
  const [history, setHistory] = useState<Attempt[]>([]);
  const [error, setError] = useState('');
  const won = history.some(h => h.exact === 3);
  const lost = history.length >= 8 && !won;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (won || lost) return;
    if (!/^[0-9]{3}$/.test(guess) || new Set(guess).size !== 3) {
      setError('Enter three different digits to submit.');
      return;
    }
    if (history.some(h => h.guess === guess)) {
      setError('You have already tried that code.');
      return;
    }
    const attempt = checkGuess(code, guess);
    const next = [...history, attempt];
    setHistory(next);
    setGuess('');
    setError('');
    if (attempt.exact === 3) onScore(codeBreakerScore(next.length));
  }
  return <div className="logic">
    <small>THE SECRET CODE</small>
    <div className="secret" aria-label={won ? 'Secret code ' + code : 'Secret code hidden'}>{won ? code : '? ? ?'}</div>
    <p>3 UNIQUE DIGITS / 8 ATTEMPTS</p>
    <form onSubmit={submit}>
      <input aria-label="Three digit code" inputMode="numeric" autoComplete="off" placeholder="123" maxLength={3} value={guess} disabled={won || lost} onChange={event => { setGuess(event.target.value.replace(/\D/g, '').slice(0, 3)); setError(''); }}/>
      <button disabled={won || lost || guess.length !== 3 || new Set(guess).size !== 3}>GUESS ↗</button>
    </form>
    {error && <p className="hint" role="alert">{error}</p>}
    <p className="hint">● GREEN = EXACT POSITION · 🟠 = CORRECT DIGIT, WRONG POSITION</p>
    <div className="attempts">{history.map((attempt, index) => <div key={index}><span>#{index + 1}</span><b>{attempt.guess}</b><span className="lime">● {attempt.exact} EXACT</span><span>🟠 {attempt.misplaced} MISPLACED</span></div>)}</div>
    {won && <h3 className="lime" role="status">CODE CRACKED! +{codeBreakerScore(history.length)} POINTS</h3>}
    {lost && <h3 role="status">OUT OF ATTEMPTS! CODE: {code}</h3>}
  </div>;
}
