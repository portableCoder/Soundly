import React from 'react'
import useAppStore from 'renderer/hooks/useStore'
import './align.css'
const SongInfo = () => {
  const playlist = useAppStore((el)=>el.playlist)
  if (!playlist){
    return <div>
      No song/Playlist currently playing
    </div>
  }
  const isSong = playlist.name === '' && playlist.songs.length == 1
  return (
    <div>
      <div className='text-3xl'>
        {`Currently playing ${isSong ? "song" : "playlist"} ${playlist.name} ${isSong ? playlist.songs[0].title:""}`}
      </div>
      <div>

      </div>
{playlist && <table className="table table-fixed w-full">
  <thead className='rounded-l-2xl  rounded-r-2xl bg-slate-800 border border-gray-600'>
    <tr>
      <th>S.no</th>
      <th>Song</th>
      <th>Artist/Channel</th>
    </tr>
  </thead>
  <tbody className=''>
        {playlist.songs.map((el,i)=>
           <tr className='hover:active'>
      <td>{i+1}</td>
      <td>{el.title}</td>
      <td>{el.info}</td>
    </tr>
        )}
  </tbody>
</table>}

    </div>
  )
}

export default SongInfo
