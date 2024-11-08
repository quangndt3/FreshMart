// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { BiSolidQuoteAltRight } from 'react-icons/bi';
import { Navigation, Autoplay } from 'swiper/modules';
import { useGetEvaluationBestRateLimitQuery } from '../../../../services/evaluation.service';
import { ConfigProvider, Rate } from 'antd';

export default function SlideEvaluate() {
   const {data} = useGetEvaluationBestRateLimitQuery()
   return (
      <>
         <div className=' mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
            <Swiper
               slidesPerView={2}
               spaceBetween={30}
               navigation={true}
               rewind={true}
               autoplay={{
                  delay: 4000,
                  disableOnInteraction: false
               }}
               breakpoints={{
                  1200: {
                     slidesPerView: 2
                  },
                  1: {
                     slidesPerView: 1
                  }
               }}
               modules={[Navigation, Autoplay]}
               className='mySwiper py-[30px] max-sm:py-[70px] h-[295px] max-sm:h-auto'
            >
               {data?.body.data.map(item=>{
                  return<>
                        <SwiperSlide >
                  <div className='evaluate-wrap group '>
                     <div className='evaluate-item flex items-center max-sm:flex-wrap max-sm:justify-center max-sm:px-[10px]'>
                        <span className='customer-img rounded-[50%]  sm:mr-[30px] flex justify-center items-center   relative pb-[20px] '>
                           <img
                              className='min-w-[155px] max-h-[155px] max-w-[155px] min-h-[155px] max-sm:w-[155px] max-sm:h-[155px] rounded-[50%]'
                              src={item.userId?.avatar}
                              alt=''
                           />
                           <span className='evaluate-icon absolute w-[40px] h-[40px] flex items-center justify-center text-white rounded-[50%] bg-[#51A55C] bottom-0'>
                              <BiSolidQuoteAltRight></BiSolidQuoteAltRight>
                           </span>
                        </span>
                        <div className='evaluate-content text-left max-w-[70%] max-md:w-full max-sm:text-center'>
                        <p dangerouslySetInnerHTML={{__html: item.content }} className='review-text mt-[18px]'>
                
                </p> 
                <ConfigProvider
                        theme={{
                           token: {
                              controlHeightLG: 35
                           }
                        }}
                     >
                        <Rate allowHalf disabled value={item.rate} />
                       
                     </ConfigProvider>
                           <p className='evaluate-title font-bold text-[#51A55C] sm:mt-[30px] max-sm:mt-[10px] text-[16px] max-sm:text-center'>
                           {item.userName!= null ? item.userName : item.userId?.userName}
                           </p>
                        </div>
                     </div>
                  </div>
               </SwiperSlide>
                  </>
               })}
         
           
            </Swiper>
         </div>
      </>
   );
}
