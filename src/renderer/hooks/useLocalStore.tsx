import React, { useContext } from 'react'
import LocalStore from './LocalStore'
import { Song } from 'renderer/types/Song'
import { Playlist } from 'renderer/types/Playlist'

const useLocalStore = () : [Song[],Playlist[],(s:Song[])=>void,(p:Playlist[])=>void] => {
  const {songs,setSongs,playlists,setPlaylists} = useContext(LocalStore)
  return [songs,playlists, setSongs,setPlaylists]
}

export default useLocalStore
