import React, { useEffect, useState } from 'react'
import Slider from '@/components/Slider';
import getIdFromLink from '@/util/getIdFromLink';
import secToMinutes from '@/util/secToMinutes';

import { IoMdHeart as Heart, IoMdSearch as Search, IoMdAdd as Add, IoMdHome as HomeIcon, IoMdMusicalNote as NoteIcon, IoMdPlay, IoMdPause, IoMdArrowDropright, IoMdArrowDropleft, IoIosRefreshCircle } from 'react-icons/io'
import getImageFromId from '@/util/getImageFromId';
import useAppStore from 'renderer/hooks/useStore';
import { Song } from 'renderer/types/Song';
import { Playlist } from 'renderer/types/Playlist';
import ReactPlayer from 'react-player';
const Player = () => {
  const [playerData,setPlayerData] = useState<ReactPlayer>()
  const [isLoading,setLoading] = useState(true)
  const playerState =  useAppStore((el)=>el.playerState)
  const setPlayerState =  useAppStore((el)=>el.setPlayerState)
  const {current,duration,playing,loop,stopped,time,volume } = playerState
  const { songIdx,playlist,nextSong,prevSong} = useAppStore((state)=>{
    let { songIdx,playlist,nextSong,prevSong } = state
    return {
      songIdx,
      playlist:playlist as Playlist,
      nextSong,
      prevSong
    }
  })
  const song = playlist.songs[songIdx]
  const {minutes:min,seconds:sec} = secToMinutes(current)
  useEffect(()=>{
    if(playerData){
      playerData.seekTo(time,'seconds')
    }
  },[time])

  const {minutes:totalM, seconds:totalSec} = secToMinutes(duration)
     return <div className='relative'>
      <div className='absolute w-full flex items-center justify-center '>
        <button>Hide</button>
      </div>
     <div className='absolute hidden top-0 left-0 ' id='yt-test'>
        <ReactPlayer   url={song.url}  onEnded={()=>{nextSong()}}  onProgress={(e)=>{
  setPlayerState({
        ...playerState,
        current:e.playedSeconds
      })
    }}
onReady={(pl)=>{
      setPlayerData(pl)
      setPlayerState({...playerState,playing,duration:pl.getDuration()})
      setLoading(false)
    }}
   playing={playing} />
      </div>
 <div className='flex px-4 bg-opacity-70 items-center w-full  absolute left-2 bottom-0 z-50 bg-zinc-900 backdrop-blur-xl p-2 gap-x-3'>
          <div className='w-60 py-2 flex flex-row gap-x-3'>
          <div className='w-16 h-16 flex flex-col  text-sm'>
              <img className='w-full h-full object-cover rounded-md aspect-square' src={song.background_img} />
          </div>
       <div>
          <div className='whitespace-nowrap'>
            {song.title}
          </div>
          <div className='text-gray-500 overflow-ellipsis'>
            {song.info}
          </div>
       </div>
          </div>

            {isLoading &&

            <div className='w-full flex items-center justify-center'>
            <div className='animate-spin text-5xl'>
              <IoIosRefreshCircle/>
              </div>

            </div>
              }
            <div className='w-full flex justify-between'>
              <div className='w-64'>

              </div>
            {!isLoading && <div className='w-full flex flex-col gap-y-2 items-center justify-center'>

            <div className='flex gap-x-2'>
              {songIdx == 0 && <div className='opacity-0'>
                {" a"}
                </div>}
             { songIdx > 0 && <button onClick={()=>{
              prevSong()
             }} className='bg-transparent text-2xl'>
                {<IoMdArrowDropleft/>}
              </button>}
              <button onClick={()=>{
                setPlayerState({...playerState,playing:!playerState.playing})
              }} className='btn btn-outline btn-circle'>
                {playing ? <IoMdPause/> : <IoMdPlay/>}
              </button>
              {songIdx !== playlist.songs.length - 1 && <button onClick={()=>{
                nextSong()
              }} className='bg-transparent text-2xl'>

                {<IoMdArrowDropright/>}
              </button>}
              {songIdx == playlist.songs.length - 1  && <div className='opacity-0'>
                  {" a"}
              </div>}
            </div>

              <Slider current={current} max={duration} onChange={(e)=>{
                console.log(current,'onCHange',e)
                setPlayerState({...playerState,time:e})
              }}/>
              <div>
                 {`${min}:${sec}`}/{`${totalM}:${totalSec}`}
              </div>
            </div>}
            <div className='w-64' >

            </div>
            </div>
          </div>
      </div>
}

export default Player
