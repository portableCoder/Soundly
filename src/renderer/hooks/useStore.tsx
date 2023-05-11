import AddMusic from 'renderer/pages/AddMusic';
import Settings from 'renderer/pages/Settings';
import Home from 'renderer/pages/Home';
import SongLibrary from 'renderer/pages/SongLibrary';
import { Playlist } from 'renderer/types/Playlist';
import { Song } from 'renderer/types/Song';
import { create } from 'zustand';

import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { StoreSchema } from 'renderer/types/Store';
import storage from './StatePersist';

const useAppStore = create<StoreSchema>()(
  persist(
    (set) => ({
      tab: 2,
      tabs: [<Home />, <AddMusic />, <SongLibrary />, <Settings />],
      setTab: (tab) => {
        set((prev) => ({ tab }));
      },
      setEditing: (id) => {
        set((prev) => ({
          addMusic: {
            ...prev.addMusic,
            id,
          },
        }));
      },

      setSongs: (songs) => {
        set((prev) => ({
          addMusic: {
            ...prev.addMusic,
            songs,
          },
        }));
      },
      addMusic: {
        id: '',

        songs: [],
      },
      setMinimized(min) {
        set((prev) => ({
          ...prev,
          playerState: {
            ...prev.playerState,
            minimized: min,
          },
        }));
      },
      startPlaying(pl) {
        set((prev) => ({
          songIdx: 0,
          playerState: {
            ...prev.playerState,
            stopped: true,
            playing: false,
            current: 0,
            loop: false,
            time: 0,
            duration: 0,
            minimized: false,
          },
        }));
        setTimeout(() => {
          set((prev) => ({
            playlist: pl,
            songIdx: 0,
            playerState: {
              ...prev.playerState,
              stopped: false,
              playing: true,
              current: 0,
              loop: false,
              time: 0,
              duration: 0,
            },
          }));
        }, 20);
      },
      page: 0,
      songIdx: 0,
      playerState: {
        playing: false,
        stopped: true,
        volume: 0.7,
        current: 0,
        time: 0,
        duration: 0,
        minimized: false,
        hidden: false,
        loop: false,
      },
      setPlayerState: (state) => {
        set((prev) => ({ playerState: { ...state } }));
      },
      setPage: (idx: number) => set({ page: idx }),
      setSong: (idx: number) => {
        set((prev) => {
          const pl = prev.playlist;
          if (pl) {
            if (idx >= pl.songs.length) {
              return {
                songIdx: 0,
                playlist: undefined,
                playerState: {
                  ...prev.playerState,
                  stopped: true,
                  playing: false,
                  loop: false,
                  minimized: false,
                },
              };
            } else {
              return {
                songIdx: idx,
              };
            }
          }
          return {};
        });
      },
      prevSong() {
        const store = useAppStore.getState();

        store.setSong(store.songIdx - 1);
      },
      nextSong() {
        const store = useAppStore.getState();
        store.setSong(store.songIdx + 1);
      },
    }),
    {
      partialize: ({
        addMusic,
        page,
        songIdx,
        playerState,
        tab,
        playlist,
      }) => ({
        addMusic,
        page,
        songIdx,
        playerState,
        tab,
        playlist,
      }),

      name: 'player-state',
      storage: createJSONStorage(() => storage),
    }
  )
);
export default useAppStore;
