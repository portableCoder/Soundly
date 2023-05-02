import getRandomBg from '@/util/random_grad'
import React, { useRef, useState } from 'react'
import { IoMdPlay, IoMdTrash } from 'react-icons/io'
import useLocalStore from 'renderer/hooks/useLocalStore'
import useAppStore from 'renderer/hooks/useStore'
import { Playlist } from 'renderer/types/Playlist'
import { Song } from 'renderer/types/Song'
function isPlaylist(playlistSong:Playlist | Song): playlistSong is Playlist {
  return (playlistSong as Playlist).songs !== undefined;
}
const PlaylistCard = (playlistSong:(Playlist | Song)) => {
  const startPlaying = useAppStore((el)=>el.startPlaying)
  const isPlay = isPlaylist(playlistSong)

  const ref = useRef(()=>{
    if(isPlay){
    let pl = playlistSong.songs.slice(0,4)
    pl.pop()
    return pl.map((el)=>el.title).join(', ') + ' and more'
    }else{
      return ''
    }
  })
  const bg = useRef(getRandomBg())
  const [songs,playlists,setSongs,setPlaylists] = useLocalStore()
  const [hovering,setHovering] = useState(false)
  const idx = playlistSong.id
  return (
    <div onMouseEnter={()=>setHovering(true)} onMouseLeave={()=>setHovering(false)} className={`relative rounded-md w-full flex flex-row justify-between items-center px-8`}>
      <div className={`flex flex-row gap-x-3 items-center`}>
      <div className={`w-32 h-32 shrink-0 rounded-md ${ isPlay && bg.current}`}>
        <img src={playlistSong.background_img} className={`w-32 h-32 rounded-md object-cover ${ isPlay ? "opacity-50" : "opacity-100" }`}/>
      </div>
      <div className=' bg-transparent'>
      <div className='text-lg whitespace-nowrap w-32 truncate ...'>{ isPlay ? playlistSong.name : playlistSong.title}</div>
      {isPlay && <div>{playlistSong.songs.length} Songs</div>}

      {<div className='gap-x-2 text-sm text-gray-500 '>
        {isPlay ? ref.current() : playlistSong.info}
      </div>}
      </div>
      <div>
      <div>
      </div>

      </div>

      </div>
      <div className='flex flex-col gap-y-2 items-center justify-center'>
        <button onClick={()=>{
        if(isPlay){

          startPlaying(playlistSong)
        }else{
        const onePlaylist : Playlist = {
          id:'',
           name:'',
           background_img:playlistSong.background_img,
           songs:[playlistSong],
           lastPlayed:new Date().getTime()
        }

          startPlaying(onePlaylist)
      }

        }} className='btn btn-outline btn-sm btn-circle border-2  items-center justify-center'>
          <IoMdPlay/>
        </button>
        <div className='w-8  h-8'>
      {hovering && <button onClick={()=>{
        if(isPlay){
        setPlaylists(playlists.filter((el,idy)=>playlistSong.id!==el.id))

        }else{
        let song = playlistSong
        setSongs(songs.filter((el,idy)=>el.id!== playlistSong.id))
      }
      }} className='btn btn-sm btn-error'><IoMdTrash/></button>}
      </div>
      </div>
    </div>
  )
}

export default PlaylistCard
