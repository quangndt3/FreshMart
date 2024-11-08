import { useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import '../../../../css/productdetailpage.css';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Swiperz from 'swiper';
import { IImageResponse } from '../../../../interfaces/image';

export default function ProductThumbsGallery({ body }: IImageResponse) {
   const [thumbsSwiper, setThumbsSwiper] = useState<Swiperz | null>(null);
   return (
      <>
         <Swiper
            loop={true}
            navigation={true}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper['destroyed'] ? thumbsSwiper : null }}
            modules={[FreeMode, Navigation, Thumbs]}
            className='mySwiper2 product-detail-slide rounded-[5px]'
         >
            {body?.map((item) => {
               return (
                  <SwiperSlide
                     className='border  sm:h-[527px] max-sm:h-[400px] border-[#e2e2e2] max-h-[400px]'
                     key={item.public_id}
                  >
                     <img className='w-full h-full rounded-[5px]' src={item.url} />
                  </SwiperSlide>
               );
            })}
         </Swiper>

         <Swiper
            onSwiper={setThumbsSwiper}
            slidesPerView={4}
            spaceBetween={10}
            breakpoints={{
               480: {
                  slidesPerView: 4
               },
               478: {
                  slidesPerView: 3
               },
               0: {
                  slidesPerView: 3
               }
            }}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className='mySwiper product-sub-img sm:mx-[35px] max-sm:mx-[10px] sm:mt-[30px] max-sm:mt-[15px]'
         >
            {body?.map((item) => {
               return (
                  <>
                     <SwiperSlide className='cursor-pointer w-[115px] h-[140px]'>
                        <img className=' h-full w-full  rounded-[5px]' src={item.url} />
                     </SwiperSlide>
                  </>
               );
            })}
         </Swiper>
      </>
   );
}
