// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';
const BANNER_URL = [
   'https://theme.hstatic.net/200000528965/1001037678/14/slide_1_img.jpg?v=965',
   'https://theme.hstatic.net/200000528965/1001037678/14/slide_1_img.jpg?v=965',
   'https://theme.hstatic.net/200000528965/1001037678/14/slide_2_img.jpg?v=965',
   'https://theme.hstatic.net/200000528965/1001037678/14/slide_3_img.jpg?v=965'
];
export default function BannerHomePage() {
   return (
      <>
         <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
            <Swiper
               slidesPerView={1}
               spaceBetween={30}
               loop={true}
               autoplay={{
                  delay: 3000,
                  disableOnInteraction: false
               }}
               modules={[Pagination, Autoplay]}
               className='mySwiper'
            >
               {BANNER_URL.map((url) => (
                  <SwiperSlide>
                     <div className='banner-item w-full max-h-[500px]'>
                        <img
                           className='w-full h-full max-md:object-cover max-md:object-left object-cover'
                           src={url}
                           alt='banner'
                        />
                     </div>
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>
      </>
   );
}
