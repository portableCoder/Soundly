import { Playlist } from 'renderer/types/Playlist'
import { Song } from 'renderer/types/Song'
import { create } from 'zustand'
interface PlayerState {
  playing:boolean,
  stopped:boolean,
  volume:number,
  loop:boolean,
  duration:number,
  current:number,
  time:number,
  hidden:boolean

  }

type StoreSchema = {
  playlist?:Playlist,
  playerState: PlayerState,
  setPlayerState:(playerState:PlayerState)=>void,
  page:number,
  songIdx:number,
  prevSong:()=>void,
  nextSong:()=>void,
  setPage:(pg:number)=>void,
  setSong:(song:number)=>void,
  startPlaying:(pl:Playlist)=>void
}
export type {

}
const useAppStore = create<StoreSchema>()((set) => ({
  startPlaying(pl) {
      set((prev)=>({
        playlist:pl,
        songIdx:0,
        playerState:{
          ...prev.playerState,
          stopped:false,
          playing:true,
           current:0,
           loop:false,
           time:0,
           duration:0

        }
      }))
  },
  page:0,
  songIdx:0,
  playerState:{
  playing:false,
  stopped:true,
  volume:0.7,
  current:0,
  time:0,
  duration:0,
  hidden:false,
  loop:false
  },
  setPlayerState:(state)=>{
    set((prev)=>({playerState:{...state}
    }))
  },
  setPage:(idx:number)=>set({page:idx}),
  setSong:(idx:number)=>{
    set((prev)=>{
      const pl  = prev.playlist
      if(pl){
        if(idx >= pl.songs.length){
            return {
              songIdx:0,
              playlist:undefined,
              playerState:{
                ...prev.playerState,
                stopped:true,
                playing:false,
                loop:false,

              }
            }
        }
        else{
          return {
             songIdx:idx
          }
        }
      }
      return {

      }
    })

  },
  prevSong(){
    const store = useAppStore.getState()

    store.setSong(store.songIdx-1)
  },
  nextSong(){

    const store = useAppStore.getState()
    store.setSong(store.songIdx+1)
  }


}))
export default useAppStore
