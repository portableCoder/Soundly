import isPlaylist from '@/util/isPlaylist';
import React from 'react';
import { IoMdPlay } from 'react-icons/io';
import useAppStore from 'renderer/hooks/useStore';
import { Playlist } from 'renderer/types/Playlist';
import { Song } from 'renderer/types/Song';

const MiniSongCard = (playlistSong: Song | Playlist) => {
  const startPlaying = useAppStore((el) => el.startPlaying);
  const isPlay = isPlaylist(playlistSong);
  return (
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
      className=" bg-zinc-850 aspect-square rounded-md relative"
    >
      <img
        src={playlistSong.background_img}
        className="w-32 h-32 rounded-md object-cover"
      />
      <div className="text-base  flex items-center justify-center w-32  text-ellipsis overflow-hidden truncate ...">
        {isPlaylist(playlistSong) ? playlistSong.name : playlistSong.title}
      </div>
    </button>
  );
};

export default MiniSongCard;
