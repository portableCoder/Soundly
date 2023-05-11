import { Playlist } from "renderer/types/Playlist";
import { Song } from "renderer/types/Song";

function isPlaylist(playlistSong: Playlist | Song): playlistSong is Playlist {

  return (playlistSong as Playlist).songs !== undefined;
}
export default isPlaylist
