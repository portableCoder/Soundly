import React, { createContext, useEffect, useState } from 'react'
import { Playlist } from 'renderer/types/Playlist'
import { Song } from 'renderer/types/Song'
interface LocalStoreSchema{
  getSongs:()=>Song[],
  getPlaylists:()=>Playlist[],
  setSongs:(song:Song[])=>void,
  setPlaylists:(playlists:Playlist[])=>void,
  songs:Song[],
  playlists:Playlist[]

}
const LocalStore = createContext<LocalStoreSchema>({
getPlaylists() {
    return []
},
playlists:[],
songs:[],
getSongs() {
    return []
},
setPlaylists(playlists) {

},
setSongs(song) {

},
});
export default LocalStore
