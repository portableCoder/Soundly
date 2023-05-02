import React, { useState } from 'react'
import useAppStore from 'renderer/hooks/useStore'
import './align.css'
import { useAutoAnimate } from '@formkit/auto-animate/react'
const SongInfo = () => {
  const {playlist,idx} = useAppStore((el)=>({playlist:el.playlist,idx:el.songIdx}))

  if (!playlist){
    return <div>
      No song/Playlist currently playing
    </div>
  }
  const isSong = playlist.name === '' && playlist.songs.length == 1
  const songs = playlist.songs
  const [rf,_] = useAutoAnimate()
  return (
    <div className='min-h-screen'>
        {          songs.length > 0  &&

        <div className='h-1/4 w-full relative bg-transparent'>
          <img className='h-full object-fill absolute z-0 top-0 left-0 w-full blur-2xl' src={songs[idx].background_img}/>

          <div ref={rf} className='flex flex-row gap-x-2 z-10 bg-transparent '>
          <img src={songs[idx].background_img} className='w-64 h-64 object-cover z-50'/>
          <div className='flex flex-col gap-y-2 my-6'>
            <div className='text-xl'>
              Currently playing
            </div>
            <div>

              {songs[idx].title}
            </div>
            <div className='text-md'>
              {songs[idx].info}
            </div>
          </div>
          </div>
        </div>}
      <table className='w-full h-full my-12 table-auto 	'>
          <thead>
    <tr>
      <th>Song</th>
      <th>Artist/Channel</th>
    </tr>
  </thead>
  {songs.map((el)=><tr className='text-left'>
    <td>{el.title}</td>
    <td>{el.info}</td>
  </tr>)}
      </table>

    </div>
  )
}

export default SongInfo
