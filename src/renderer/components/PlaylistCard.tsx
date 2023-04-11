import getRandomBg from '@/util/random_grad'
import React from 'react'
import { IoMdPlay } from 'react-icons/io'
import useAppStore from 'renderer/hooks/useStore'
import { Playlist } from 'renderer/types/Playlist'

const PlaylistCard = (playlist:Playlist) => {
  const startPlaying = useAppStore((el)=>el.startPlaying)
  return (
    <div className={`relative rounded-md w-full flex flex-row justify-between items-center`}>
      <div className={`flex flex-row gap-x-3 items-center`}>
      <div className={`w-32 h-32  rounded-md top-0 left-0 ${getRandomBg()}`}>
        <img src={playlist.background_img} className='w-full h-full rounded-md object-cover opacity-50'/>
      </div>
      <div className='z-0 bg-transparent'>
      <div>{playlist.name}</div>
      <div>{playlist.songs.length} Songs</div>
      <div className='flex flex-row gap-x-2'>
        {playlist.songs.slice(0,4).map((el)=><div>
          <img className='w-8 h-8 rounded-md' src={el.background_img}/>
        </div>)}
      </div>
      </div>
      <div>
      <div>
      </div>

      </div>

      </div>
        <button onClick={()=>{
          startPlaying(playlist)
        }} className='btn btn-outline btn-sm btn-circle border-2'>
          <IoMdPlay/>
        </button>
    </div>
  )
}

export default PlaylistCard
