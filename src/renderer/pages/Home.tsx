import Player from '@/components/Player'
import SongPlaylistCard from '@/components/SongPlaylistCard'
import React from 'react'
import { IoMdMusicalNote, IoMdMusicalNotes } from 'react-icons/io'
import useLocalStore from 'renderer/hooks/useLocalStore'
import useAppStore from 'renderer/hooks/useStore'

const Home = () => {
  const [songs, playlists ] = useLocalStore()
  const minimized = useAppStore((el)=>el.playerState.minimized)
  const setMinimized = useAppStore((el)=>el.setMinimized)
  return (
    <div className='text-2xl overflow-x-hidden'>
      <div>Home</div>
      { (songs.length > 0 || playlists.length > 0) && <div className='w-full h-full flex gap-x-2'>
      <div>

      <div className='flex flex-col  gap-y-5'>
      <div className='text-xl my-6'>

       Recently played songs
      </div>
        {songs.slice(0,4).map((el,i)=>{
          return <SongPlaylistCard {...el}  key={i}/>
        })}
        {songs.length === 0 && <div> No songs available </div>}
      </div>
      </div>
      <div>

<div className='flex flex-col  gap-y-5'>
       <div className='text-xl my-6'>

       Recently played playlists

      </div>
        {playlists.map((el,i)=>{
          return <SongPlaylistCard  {...el} key={i}></SongPlaylistCard>
        })}

        {playlists.length === 0 && <div> No playlists available </div>}
      </div>

      </div>
      </div>}
      {songs.length == 0 && playlists.length ==  0 && <div className='w-full text-xl text-gray-500 h-full absolute top-0 left-0 flex items-center justify-center'>
          {'No songs available, press + to add songs'}
      </div>}

          <div className='fixed bottom-10 right-10'>
                {minimized && <button onClick={()=>setMinimized(false)} className='btn btn-outline btn-circle'>
                    <IoMdMusicalNotes/>
                </button>}
          </div>

    </div>

  )
}

export default Home
