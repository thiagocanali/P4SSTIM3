export function acceptScore(completed:boolean,score:number):boolean {
 return !completed && Number.isSafeInteger(score) && score>=0;
}
