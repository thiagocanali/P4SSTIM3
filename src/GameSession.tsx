import {useRef} from 'react';
import type {ComponentType} from 'react';
import type {Props} from './catalog';
import {acceptScore} from './lib/session';
export function GameSession({component:Game,restart,paused,onScore}:Props & {component:ComponentType<Props>}) {
 const completed=useRef(false);
 return <Game restart={restart} paused={paused} onScore={score=>{if(!acceptScore(completed.current,score))return;completed.current=true;onScore(score)}}/>;
}
