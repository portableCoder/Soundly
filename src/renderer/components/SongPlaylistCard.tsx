import getRandomBg from '@/util/random_grad';
import React, { useRef, useState } from 'react';
import { BsPencil, BsThreeDots } from 'react-icons/bs';
import { IoMdPlay, IoMdTrash } from 'react-icons/io';
import { animated, useSpring } from 'react-spring';
import useLocalStore from 'renderer/hooks/useLocalStore';
import useAppStore from 'renderer/hooks/useStore';
import { Playlist } from 'renderer/types/Playlist';
import { Song } from 'renderer/types/Song';
import SongImg from './SongImg';
import isPlaylist from '@/util/isPlaylist';

const PlaylistCard = (
  playlistSong: (Playlist | Song) & { expanded: boolean }
) => {
  const startPlaying = useAppStore((el) => el.startPlaying);
  const isPlay = isPlaylist(playlistSong);
  const ref = useRef(() => {
    if (isPlay) {
      let pl = playlistSong.songs.slice(0, 4);
      pl.pop();
      return [
        ...new Set(
          pl.map((el) => {
            const fb = el.title.split('-');

            return fb[0];
          })
        ),
      ];
    } else {
      return [];
    }
  });
  const bg = useRef(getRandomBg());
  const [songs, playlists, setSongs, setPlaylists] = useLocalStore();
  const idx = playlistSong.id;
  const [popoverOpen, setPopoverOpen] = useState(false);
  const setEditing = useAppStore((el) => el.setEditing);
  const setTab = useAppStore((el) => el.setTab);
  const spring = useSpring({
    scale: popoverOpen ? 1 : 0,
    backgroundColor: 'black',
  });
  return (
    <div className={`relative rounded-md w-full p-4 pr-8 ${bg.current} `}>
      <div className="w-full relative flex items-end justify-end ">
        <button
          onClick={() => {
            setPopoverOpen((prev) => !prev);
          }}
        >
          {' '}
          <BsThreeDots />{' '}
        </button>
        {
          <animated.div
            style={spring}
            className="w-40 rounded-md absolute z-50 text-base  top-5 right-0"
          >
            <ul className="menu w-full">
              {isPlay && (
                <li>
                  <button
                    onClick={() => {
                      setEditing(playlistSong.id);
                      setTab(1);
                      setPopoverOpen(false);
                    }}
                    className="flex gap-x-2"
                  >
                    <BsPencil />
                    Edit
                  </button>
                </li>
              )}
              <li className="hover:bg-red-500 hover:bg-opacity-70">
                <button
                  onClick={() => {
                    if (isPlay) {
                      setPlaylists(
                        playlists.filter((el) => el.id !== playlistSong.id)
                      );
                    } else {
                      setSongs(songs.filter((el) => el.id !== playlistSong.id));
                    }
                    setPopoverOpen(false);
                  }}
                  className="flex gap-x-2"
                >
                  <IoMdTrash />
                  Delete
                </button>
              </li>
            </ul>
          </animated.div>
        }
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className={`flex flex-row gap-x-3 `}>
          <SongImg {...playlistSong} />
          <div className=" bg-transparent">
            <div
              className={`text-lg whitespace-nowrap w-32 ${
                !playlistSong.expanded ? 'truncate ...' : ''
              }`}
            >
              {isPlay ? playlistSong.name : playlistSong.title}
            </div>
            {isPlay && (
              <div className="text-lg">{playlistSong.songs.length} Songs</div>
            )}

            {
              <div className="gap-x-2 text-sm text-gray-100 max-h-32 w-32 overflow-hidden">
                <div className="flex flex-col gap-y-2">
                  {isPlay
                    ? ref.current().map((el) => <div>{el}</div>)
                    : playlistSong.info}
                </div>
              </div>
            }
          </div>
          <div>
            <div></div>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 items-center justify-center py-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <button
              onClick={() => {
                if (isPlay) {
                  startPlaying(playlistSong);
                } else {
                  const onePlaylist: Playlist = {
                    id: '',
                    name: '',
                    background_img: playlistSong.background_img,
                    songs: [playlistSong],
                    lastPlayed: new Date().getTime(),
                  };

                  startPlaying(onePlaylist);
                }
              }}
              className="btn btn-outline btn-sm btn-circle border-2 mx-auto text-white  items-center justify-center"
            >
              <IoMdPlay />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
