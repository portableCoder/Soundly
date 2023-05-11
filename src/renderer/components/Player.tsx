import React, { useEffect, useRef, useState } from 'react';
import Slider from '@/components/Slider';
import getIdFromLink from '@/util/getIdFromLink';
import secToMinutes from '@/util/secToMinutes';
import './range.css';
import {
  IoMdSquareOutline as IoStop,
  IoMdHeart as Heart,
  IoMdSearch as Search,
  IoMdAdd as Add,
  IoMdHome as HomeIcon,
  IoMdMusicalNote as NoteIcon,
  IoMdPlay,
  IoMdPause,
  IoMdArrowDropright,
  IoMdArrowDropleft,
  IoIosRefreshCircle,
  IoMdRemove,
  IoMdMenu,
} from 'react-icons/io';
import { ImLoop } from 'react-icons/im';
import getImageFromId from '@/util/getImageFromId';
import useAppStore from 'renderer/hooks/useStore';
import { Song } from 'renderer/types/Song';
import { Playlist } from 'renderer/types/Playlist';
import ReactPlayer from 'react-player';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { BsSoundwave } from 'react-icons/bs';
import { BiReset } from 'react-icons/bi';
import { Slide } from 'react-toastify';
import { animated, useSpring } from 'react-spring';
import isValidLink from '@/util/isValidLink';
import useLocalStore from 'renderer/hooks/useLocalStore';
import getFileDataUrl from '@/util/getFileDataUrl';
import SongImg from './SongImg';
import Toast from './Toast';
import { toast } from './Toast';

