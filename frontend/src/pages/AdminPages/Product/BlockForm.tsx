import { Divider } from 'antd'
import React from 'react'

type Props = {
    children:React.ReactElement,
    title:string,
    className?:string
}

const BlockForm = (props: Props) => {
  return (
<div className={`bg-white  rounded-lg p-5 ${props.className}`}>
    <p className='text-[1.5rem] font-semibold text-blue-950'>{props.title}</p>
    <Divider />
       {props.children}
 </div>
  )
}

export default BlockForm