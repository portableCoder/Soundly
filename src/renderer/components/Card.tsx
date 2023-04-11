import React from 'react'
import { IoMdPlay } from 'react-icons/io'
import useAppStore from 'renderer/hooks/useStore'
import { Playlist } from 'renderer/types/Playlist'
import { Song } from 'renderer/types/Song'
import getRandomBg from 'renderer/util/random_grad'

const Card = (song:Song) => {
  const startPlaying = useAppStore((prev)=>prev.startPlaying)
  return (
    <div className={`flex rounded-md text-xl w-full  items-center justify-between px-4`}>
      <div className='flex gap-x-3 items-center'>
      <img  src={song.background_img} className={`w-32 h-32 object-cover rounded-md `}/>
      <div className='text-sm'>
      <div className='text-md whitespace-nowrap'>{song.title}</div>
      <div className='text-sm whitespace-nowrap'>{song.info}</div>
      </div>
      </div>
    <div>

      <button onClick={()=>{
        const onePlaylist : Playlist = {
           name:'',
           background_img:song.background_img,
           songs:[song],
           lastPlayed:new Date().getTime()
        }
        startPlaying(onePlaylist)
      }} className='btn btn-sm btn-circle btn-outline mx-4'>
          <IoMdPlay/>
      </button>
    </div>
    </div>
  )
}

export default Card
