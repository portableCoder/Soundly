import Player from '@/components/Player';
import SongPlaylistCard from '@/components/SongPlaylistCard';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useEffect, useRef, useState } from 'react';
import useLocalStore from 'renderer/hooks/useLocalStore';
import useAppStore from 'renderer/hooks/useStore';
import TagSelect from '@/components/TagSelect';
import genres from '@/util/genres';
import SongImg from '@/components/SongImg';
import { Song } from 'renderer/types/Song';
import { BsPlay } from 'react-icons/bs';
import { Playlist } from 'renderer/types/Playlist';
import ReactPlayer from 'react-player';
import he from 'he';
import { IoMdAdd } from 'react-icons/io';
import { debounce } from 'lodash';
import isPlaylist from '@/util/isPlaylist';
import MiniSongCard from '@/components/MiniSongCard';
const def = 'trending music';
const Home = () => {
  const [search, setSearch] = useState(def);
  const [songs, playlists, setSongs, setPlaylists] = useLocalStore();
  const [par, _] = useAutoAnimate();
  const startPlaying = useAppStore((el) => el.startPlaying);
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [playlistSongs, setPlaylistSongs] = useState<(Playlist | Song)[]>([]);
  const [songIds, setSongIds] = useState<Set<string>>(new Set());
  useEffect(() => {
    setArtists([
      ...new Set(songs.map((el) => el.title.toUpperCase().split('-')[0])),
    ]);
    setPlaylistSongs(
      [...songs, ...playlists]
        .sort((a, b) => b.lastPlayed - a.lastPlayed)
        .slice(0, 8)
    );
    const s = new Set<string>();
    songs.forEach((el) => {
      s.add(el.url);
      s.add(el.id);
    });
    setSongIds(s);
  }, [songs]);

  useEffect(() => {
    const searchTerm = selectedArtists.join(' ') + selectedGenres.join(' ');
    if (searchTerm == '') {
      setSearch(def);
    } else {
      setSearch(searchTerm);
    }
  }, [selectedArtists, selectedGenres]);
  const [fetchMore, setFetchMore] = useState(false);
  const [pref, _2] = useAutoAnimate();
  const [pref2, _3] = useAutoAnimate();
  function searchFn(val: string) {
    const searchTerm = selectedArtists.join(' ') + selectedGenres.join(' ');
    return () => {
      setSearch(`${val} ${searchTerm}`);
      setFetchMore((el) => !el);
    };
  }
  return (
    <div ref={par} className="text-2xl overflow-x-hidden ">
      <div>Home</div>
      {songs.length == 0 && playlists.length == 0 && (
        <div className="w-full text-xl text-gray-500 h-full absolute top-0 left-0 flex items-center justify-center">
          {
            'No songs or playlists available, add your music through the Add Music page, or explore'
          }
        </div>
      )}

      <div className="my-2 w-full flex flex-col gap-y-3">
        <div> Explore </div>
        <div className="overflow-x-auto overflow-y-hidden px-2 py-4">
          <div>Recent playlists</div>
          <div ref={pref} className="flex gap-x-6">
            {playlistSongs.map((el, i) => {
              if (isPlaylist(el))
                return <SongPlaylistCard {...el} expanded={false} key={i} />;
            })}
          </div>
        </div>
        <div>Recent songs</div>
        <div className="flex gap-x-6  flex-shrink-0 w-full overflow-x-scroll">
          {playlistSongs.map((el, i) => {
            if (!isPlaylist(el)) {
              return (
                <div className="flex-1">
                  <MiniSongCard {...el} key={i} />
                </div>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
