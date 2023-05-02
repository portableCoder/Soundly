import React from 'react'
import MenuButton from './MenuButton'
import Home from 'renderer/pages/Home'
import Player from './Player'
import useAppStore from 'renderer/hooks/useStore'
import { IoMdAdd, IoMdBook, IoMdHeart, IoMdHome, IoMdMusicalNote } from 'react-icons/io'
interface MenuProps {
  onSelect:(sel:number)=>void
}
const Icons = [<IoMdHome/>,<IoMdAdd/>,<IoMdMusicalNote/>, <IoMdBook/>,<IoMdHeart/>]
const Texts = ['Home','Add Music', 'Currently Playing', 'Song Library', 'Favorites']
const Menu = ({onSelect}:MenuProps) => {
  return (
          <div className='flex flex-col items-center py-8   gap-y-5 w-16 border-r border-gray-800 h-full bg-zinc-900'>
            {Icons.map((el,i)=><div key={i}>
              <MenuButton key={i} onClick={()=>{
                onSelect(i)
              }}>
                {el}
                <>
                  {Texts[i]}
                </>
              </MenuButton>
            </div>)}

      </div>
  )
}

export default Menu