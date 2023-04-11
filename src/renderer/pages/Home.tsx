import PlaylistCard from '@/components/PlaylistCard'
import React from 'react'
import Card from 'renderer/components/Card'
import useLocalStore from 'renderer/hooks/useLocalStore'

const Home = () => {
  const localStore = useLocalStore()
  const songs = localStore.getSongs()
  const playlists = localStore.getPlaylists()
  return (
    <div className='text-2xl'>
      <div>Home</div>
      <div className='w-full h-full flex gap-x-5'>
      <div>
      <div className='text-xl my-6'>

       Recently played
      </div>
      <div className='flex flex-col  gap-y-5'>
        {songs.map((el,i)=>{
          return <Card {...el} key={i}/>
        })}
      </div>
      </div>
      <div>
       <div className='text-xl my-6'>

       Your playlists

      </div>
<div className='flex flex-col  gap-y-5'>
        {playlists.map((el,i)=>{
          return <PlaylistCard {...el} key={i}></PlaylistCard>
        })}
      </div>

      </div>
      </div>
      <div>

      </div>
    </div>

  )
}

export default Home
