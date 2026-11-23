import { useEffect, useRef, useState } from 'react';
import type { Props } from '../catalog';

const symbols = ['★', '✿', '☀', '♥', '◆', '☁', '☂', '♫'];
type Card = { value: string; id: number };
function makeDeck(): Card[] {
  const cards = [...symbols, ...symbols].map((value, id) => ({ value, id }));
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
export default function SignalMatch({ onScore, paused }: Props) {
  const [cards] = useState(makeDeck);
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mismatchRemaining = useRef(700);
  const mismatchStarted = useRef(0);
  useEffect(() => {
    if (!locked) return;
    if (paused) {
      if (timeout.current) clearTimeout(timeout.current);
      mismatchRemaining.current = Math.max(0, mismatchRemaining.current - (Date.now() - mismatchStarted.current));
      return;
    }
    mismatchStarted.current = Date.now();
    timeout.current = setTimeout(() => { setOpen([]); setLocked(false); }, mismatchRemaining.current);
    return () => { if (timeout.current) clearTimeout(timeout.current); };
  }, [paused, locked]);
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current); }, []);
  function flip(index: number) {
    if (paused || locked || open.includes(index) || matched.includes(index) || matched.length === cards.length) return;
    if (open.length === 0) { setOpen([index]); return; }
    const first = open[0];
    const nextMoves = moves + 1;
    setMoves(nextMoves);
    if (cards[first].value === cards[index].value) {
      const nextMatched = [...matched, first, index];
      setMatched(nextMatched);
      setOpen([]);
      if (nextMatched.length === cards.length) onScore(Math.max(10, 200 - nextMoves * 10));
    } else {
      setOpen([first, index]);
      setLocked(true);
      mismatchRemaining.current = 700;
    }
  }
  return <div className="memory">
    <div className="stats"><span>MOVES: {moves}</span><span>PAIRS: {matched.length / 2}/8</span></div>
    <div className="memory-grid">{cards.map((card, index) => {
      const visible = open.includes(index) || matched.includes(index);
      return <button key={card.id} type="button" disabled={locked || matched.includes(index)} onClick={() => flip(index)}
        className={matched.includes(index) ? 'matched' : open.includes(index) ? 'flipped' : ''}
        aria-label={visible ? 'Revealed ' + card.value : 'Hidden card ' + (index + 1)}
        aria-pressed={visible}>{visible ? card.value : '?'}</button>;
    })}</div>
    <p className="hint" role="status" aria-live="polite">{matched.length === 16 ? '★ ALL PAIRS FOUND! SCORE: ' + Math.max(10, 200 - moves * 10) : 'MATCH ALL PAIRS · FEWER MOVES = HIGHER SCORE'}</p>
  </div>;
}
