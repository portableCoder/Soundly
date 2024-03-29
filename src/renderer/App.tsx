import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import '@fontsource/poppins'; // Defaults to weight 400.
import { useEffect, useState } from 'react';
import Player from './components/Player';
import useAppStore from './hooks/useStore';
import Menu from '@/components/Menu';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { Song } from './types/Song';
import { Playlist } from './types/Playlist';
import LocalStore from './hooks/LocalStore';

import { HiBars3BottomRight } from 'react-icons/hi2';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { QueryClient, QueryClientProvider } from 'react-query';

const qc = new QueryClient();
export default function App() {
  const [par, _] = useAutoAnimate({});
  const store = window.electron.store;
  const { tab, setTab, tabs } = useAppStore(({ tab, setTab, tabs }) => ({
    tab,
    setTab,
    tabs,
  }));
  function getSongs(): Song[] {
    return store.get('songs') || [];
  }
  function setSongs(songs: Song[]) {
    setSongsState(songs);
    store.set('songs', songs);
  }
  function getPlaylists(): Playlist[] {
    return store.get('playlists') || [];
  }
  function setPlaylists(pl: Playlist[]) {
    setPlaylistsState(pl);
    store.set('playlists', pl);
  }
  const [songs, setSongsState] = useState<Song[]>([]);
  const [playlists, setPlaylistsState] = useState<Playlist[]>([]);
  useEffect(() => {
    setPlaylists(getPlaylists());
    setSongs(getSongs());
  }, []);
  const theme = useAppStore((el) => el.theme);
  useEffect(() => {
    if (theme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.setAttribute('data-theme', 'light');
    }
  }, [theme]);
  const stopped = useAppStore((prev) => prev.playerState.stopped);
  const minimized = useAppStore((el) => el.playerState.minimized);
  const setMinimized = useAppStore((el) => el.setMinimized);
  return (
    <QueryClientProvider client={qc}>
      <LocalStore.Provider
        value={{
          getPlaylists,
          getSongs,
          setPlaylists,
          setSongs,
          songs,
          playlists,
        }}
      >
        <div className="bg-white text-black dark:bg-zinc-950 w-screen h-screen dark:text-white flex overflow-x-hidden">
          <Menu
            onSelect={(sel) => {
              setTab(sel);
            }}
          />

          <div
            ref={par}
            className="relative w-full  h-full py-16 overflow-y-auto p-4"
          >
            {tabs[tab]}
          </div>

          {!stopped && <Player />}
          <div className="fixed top-5 right-10">
            {minimized && (
              <button
                onClick={() => setMinimized(false)}
                className="btn animate-pulse btn-circle text-white text-2xl"
              >
                <BsMusicNoteBeamed />
              </button>
            )}
          </div>
        </div>
      </LocalStore.Provider>
    </QueryClientProvider>
  );
}
