import getIdFromLink from '@/util/getIdFromLink'
import isValidLink from '@/util/isValidLink'
import 'react-toastify/dist/ReactToastify.css';
import  getVideoDetails from '@/util/getVideoDetails'
import React, { useRef, useState } from 'react'
import { IoMdAdd, IoMdCube, IoMdTrash } from 'react-icons/io'
import { Song } from 'renderer/types/Song'
import { ToastContainer, toast } from 'react-toastify'
import useLocalStore from 'renderer/hooks/useLocalStore'
import { Playlist } from 'renderer/types/Playlist'

const AddMusic = () => {
  const [songs,setSongs] = useState<Song[]>([])
  const ref = useRef<HTMLInputElement>(null)
  const [link,setLink] = useState('')
  const [isLoading,setLoading] = useState(false)
  const localStore = useLocalStore()

  return (
    <div className='h-screen'>
      Add Music
      <div className='flex gap-x-3'>
      <input value={link} disabled={isLoading} onChange={(e)=>setLink(e.target.value)} className='input w-full rounded-sm focus:outline-none border-2 focus:border-violet-500' placeholder='Add youtube link here..' />
      <button disabled={isLoading} onClick={async ()=>{
        if(isValidLink(link)){
          const p = [...songs]
          setLoading(true)
          getVideoDetails(getIdFromLink(link) as string).then((data)=>{
          p.push({
            background_img:data.thumbnail_url,
            lastPlayed:0,
            info:data.author_name,
            title:data.title,

            url:link
          })
          setLoading(false)
          setSongs(p)
          setLink('')
          }).catch((e)=>{
            setLoading(false)
              toast.error('An error occured...', {
              position: "top-right",
              autoClose: 1198,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              });
          })

        }
      }} className='btn  btn-md btn-square text-white'>
        { isLoading ? <IoMdCube/> :  <IoMdAdd/> }
      </button>
      </div>

      {!isValidLink(link) && <div className='text-red-500 text-md'> Invalid link. Please enter a proper one. </div>}


      <div className='my-6 flex flex-col gap-y-3 py-4 '>
        {          songs.length > 0  &&

        <div className='h-1/4 w-full relative bg-transparent'>
          <img className='h-full object-fill absolute z-0 top-0 left-0 w-full blur-2xl' src={songs[0].background_img}/>
          <div className='flex flex-row gap-x-3 items-end'>
          <img src={songs[0].background_img} className='w-64 h-64 object-cover z-50'/>
          {songs.length > 1 && <div className='text-4xl flex flex-col gap-y-3'>
            <input ref={ref} placeholder='Playlist Name..'  className='my-12 bg-transparent focus:outline-none rounded-sm  w-full  z-50'/>
          </div>}

            {songs.length == 1 && <div  className='my-12 bg-transparent focus:outline-none rounded-sm  w-full  z-50'>{songs[0].title}</div>}
          </div>
        </div>}
      {songs.map((el,i)=>{
      return <div  key={i} className='w-full hover:bg-slate-800'>
          <div className='w-full flex flex-row justify-between items-center gap-x-3'>
            <img className='w-32 h-32  rounded-md object-cover' src={el.background_img}/>
            <div className=' flex my-4 flex-col w-full'>
                      <div>
                        {el.title}
                      </div>
                      <div className='text-gray-500'>
                        {el.info}
                      </div>
              </div>
              {<button className='btn btn-circle  border-none bg-transparent' onClick={()=>{
                const prev = [...songs].filter((el,j)=>j!==i)
                setSongs(prev)

              }}><IoMdTrash/></button>}
          </div>

      </div>})
      }
      {songs.length > 0 && <div className='w-full'>
        <button onClick={()=>{
          const prevPlaylists = localStore.getPlaylists()
          const prevSongs = localStore.getSongs()
          let  newSongs  = [...prevSongs,...songs]
          let deduplicatedSongs = []
          let st = new Set()
          for(let s of newSongs){
            if(st.has(s.url)){
              continue
            }
            st.add(s.url)
            deduplicatedSongs.push(s)
          }

          localStore.setSongs(deduplicatedSongs)
          toast.success('Playlist/Song(s) added')
          if(ref.current?.value == ''){
            return
          }

          const newPlaylists : Playlist[] = [...prevPlaylists,{


            background_img:songs[0].background_img,
            lastPlayed:songs[0].lastPlayed,
            songs,
            name:ref.current?.value || ''
          }]

          localStore.setPlaylists(newPlaylists)

        }} className='btn btn-outline rounded-sm  w-full'>
            Add playlist & Song(s)
        </button>
      </div>}
</div>
<ToastContainer
position="top-right"
autoClose={1198}
hideProgressBar={false}
newestOnTop={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
/>
</div>

  )
}

export default AddMusic
