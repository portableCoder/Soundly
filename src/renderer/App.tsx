import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { IoMdHeart as Heart, IoMdSearch as Search, IoMdAdd as Add, IoMdHome as HomeIcon, IoMdMusicalNote as NoteIcon, IoMdPlay, IoMdPause } from 'react-icons/io'
import './App.css'
import "@fontsource/poppins"; // Defaults to weight 400.
import Home from './pages/Home';
import { useState } from 'react';
import Player from './components/Player';
import SongInfo from './pages/SongInfo';
import useAppStore from './hooks/useStore';
import AddMusic from './pages/AddMusic';


export default function App() {
  const Tabs = [<Home />,<AddMusic/>,<SongInfo/>]
  const [curSelected, setCurSelected] = useState(0)
  const btncls = 'btn btn-sm border-none btn-circle btn-outline'
  const stopped = useAppStore((prev)=>prev.playerState.stopped)
  return (
    <div className='bg-zinc-950 w-screen h-screen text-white flex overflow-x-hidden'>

      <div className='flex flex-col items-center py-8   gap-y-5 w-16 border-r border-gray-800 h-full bg-zinc-900'>
        <div className='tooltip' data-tip='Home'>
          <button onClick={() => {
            setCurSelected(0)
          }} className={btncls}>
            <HomeIcon />
          </button>
        </div>
        <div>
        <button onClick={()=>{
          setCurSelected(1)
        }} className={btncls}>
          <Add />
        </button>
        </div>
        <div>
        <button className={btncls}>
          <Search />
        </button>
        </div>
        <button className={btncls}>
          <Heart />
        </button>

        <div className='tooltip text-sm' data-tip='Song Info'>
        <button onClick={()=>{
            setCurSelected(2)
        }} className={btncls}>
          <NoteIcon />

        </button>
        </div>
           {!stopped &&<Player/>}
      </div>
      <div className='relative w-full  h-full overflow-y-scroll p-4'>
        {Tabs[curSelected]}


      </div>
    </div>
  );
}


