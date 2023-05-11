import Player from '@/components/Player';
import SongPlaylistCard from '@/components/SongPlaylistCard';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import React from 'react';
import useLocalStore from 'renderer/hooks/useLocalStore';
import useAppStore from 'renderer/hooks/useStore';

const Home = () => {
  const [songs, playlists] = useLocalStore();
  const [par, _] = useAutoAnimate();
  return (
    <div ref={par} className="text-2xl overflow-x-hidden">
      <div>Home</div>
      {(songs.length > 0 || playlists.length > 0) && (
        <div className="w-full h-full flex gap-x-6">
          <div className="w-full  basis-0">
            <div className="flex flex-col  gap-y-5">
              <div className="text-xl my-6 px-2">Recently played songs</div>
              {songs
                .slice(0, 4)
                .sort((a, b) => a.lastPlayed - b.lastPlayed)
                .map((el, i) => {
                  return <SongPlaylistCard {...el} expanded={false} key={i} />;
                })}
              {songs.length === 0 && <div> No songs available </div>}
            </div>
          </div>
          <div className="w-full basis-0">
            <div className="flex flex-col items-start  gap-y-5">
              <div className="text-xl my-6 px-2 ">
                Recently played playlists
              </div>
              {playlists.map((el, i) => {
                return (
                  <SongPlaylistCard
                    {...el}
                    expanded={false}
                    key={i}
                  ></SongPlaylistCard>
                );
              })}

              {playlists.length === 0 && <div> No playlists available </div>}
            </div>
          </div>
        </div>
      )}
      {songs.length == 0 && playlists.length == 0 && (
        <div className="w-full text-xl text-gray-500 h-full absolute top-0 left-0 flex items-center justify-center">
          {'No songs available, press + to add songs'}
        </div>
      )}
    </div>
  );
};

export default Home;
