import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import "@fontsource/poppins"; // Defaults to weight 400.
import Home from './pages/Home';
import { useEffect, useState } from 'react';
import Player from './components/Player';
import SongInfo from './pages/SongInfo';
import useAppStore from './hooks/useStore';
import AddMusic from './pages/AddMusic';
import Menu from '@/components/Menu';
import Favorites from './pages/Favorites';
import SongLibrary from './pages/SongLibrary';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Song } from './types/Song';
import { Playlist } from './types/Playlist';
import LocalStore from './hooks/LocalStore';


export default function App() {
  const Tabs = [<Home />,<AddMusic/>,<SongInfo/>,<SongLibrary/>,<Favorites/>]
  const [curSelected, setCurSelected] = useState(0)
  const [par,_] =  useAutoAnimate()
  const store = window.electron.store
  function getSongs() : Song[] {
      return store.get('songs')  || []
  }
  function setSongs(songs:Song[]){
    setSongsState(songs)
    store.set('songs',songs)
  }
  function getPlaylists():Playlist[]{


      return store.get('playlists')  || []

  }
  function setPlaylists(pl:Playlist[]){
      setPlaylistsState(pl)
      store.set('playlists',pl)
  }
 const [songs,setSongsState] = useState<Song[]>([])
  const [playlists,setPlaylistsState] = useState<Playlist[]>([])
  useEffect(()=>{
    setPlaylists(getPlaylists())
    setSongs(getSongs())
  },[])

  const stopped = useAppStore((prev)=>prev.playerState.stopped)
  return (
    <LocalStore.Provider value={{
      getPlaylists,
      getSongs,
      setPlaylists,
      setSongs,
      songs,
      playlists
    }}>
    <div className='bg-zinc-950 w-screen h-screen text-white flex overflow-x-hidden'>

      <Menu onSelect={((sel)=>{
        setCurSelected(sel)
    })}/>

      <div ref={par} className='relative w-full  h-full overflow-y-scroll p-4'>

        {Tabs[curSelected]}


      </div>

           {!stopped && <Player/>}
    </div>
    </LocalStore.Provider>
   );
}


