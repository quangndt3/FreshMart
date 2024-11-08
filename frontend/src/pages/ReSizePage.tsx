import { resizeLogo } from '../constants/imageUrl';

const ReSizePage = () => {
   return (
      <div className='w-full bg-white h-screen fixed top-0 z-[999] left-0 flex justify-center items-center flex-col p-3 text-center'>
         <img src={resizeLogo} alt='Resize your device please!' className='w-[60%] object-cover ' />
         <p className='text-greenPrimary font-bold text-xl'>Hãy xoay ngang thiết bị để có trải nghiệm tốt hơn !</p>
      </div>
   );
};

export default ReSizePage;
