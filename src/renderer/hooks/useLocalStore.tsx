import React from 'react'
import { Playlist } from 'renderer/types/Playlist'
import { Song } from 'renderer/types/Song'

const useLocalStore = () => {
  const store = window.electron.store
  function getSongs() : Song[] {
      return store.get('songs')  || []
  }
  function setSongs(songs:Song[]){
      store.set('songs',songs)
  }
  function getPlaylists():Playlist[]{


      return store.get('playlists')  || []

  }
  function setPlaylists(pl:Playlist[]){

      store.set('playlists',pl)
  }
  return {getSongs,getPlaylists,setSongs,setPlaylists}
}

export default useLocalStore
