import isPlaylist from '@/util/isPlaylist';
import React from 'react';
import { BsMusicNoteBeamed } from 'react-icons/bs';
import { Playlist } from 'renderer/types/Playlist';
import { Song } from 'renderer/types/Song';

const SongImg = (
  playlistSong: (Song | Playlist) & { size?: 'normal' | 'medium' | 'large' }
) => {
  const isPlay = isPlaylist(playlistSong);
  let size = playlistSong.size;
  if (!size) {
    size = 'normal';
  }
  let prev = 0;
  let dim = 'w-32 h-32';
  if (size == 'large') {
    dim = 'w-64 h-64';
  }
  if (size == 'medium') {
    dim = 'w-48  h-48';
  }
  return (
    <div
      className={`${dim} relative shrink-0 my-2 rounded-md stack  bg-zinc-900 bg-opacity-50`}
    >
      {isPlay ? (
        playlistSong.songs.slice(0, 4).map((el) => {
          let init = prev;
          prev += 2;

          return el.background_img !== '' ? (
            <img
              src={el.background_img}
              style={{
                right: `${init}px`,
              }}
              className={`${dim} border-0 absolute object-cover rounded-md shadow-2xl`}
            />
          ) : (
            <div className={`${dim} flex items-center justify-center`}>
              <BsMusicNoteBeamed />
            </div>
          );
        })
      ) : playlistSong.background_img !== '' ? (
        <img
          src={playlistSong.background_img}
          className={`${dim} absolute object-cover rounded-md shadow-2xl`}
        />
      ) : (
        <div className={`${dim} flex items-center justify-center`}>
          <BsMusicNoteBeamed />
        </div>
      )}
    </div>
  );
};

export default SongImg;
