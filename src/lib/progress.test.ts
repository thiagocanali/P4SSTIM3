import { expect, it } from 'vitest';
import { advanceProgress, achievements, fromHistory } from './progress';
it('retains early achievements beyond the recent history limit', () => {
  let p = fromHistory([{gameId:'code-breaker',score:800,playedAt:'2026-01-01'}]);
  for(let i=0;i<60;i++) p=advanceProgress(p,'pixel-dash',10);
  expect(p.rounds).toBe(61);
  expect(achievements(p,['code-breaker','pixel-dash']).every(a=>a.unlocked)).toBe(true);
});
it('does not award code cracker for a defeat', () => {
  expect(advanceProgress(fromHistory([]),'code-breaker',0).cracked).toBe(false);
});

it('keeps explorer unlocked as the catalog expands',()=>{const ids=['a','b','c','d','e'];let p=fromHistory([]);for(const id of ids)p=advanceProgress(p,id,0);expect(achievements(p,[...ids,'f','g']).find(a=>a.name==='ARCADE EXPLORER')?.unlocked).toBe(true)});
