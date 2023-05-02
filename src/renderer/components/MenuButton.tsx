import React from 'react'

const btncls = 'btn btn-sm border-none btn-circle btn-outline'
const MenuButton = (

props:React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
& {
  children:[JSX.Element|string,JSX.Element|string]
}
) => {
  return (
      <div className='flex flex-col items-center justify-center'>
          <button {...props} className={`${btncls} ${props.className || ''}`}>
              {props.children[0]}
          </button>
          <div className='text-xs text-center'>
            {props.children[1]}
          </div>
      </div>
  )
}

export default MenuButton
