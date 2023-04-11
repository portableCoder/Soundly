export default function(time:number){
  const minutes = Math.floor(time / 60);
const seconds = time - minutes * 60;
  return {
    minutes:minutes.toFixed(0).padStart(2,'0'),
  seconds:seconds.toFixed(0).padStart(2,'0')
}
}
