import usePersistantTimer from "./ptimer";
function App() {
  const [count,start,pause,reset] = usePersistantTimer(false,{updateFrequency:1})
  const countdown = (value:number,count:number):number=>{
    count = count / 1000
    if(count < value) return Math.round(value - count)
    else
    return 0 
  }
  return(
  <div>
    Time is flying: {count} ms
    <button onClick = {start}>start</button>
    <button onClick = {pause}>pause</button>
    <button onClick = {reset}>reset</button>
    <div>count down: {countdown(100,count)}s</div>
  </div>)
}

export default App;
