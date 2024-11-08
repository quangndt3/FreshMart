// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Pagination } from 'swiper/modules';
import { IImage } from '../../../../interfaces/image';
interface IProps{
   body:IImage[]
}
export default function ModalProductSlide({ body }:IProps ) {
   if (!body) {
      return null;
   }
   return (
      <>
         <Swiper
            pagination={{ clickable: true }}
            navigation={true}
            modules={[Navigation, Pagination]}
            loop={true}
            className='mySwiper quickview h-[397px]'
         >
            {body?.map((item) => {
               return (
                  <>
                     <SwiperSlide>
                        <img className=' w-[298px] h-[362px] object-fill m-auto' src={item.url} alt='' />
                     </SwiperSlide>
                  </>
               );
            })}
         </Swiper>
      </>
   );
}