const Player = () => {
  const [playerData, setPlayerData] = useState<ReactPlayer>();
  const [isLoading, setLoading] = useState(true);
  const playerState = useAppStore((el) => el.playerState);
  const setPlayerState = useAppStore((el) => el.setPlayerState);
  const setSong = useAppStore((el) => el.setSong);
  const { current, duration, playing, loop, stopped, time, volume, minimized } =
    playerState;
  const { songIdx, setMinimized, playlist, nextSong, prevSong } = useAppStore(
    (state) => {
      let { setMinimized, songIdx, playlist, nextSong, prevSong } = state;
      return {
        songIdx,
        playlist: playlist as Playlist,
        nextSong,
        prevSong,
        setMinimized,
      };
    }
  );
  const [song, setCurrentSong] = useState(playlist.songs[songIdx]);

  const { minutes: min, seconds: sec } = secToMinutes(current);
  useEffect(() => {
    if (playerData) {
      playerData.seekTo(time, 'seconds');
    }
  }, [time]);
  const [localStoreSongs, localStorePlaylists, set_s, set_p] = useLocalStore();
  const [par, _] = useAutoAnimate();
  const [main, _2] = useAutoAnimate();
  const { minutes: totalM, seconds: totalSec } = secToMinutes(duration);
  const spring = useSpring({
    x: minimized ? 500 : 0,
    opacity: minimized ? 0 : 1,
  });
  useEffect(() => {
    const idx = localStorePlaylists.findIndex((el) => el.id === playlist.id);
    if (playlist.songs.length === 1 || idx === -1) {
      return;
    }
    localStorePlaylists[idx].lastPlayed = Date.now();
    set_p(localStorePlaylists);
  }, []);
  useEffect(() => {
    const currentSong = { ...playlist.songs[songIdx] };
    const idx = localStoreSongs.findIndex((el) => el.id === currentSong.id);
    if (currentSong.background_img === '') {
      try {
        currentSong.url = getFileDataUrl(currentSong.url);
      } catch (e) {
        toast.error('File was not found, skipping..', { position: 'top-left' });
        nextSong();
      }
    }
    setCurrentSong(currentSong);
    if (idx === -1) {
      return;
    }

    localStoreSongs[idx].lastPlayed = Date.now();
    set_s(localStoreSongs);
    reset();
  }, [songIdx]);
  function reset() {
    if (playerData) {
      playerData.seekTo(0, 'seconds');
      setPlayerState({ ...playerState, time: 0 });
    }
  }
  return (
    <animated.div
      className="fixed top-0 right-0 w-1/4 max-h-screen min-h-screen"
      style={spring}
    >
      <div className="absolute hidden top-0 left-0 " id="yt-test">
        <ReactPlayer
          volume={volume}
          loop={loop}
          url={song.url}
          onEnded={() => {
            if (!loop) {
              nextSong();
            }
          }}
          onProgress={(e) => {
            setPlayerState({
              ...playerState,
              current: e.playedSeconds,
            });
          }}
          onReady={(pl) => {
            setPlayerData(pl);
            setPlayerState({
              ...playerState,
              playing,
              duration: pl.getDuration(),
            });
            setLoading(false);
          }}
          playing={playing}
        />
      </div>

      <div
        ref={main}
        className="flex px-4 flex-col items-center w-full bg-zinc-900 backdrop-blur-2xl bg-opacity-70 h-full   absolute top-0 right-0 z-50 p-2 gap-x-3"
      >
        <div className="absolute top-0 left-5 text-xl">
          <button
            onClick={() => {
              setMinimized(true);
            }}
          >
            <IoMdMenu />
          </button>
        </div>
        <div className="w-full h-full">
          <div className="w-full flex flex-col items-center justify-center gap-y-2">
            <SongImg {...song} />
            <div>{song.title}</div>
            <div>{song.info}</div>
          </div>

          {isLoading && (
            <div className="w-full flex items-center justify-center">
              <div className="animate-spin text-5xl">
                <IoIosRefreshCircle />
              </div>
            </div>
          )}
          <div className="w-full flex justify-between items-center">
            {!isLoading && (
              <div className="w-full flex flex-col gap-y-2">
                <div className="flex flex-row">
                  <div className="w-full"></div>
                  <div className="w-full h-8 m-auto flex gap-x-1 items-center">
                    <div>
                      <BsSoundwave />
                    </div>
                    <Slider
                      max={1}
                      current={volume}
                      onChange={(v) => {
                        setPlayerState({ ...playerState, volume: v });
                      }}
                    />
                  </div>
                </div>
                <div className="flex gap-x-2 justify-center items-center">
                  <button onClick={reset} id="reset">
                    <BiReset />
                  </button>
                  <button
                    onClick={() => {
                      prevSong();
                    }}
                    className={`bg-transparent text-2xl ${
                      songIdx > 0 ? 'opacity-100' : 'opacity-0'
                    }  `}
                    disabled={songIdx === 0}
                  >
                    {<IoMdArrowDropleft />}
                  </button>
                  <button
                    onClick={() => {
                      setPlayerState({
                        ...playerState,
                        playing: !playerState.playing,
                      });
                    }}
                    className="btn btn-outline btn-circle"
                  >
                    {playing ? <IoMdPause /> : <IoMdPlay />}
                  </button>
                  <button
                    onClick={() => {
                      nextSong();
                    }}
                    className={`bg-transparent text-2xl ${
                      songIdx === playlist.songs.length - 1
                        ? 'opacity-0'
                        : 'opacity-100'
                    }`}
                    disabled={songIdx === playlist.songs.length - 1}
                  >
                    {<IoMdArrowDropright />}
                  </button>
                  <button
                    onClick={() => {
                      setPlayerState({ ...playerState, loop: !loop });
                    }}
                    className={`${loop ? 'text-purple-500' : 'text-white'}`}
                  >
                    <ImLoop />
                  </button>
                </div>

                <Slider
                  current={current}
                  max={duration}
                  onChange={(e) => {
                    setPlayerState({ ...playerState, time: e });
                  }}
                />
                <div className="text-center">
                  {`${min}:${sec}`}/{`${totalM}:${totalSec}`}
                </div>
              </div>
            )}
          </div>
          <div className="font-bold">
            <a>Songs</a>
          </div>
          <ul className="h-56 flex-shrink-0 px-2 overflow-x-hidden gap-y-2 overflow-y-scroll divide-y-0 divide-gray-600">
            {playlist.songs.map((el, i) => (
              <li
                onClick={() => {
                  setSong(i);
                }}
                className={`p-2 my-2 flex gap-x-2  cursor-pointer active:bg-indigo-500 duration-250 hover:bg-opacity-30 bg-opacity-0 transition-all ${
                  songIdx === i ? 'bg-indigo-500 bg-opacity-100' : 'bg-white'
                } `}
              >
                <a>{i + 1}.</a>
                <a>{el.title} </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Toast position="top-left" />
    </animated.div>
  );
};

export default Player;
