import React, { useEffect, useRef, useState } from 'react'
interface SliderProps{
  max?:number,
  onChange?:(pct:number)=>void
  current?:number
  children?:JSX.Element
}
const Slider = ({current,max,onChange,children}:SliderProps) => {
  const mouseState = useRef<0|1>(0)
  const [pct,setPct] = useState(0)
  useEffect(()=>{
    if(current && max){
      setPct((current/max) * 100)
    }
  },[current])
  useEffect(()=>{
    const dHandler = (e:MouseEvent)=>{
      mouseState.current = 1
    }
    document.addEventListener('mousedown',dHandler)
    const uHandler = (e:MouseEvent)=>{
      mouseState.current = 0
    }
    document.addEventListener('mouseup',uHandler)
    return ()=>{
      document.removeEventListener('mousedown',dHandler)
      document.removeEventListener('mouseup',uHandler)
    }
  })
const dragFn = (evt:any,dragging=false)=>{

      const totalW = evt.currentTarget.offsetWidth
      const currentW = evt.nativeEvent.offsetX
      const changedPct = (currentW/totalW)*100
      if(onChange && max){
      const dg = (max*changedPct)/100
        if(dragging && !dg){
          return
        }

        setPct(changedPct)
        onChange(dg)
      }

    }
  return (
    <button   onClick={dragFn} onMouseMove={(e)=>{
        if(mouseState.current === 0){
          return
        }
        dragFn(e,true)

    }} className='relative rounded-lg w-full h-2 bg-zinc-700'>
      <div style={{
        width:`${pct}%`
      }} className='bg-gradient-to-r flex items-center justify-end  h-2 rounded-lg absolute top-0 left-0 from-indigo-500 to-violet-500'>
      </div>

    </button>
  )
}

export default Slider
