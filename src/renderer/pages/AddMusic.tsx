import getIdFromLink from '@/util/getIdFromLink';
import isValidLink from '@/util/isValidLink';
import 'react-toastify/dist/ReactToastify.css';
import getVideoDetails from '@/util/getVideoDetails';
import * as musicMetadata from 'music-metadata-browser';

import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  IoMdAdd,
  IoMdArrowDown,
  IoMdCube,
  IoMdFolder,
  IoMdTrash,
} from 'react-icons/io';
import { Song } from 'renderer/types/Song';
import { Playlist } from 'renderer/types/Playlist';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import LocalStore from 'renderer/hooks/LocalStore';
import { animated, useSpring } from 'react-spring';
import useLocalStore from 'renderer/hooks/useLocalStore';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

import useAppStore from 'renderer/hooks/useStore';
import SongImg from '@/components/SongImg';
import getFileName from '@/util/getFileName';
import Toast, { toast } from '@/components/Toast';

function deduplicateSongs(songs: Song[]) {
  let deduplicatedSongs = [];
  let st = new Set();
  for (let s of songs) {
    if (st.has(s.url)) {
      continue;
    }
    st.add(s.url);
    deduplicatedSongs.push(s);
  }

  return deduplicatedSongs;
}
const AddMusic = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [link, setLink] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [addExisting, setAddExisting] = useState(false);
  const spring = useSpring({
    height: addExisting ? 400 : 0,
  });
  const { id, setSongs, songs, setEditing } = useAppStore((state) => {
    const { id, setSongs, setEditing, songs } = { ...state.addMusic, ...state };

    return { id, setSongs, songs, setEditing };
  });
  useEffect(() => {
    return () => {
      setEditing('');
    };
  }, []);
  const [storedSongs, storedPlaylists, setStoredSongs, setStoredPlaylists] =
    useLocalStore();
  const editing = storedPlaylists.find((el) => el.id === id);

  return (
    <div className="h-screen">
      {editing && (
        <div className="flex items-center justify-center absolute bg-rose-500 top-0 left-0 w-full h-8">
          <div>Currently editing playlist: {editing.name} </div>
        </div>
      )}
      Add Music
      <div className="flex gap-x-3">
        <input
          value={link}
          disabled={isLoading}
          onChange={(e) => setLink(e.target.value)}
          className="input w-full rounded-sm focus:outline-none border-2 focus:border-violet-500"
          placeholder="Enter a valid Soundcloud, Bandcamp, Youtube link here.."
        />
        <button
          disabled={isLoading}
          onClick={async () => {
            if (isValidLink(link)) {
              const p = [...songs];
              setLoading(true);
              if (link.includes('youtube') || link.includes('youtu.be')) {
                getVideoDetails(getIdFromLink(link) as string)
                  .then((data) => {
                    p.push({
                      id: crypto.randomUUID(),
                      background_img: data.thumbnail_url,
                      lastPlayed: Number.MIN_SAFE_INTEGER,
                      info: data.author_name,
                      title: data.title,

                      url: link,
                    });
                    setLoading(false);
                    setSongs(p);
                    setLink('');
                  })
                  .catch((e) => {
                    setLoading(false);
                    toast.error('An error occured...', {
                      position: 'top-right',
                      autoClose: 1198,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: 'dark',
                    });
                  });
              }
            }
          }}
          className="btn btn-md btn-square text-white "
        >
          {isLoading ? <IoMdCube /> : <IoMdAdd />}
        </button>
      </div>
      <div>
        <button
          onClick={async () => {
            const paths = await window.electron.file.selectFiles();
            const newSongs = [...songs];
            if (!paths) {
              return;
            }
            for (let path of paths) {
              newSongs.push({
                url: path,
                background_img: '',
                id: crypto.randomUUID(),
                info: '',
                title: getFileName(path).name,
                lastPlayed: Number.MIN_SAFE_INTEGER,
              });
              setSongs(newSongs);
            }
          }}
          className="btn btn-outline rounded-sm"
        >
          {' '}
          Add from system{' '}
        </button>
      </div>
      <div className=" flex flex-col gap-y-2 my-2">
        <button
          onClick={() => setAddExisting((prev) => !prev)}
          className="btn btn-outline w-full flex gap-x-2 rounded-sm"
        >
          Add from existing songs{' '}
          <div
            className={`${
              addExisting ? 'rotate-180' : ''
            } transition-all duration-200`}
          >
            {' '}
            {<IoMdArrowDown />}{' '}
          </div>
        </button>

        <animated.div
          style={{
            height: spring.height.to((el) => `${el}px`),
          }}
          className="overflow-y-scroll"
        >
          <div className="grid grid-cols-2  gap-y-2 items-center justify-center">
            {storedSongs.map((el, i) => (
              <div
                key={i}
                onClick={() => {
                  const newSongs = [...songs, el];
                  setSongs(deduplicateSongs(newSongs));
                }}
                className={`cursor-grab flex gap-x-2 p-2 ${
                  i !== storedSongs.length - 1
                    ? ' border-b border-gray-600'
                    : ''
                }`}
              >
                <SongImg {...el} />
                <div className="flex flex-col">
                  <div className="text-bold">{el.title}</div>
                  <div className="text-sm">{el.info}</div>
                </div>
              </div>
            ))}
          </div>
        </animated.div>
      </div>
      {!isValidLink(link) && (
        <div className="text-red-500 text-md">
          {' '}
          Invalid link. Please enter a proper one.{' '}
        </div>
      )}
      <div className="my-6 flex flex-col gap-y-3 py-4 ">
        {songs.length > 0 && (
          <div className="h-1/4 w-full relative bg-transparent">
            <img
              className="h-full object-fill absolute z-0 top-0 left-0 w-full blur-2xl"
              src={songs[0].background_img}
            />

            <div className="flex flex-row gap-x-3 items-end">
              <SongImg {...songs[0]} size="large" />

              {songs.length > 1 && (
                <div className="text-4xl flex flex-col gap-y-3">
                  <input
                    ref={ref}
                    placeholder="Playlist Name.."
                    className="my-12 bg-transparent focus:outline-none rounded-sm  w-full  z-50"
                  />
                </div>
              )}

              {songs.length == 1 && (
                <div className="my-12 bg-transparent focus:outline-none rounded-sm  w-full  z-50">
                  {songs[0].title}
                </div>
              )}
            </div>
          </div>
        )}
        <DragDropContext
          onDragEnd={(res) => {
            const dt = res.destination;
            if (!dt) {
              return;
            }

            const newItems = [...songs];
            const [removed] = newItems.splice(res.source.index, 1);
            newItems.splice(dt.index, 0, removed);
            setSongs(newItems);
          }}
        >
          <Droppable droppableId="t1">
            {(dropProv, dropSnap) => (
              <div {...dropProv.droppableProps} ref={dropProv.innerRef}>
                {dropProv.placeholder}
                {songs.map((el, i) => {
                  return (
                    <Draggable draggableId={el.id} index={i} key={el.id}>
                      {(draggableProv, draggableSnap) => {
                        return (
                          <div
                            {...draggableProv.draggableProps}
                            {...draggableProv.dragHandleProps}
                            ref={draggableProv.innerRef}
                            className="flex flex-col gap-y-3"
                          >
                            <div className="w-full flex flex-row justify-between rounded-md p-2 items-center my-4 gap-x-3 hover:bg-gradient-to-br from-violet-500 to-indigo-500">
                              <SongImg {...el} />
                              <div className=" flex my-4 flex-col w-full">
                                <div>{el.title}</div>
                                <div className="text-gray-500">{el.info}</div>
                              </div>
                              {
                                <button
                                  className="btn btn-circle hover:border-none hover:bg-transparent  border-none bg-transparent"
                                  onClick={() => {
                                    const prev = [...songs].filter(
                                      (el, j) => j !== i
                                    );
                                    setSongs(prev);
                                  }}
                                >
                                  <IoMdTrash />
                                </button>
                              }
                            </div>
                          </div>
                        );
                      }}
                    </Draggable>
                  );
                })}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {songs.length > 0 && (
          <div className="w-full">
            <button
              onClick={() => {
                const prevPlaylists = storedPlaylists;
                const prevSongs = storedSongs;
                let newSongs = [...prevSongs, ...songs];
                const deduplicatedSongs = deduplicateSongs(newSongs);
                setStoredSongs(deduplicatedSongs);
                if (editing) {
                  const idx = storedPlaylists.findIndex(
                    (el) => el.id === editing.id
                  );
                  const newPlaylists = [...storedPlaylists];
                  newPlaylists[idx] = {
                    id: editing.id,
                    background_img: songs[0].background_img,
                    lastPlayed: songs[0].lastPlayed,
                    songs,
                    name: ref.current?.value || '',
                  };

                  setStoredPlaylists(newPlaylists);

                  toast.success('Playlist edited..');
                  return;
                }
                if (songs.length === 1) {
                  toast.success('Song added');
                  return;
                }

                const newPlaylists: Playlist[] = [
                  ...prevPlaylists,
                  {
                    id: crypto.randomUUID(),
                    background_img: songs[0].background_img,
                    lastPlayed: songs[0].lastPlayed,
                    songs,
                    name: ref.current?.value || 'Untitled Playlist',
                  },
                ];

                setStoredPlaylists(newPlaylists);

                toast.success('Playlist & Songs added');
              }}
              className="btn btn-outline rounded-sm  w-full"
            >
              Add playlist & Song(s)
            </button>
          </div>
        )}
      </div>
      <Toast />
    </div>
  );
};

export default AddMusic;
