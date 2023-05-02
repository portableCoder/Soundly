import { Song } from "./Song"

type Playlist = {
    songs:Song[],
    lastPlayed:number,
    name:string,
    background_img:string,
    id:string
}
export type{
  Playlist
}
