import Player from '@/components/Player';
import SongPlaylistCard from '@/components/SongPlaylistCard';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React, { useEffect, useRef, useState } from 'react';
import useLocalStore from 'renderer/hooks/useLocalStore';
import useAppStore from 'renderer/hooks/useStore';
import useYoutube from '../hooks/useYoutube';
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
  const [youtube, items] = useYoutube(search, fetchMore);
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
          <div ref={pref} className="flex gap-x-6">
            {playlistSongs.map((el, i) => {
              return <SongPlaylistCard {...el} expanded={false} key={i} />;
            })}
          </div>
        </div>
        <div className="flex justify-between gap-x-4 text-base">
          <div className="flex flex-col w-1/2">
            <div className="font-bold">Genres</div>
            <TagSelect
              onChange={(res) => {
                setSelectedGenres(res);
              }}
              tags={genres}
            />
            <div className="font-bold">Artists</div>
            <TagSelect
              onChange={(res) => {
                setSelectedArtists(res);
              }}
              tags={artists}
            />
          </div>
          {youtube && (
            <div ref={pref2} className="grid grid-cols-1 gap-4">
              <div className="w-full ">
                <input
                  className="w-full rounded-md"
                  placeholder="Search..."
                  onChange={(e) => {
                    const deb = debounce(searchFn(e.target.value), 300);
                    deb();
                  }}
                />
              </div>
              {items.map((v) => {
                const url = `https://youtube.com/watch?v=${v.id.videoId}`;
                if (!ReactPlayer.canPlay(url)) {
                  return <></>;
                }
                const sg: Song = {
                  background_img: v.snippet.thumbnails.default.url,
                  id: crypto.randomUUID(),
                  info: v.snippet.channelTitle,
                  title: v.snippet.title,
                  url,
                  lastPlayed: 0,
                };
                return (
                  <div className="flex justify-between gap-x-3">
                    <div className="flex gap-x-2 ">
                      <SongImg {...sg} />
                      <div className="flex my-4     flex-col gap-y-2">
                        <div>{he.decode(sg.title)}</div>
                        <div className="text-xs">{sg.info}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => {
                          const onePlaylist: Playlist = {
                            id: '',
                            name: '',
                            background_img: sg.background_img,
                            songs: [sg],
                            lastPlayed: Number.MIN_SAFE_INTEGER,
                          };
                          startPlaying(onePlaylist);
                        }}
                        className="btn btn-outline btn-circle"
                      >
                        <BsPlay />
                      </button>
                      {!songIds.has(url) && (
                        <button
                          className="flex flex-col items-center justify-center"
                          onClick={() => {
                            const sgs = [...songs];
                            sgs.push(sg);
                            setSongs(sgs);
                          }}
                        >
                          <div>
                            <IoMdAdd />
                          </div>
                          <div className="text-xs">Add Song</div>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => {
                  setFetchMore((prev) => !prev);
                }}
                className="w-full btn btn-outline rounded-sm"
              >
                {' '}
                Show more..{' '}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
