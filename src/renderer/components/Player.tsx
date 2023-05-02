import React, { useEffect, useState } from 'react'
import Slider from '@/components/Slider';
import getIdFromLink from '@/util/getIdFromLink';
import secToMinutes from '@/util/secToMinutes';
import './range.css'
import { IoMdSquareOutline as IoStop,IoMdHeart as Heart, IoMdSearch as Search, IoMdAdd as Add, IoMdHome as HomeIcon, IoMdMusicalNote as NoteIcon, IoMdPlay, IoMdPause, IoMdArrowDropright, IoMdArrowDropleft, IoIosRefreshCircle, IoMdRemove } from 'react-icons/io'
import {ImLoop} from 'react-icons/im'
import getImageFromId from '@/util/getImageFromId';
import useAppStore from 'renderer/hooks/useStore';
import { Song } from 'renderer/types/Song';
import { Playlist } from 'renderer/types/Playlist';
import ReactPlayer from 'react-player';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import {BsSoundwave} from 'react-icons/bs'
import { Slide } from 'react-toastify';
import { animated, useSpring } from 'react-spring';

const Player = () => {
  const [playerData,setPlayerData] = useState<ReactPlayer>()
  const [isLoading,setLoading] = useState(true)
  const playerState =  useAppStore((el)=>el.playerState)
  const setPlayerState =  useAppStore((el)=>el.setPlayerState)
  const setSong = useAppStore((el)=>el.setSong)
  const {current,duration,playing,loop,stopped,time,volume,minimized } = playerState
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
const [par,_ ] = useAutoAnimate()
const [main,_2 ] = useAutoAnimate()
  const {minutes:totalM, seconds:totalSec} = secToMinutes(duration)
  const spring = useSpring({
    y: minimized ? 200 : 0,
    opacity: minimized ? 0 : 1,

  })
     return <animated.div className='fixed bottom-0 left-0 w-full' style={spring}>
      <div className='bg-zinc-900 backdrop-blur-3xl bg-opacity-70 w-full h-full absolute'>
ab
      </div>
     <div className='absolute hidden top-0 left-0 ' id='yt-test'>
        <ReactPlayer volume={volume}  loop={loop}  url={song.url}  onEnded={()=>{
          if(!loop){
          nextSong()
          }


        }}  onProgress={(e)=>{
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
 <div ref={main} className='flex px-4 items-center w-full  absolute left-2 bottom-0 z-50 p-2 gap-x-3'>
          <div className='w-60 py-2 flex flex-row gap-x-3'>
              <img className='w-16 h-16 object-cover rounded-md aspect-square' src={song.background_img} />
       <div className='w-32 my-auto truncate ...'>
          <div className='truncate ...'>
            {song.title}
          </div>
          <div className='truncate ... text-gray-500 overflow-ellipsis'>
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
            <div className='w-full flex justify-between items-center'>
   <div ref={par} className='w-32 mx-6 truncate ... px-4 p-2'>

              { songIdx > 0 && <div className='w-full whitespace-nowrap overflow-ellipsis flex flex-col gap-y-0.5 justify-center'>
                  <div>
                    Prevous
                  </div>
                  <div className='text-gray-500 text-sm text-ellipsis'>{playlist.songs[songIdx-1].title}</div>

                </div>}

              </div>

            {!isLoading && <div className='w-full flex flex-col gap-y-2 items-center justify-center'>

            <div className='flex gap-x-2 items-center'>
            <div className=''>
            <button onClick={()=>{
                setPlayerState({...playerState,minimized:!minimized})
            }} className='bg-transparent text-2xl'> <IoMdRemove/> </button>
            </div>
            <button onClick={()=>{
                setSong(playlist.songs.length+1)
              }} className='bg-transparent text-2xl'>
                        {<IoStop/>}
                        </button>

            <button



            onClick={()=>{
              prevSong()
             }}  className={`bg-transparent text-2xl ${ songIdx > 0  ? "opacity-100" : "opacity-0"}  `}
            disabled={songIdx === 0}
             >
                {<IoMdArrowDropleft/>}
              </button>
             <button onClick={()=>{
                setPlayerState({...playerState,playing:!playerState.playing})
              }} className='btn btn-outline btn-circle'>
                {playing ? <IoMdPause/> : <IoMdPlay/>}
              </button>
              <button  onClick={()=>{
                nextSong()
              }} className={`bg-transparent text-2xl ${songIdx === playlist.songs.length - 1 ? 'opacity-0' : 'opacity-100' }`} disabled={songIdx === playlist.songs.length - 1}>

                {<IoMdArrowDropright/>}
              </button>

   <button onClick={()=>{
    setPlayerState({
      ...playerState,
      loop:!playerState.loop
    })
   }} className={`bg-transparent text-2xl ${loop  ? 'text-purple-500' : ''}`}>
              {<ImLoop/>}
              </button>

            <div className='w-24 h-8 m-auto flex gap-x-1 items-center'>
              <div>
                <BsSoundwave/>
              </div>
              <Slider max={1} current={volume} onChange={(v)=>{
                setPlayerState({...playerState,volume:v})
              }}>
                <BsSoundwave/>
              </Slider>
            </div>

            </div>

              <Slider current={current} max={duration} onChange={(e)=>{
                console.log(current,'onCHange',e)
                setPlayerState({...playerState,time:e})
              }}/>
              <div>
                 {`${min}:${sec}`}/{`${totalM}:${totalSec}`}
              </div>
            </div>}
   <div ref={par} className='w-32 mx-6 truncate ... px-4 p-2'>

              { songIdx !== playlist.songs.length - 1 && <div className='w-full whitespace-nowrap overflow-ellipsis flex flex-col gap-y-0.5 justify-center'>
                  <div>
                    Up Next
                  </div>
                  <div className='text-gray-500 text-sm text-ellipsis'>{playlist.songs[songIdx+1].title}</div>

                </div>}

              </div>
            </div>
          </div>
      </animated.div>
}

export default Player
