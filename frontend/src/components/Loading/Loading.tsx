import { Spin } from 'antd'
import FlowerIcon from '../Icons/FlowerIcon'
type Props = {
   sreenSize?: 'md' | 'lg'
}
const Loading = ({ sreenSize }: Props) => {
   const flowerIcon = <FlowerIcon className='spin' />
   return (
      <div
         className={`flex justify-center items-center w-full h-full relative ${sreenSize === 'md' && 'min-h-[500px]'} ${
            sreenSize === 'lg' && 'min-h-[1000px]'
         }`}
      >
         <Spin
            size='large'
            indicator={flowerIcon}
            className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
         />
      </div>
   )
}

export default Loading
