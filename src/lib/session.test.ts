import {describe,it,expect} from 'vitest';
import {acceptScore} from './session';
describe('session score validation',()=>{
 it('accepts zero and positive integer scores',()=>{expect(acceptScore(false,0)).toBe(true);expect(acceptScore(false,100)).toBe(true)});
 it('rejects duplicate completions',()=>{expect(acceptScore(true,100)).toBe(false)});
 it('rejects invalid scores',()=>{for(const score of [-1,NaN,Infinity,1.5,Number.MAX_SAFE_INTEGER+1])expect(acceptScore(false,score)).toBe(false)});
});
