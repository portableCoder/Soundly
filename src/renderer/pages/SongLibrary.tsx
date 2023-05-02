import SongPlaylistCard from '@/components/SongPlaylistCard'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import Fuse from 'fuse.js'
import React, { useEffect, useState } from 'react'
import useLocalStore from 'renderer/hooks/useLocalStore'
const opts = ['All','Songs','Playlists']
const SongLibrary = () => {
  const [selection,setSelection] = useState(0)
  const [search,setSearch] = useState('')
  const [parent,_] = useAutoAnimate()
  const [s,p] = useLocalStore()

  const [{songs,playlists},setMusic] = useState({
    songs:s,
    playlists:p
  })
  useEffect(()=>{
    setMusic({
      songs:s,
      playlists:p
    })
  },[s])
  useEffect(()=>{
    if(search === ''){
      setMusic({
        songs:s,
        playlists:p
      })
    }
    else{
      const plSearch = new Fuse(playlists,{
        keys:[
          'name'
        ]
      }).search(search)
      const songsSearch = new Fuse(songs,{
        keys:['title']
      }).search(search)
      console.log('res',plSearch,songsSearch)
      setMusic({
        playlists:plSearch.map((el)=>el.item),
        songs:songsSearch.map((el)=>el.item)
      })

    }
  },[search])
  const notFound = s.length > 0 && p.length > 0 && songs.length == 0 && playlists.length == 0 && search !== ''
  return (
    <div>Song Library

<div className='flex w-full justify-between'>
<div className="tabs">
  {opts.map((el,i)=><button onClick={()=>{
    setSelection(i)
  }} className={`tab tab-bordered ${i === selection  ? 'tab-active' : ''}`}>{el}</button>)}
</div>
<div className='w-1/4'>
  <input onChange={(e)=>{
    setSearch(e.target.value)
  }} className='w-full input input-bordered'/>
</div>
</div>
<div ref={parent} className='flex flex-col gap-y-5'>
    {(s.length === 0 && p.length === 0 ) && <div>
      You haven't added any songs or playists..
      </div>}
      {notFound && <div>
          No songs and playlists with the name {search} were found
        </div>}
    {(selection === 0 || selection === 1) && <>
      {songs.map((el,i)=><SongPlaylistCard {...el} />)}
      </>}

    {(selection === 0 || selection === 2) && <>

      {playlists.map((el,i)=><SongPlaylistCard {...el} />)}
      </>}

</div>


    </div>

  )
}

export default SongLibrary
