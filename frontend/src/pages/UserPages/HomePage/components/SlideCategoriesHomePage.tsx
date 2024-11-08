// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Autoplay } from 'swiper/modules';
import { useGetAllCateQuery } from '../../../../services/cate.service';
import { Link } from 'react-router-dom';

export default function SlideCateHomePage() {
  const {data} = useGetAllCateQuery({})
  return (
    <>
     <div className=' mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
     <Swiper
        slidesPerView={4}
        spaceBetween={30}
        loop={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
          breakpoints={{
            1201:{
              slidesPerView:4,
            } ,
            1200:{
              slidesPerView:3,
            } ,
            767:{
              slidesPerView:3,
            },
            766:{
              slidesPerView:2,
            },
            400:{
              slidesPerView:2,
            },
            1:{
              slidesPerView:1,
            }
          }}
        modules={[Autoplay]}
       
        className="mySwiper py-[30px] h-[140px]"
      >
        {data?.body.data.map(item=>{
          return<>

          <SwiperSlide>
            <div className="cate-wrap group">
              <Link to={'/collections?cate_id=' + item._id} className='cate-item flex items-center'>
          <span className='cate-icon rounded-[50%] bg-[#F8F8F8] mr-[30px] h-[80px] w-[80px] block'>
            <img className='h-[80px] w-[80px]' src={item.image.url} alt="" />
          </span>
          <div className="cate-content text-left">
              <p className='cate-title font-bold text-[#51A55C] text-[16px]'>{item.cateName}</p>
              <p className='cate-count text-[#333333] pt-[5px] text-[16px] group-hover:text-[#51A55C] transition-colors duration-300'>{item.products.length} sản phẩm</p>
          </div>
              </Link>
            </div>
          </SwiperSlide> 
            
          </>
        })}
       
      </Swiper>
     </div>
      
    </>
  );
}
