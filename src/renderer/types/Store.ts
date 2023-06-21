import { Playlist } from "./Playlist";
import { Song } from "./Song";

interface PlayerState {
  playing: boolean;
  stopped: boolean;
  volume: number;
  loop: boolean;
  duration: number;
  current: number;
  time: number;
  hidden: boolean;
  minimized: boolean;
}

type Theme  = 'dark'|'light'|'auto'
type StoreSchema = {
  tabs: JSX.Element[];
  setTab: (tab: number) => void;
  tab: number;
  theme:Theme
  setTheme:(theme:Theme)=>void
  addMusic: {
    songs: Song[];
    id?: string;
  };

  playlist?: Playlist;

    setSongs: (songs: Song[]) => void;
    setEditing: (id: string) => void;
  playerState: PlayerState;
  setPlayerState: (playerState: PlayerState) => void;
  page: number;
  songIdx: number;
  prevSong: () => void;
  nextSong: () => void;
  setPage: (pg: number) => void;
  setSong: (song: number) => void;
  startPlaying: (pl: Playlist) => void;
  setMinimized: (min: boolean) => void;
};
export type {
  PlayerState,
  StoreSchema
}
