import React, { useEffect, useState } from 'react'
interface SliderProps{
  max?:number,
  onChange?:(pct:number)=>void
  current?:number
}
const Slider = ({current,max,onChange}:SliderProps) => {
  const [pct,setPct] = useState(0)
  useEffect(()=>{
    if(current && max){
      setPct((current/max) * 100)
    }
  },[current])
  return (
    <button onClick={(evt)=>{
      const totalW = evt.currentTarget.offsetWidth
      const currentW = evt.nativeEvent.offsetX
      const changedPct = (currentW/totalW)*100
      setPct(changedPct)
      if(onChange && max){
        onChange((max*changedPct)/100)
      }

    }} className='relative rounded-lg w-full h-2 bg-zinc-700'>
      <div style={{
        width:`${pct}%`
      }} className='bg-gradient-to-r h-2 rounded-lg absolute top-0 left-0 from-indigo-500 to-violet-500'>

      </div>

    </button>
  )
}

export default Slider
