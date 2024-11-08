import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';

// import required modules
import { Grid, Autoplay } from 'swiper/modules';
import { ConfigProvider, Rate } from 'antd';
import { IProductExpanded } from '../../../../interfaces/product';
import { Link } from 'react-router-dom';
import { CountExpirationDate } from '../../../../helper';
interface IProps{
   slideName:string
   data: IProductExpanded[]|undefined
}
export default function SlideProductHomepage({slideName,data}:IProps) {

   
   return (
      <>
         <div className='featured-product-item lg:w-[calc(33%-10px)] max-lg:w-full    pt-[50px] '>
            <div className='fetured-title '>
               <p className='text-[#333333] text-[18px]  font-bold xl:mb-[50px]'>{slideName} </p>
            </div>
            <Swiper
               slidesPerView={1}
               grid={{
                  rows: 3
               }}
               autoplay={{
                   delay: 2500,
                   disableOnInteraction: false,
                 }}
               breakpoints={{
                1201: {
                   slidesPerView: 1,
                   grid:{
                    rows: 3
                 }
                },
                1200: {
                    slidesPerView: 1,
                    grid:{
                        rows: 3
                     }
                  
                },
                991 : {
                    slidesPerView: 1,
                    grid:{
                        rows: 1
                     }
                  
                },
                990: {
                    slidesPerView: 2,
                    grid:{
                        rows: 1
                     }
                },
                641: {
                   slidesPerView: 2,
                   grid:{
                    rows: 1
                 }
                },
                1: {
                    grid:{
                        rows: 1
                     },
                   slidesPerView: 1
                }
             }}
               spaceBetween={30}
               modules={[Grid, Autoplay]}
               className='mySwiper xl:h-[510px]   featured-product'
            >
               {data?.map(item=>{
                  return<>
               <SwiperSlide className='h-[29%] bg-white !mt-[20px]  '>
                  <Link to={"/products/"+item._id}>
                  <div className='featured-product-item-slide flex items-center gap-x-[10px] cursor-pointer'>
                     <div className='silde-img  '>
                        <img className='w-[149px] h-[149px]' src={item.images[0].url} alt='' />
                     </div>
                     <div className='slide-content flex flex-col w-[calc(100%-150px)] text-left'>
                        <div className='product-name text-[#333333] mb-[10px] font-bold xl:text-[18px] max-xl:text-[16px]'>{item.productName}</div>
                        <div className='rate'>
                           <ConfigProvider
                              theme={{
                                 token: {
                                    controlHeightLG: 34
                                 }
                              }}
                           >
                              <Rate allowHalf disabled defaultValue={4.5} />
                           </ConfigProvider>
                        </div>
                        <div className='price-box'>
                           <p className='price mt-[9px] flex items-center  font-bold md:mb-[20px] max-md:mb-[10px] md:text-[18px]  text-[#7aa32a]'>
                             {(item.price-(item.price*item.discount/100)).toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                           })}
                            {item.discount>0&&  <span className='old-price text-[#878c8f] line-through text-[13px] ml-[10px] font-normal'>
                                 {item.price.toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                           })}
                              </span>}
                           </p>
                        </div>
                        {item.isSale==true && <div className='price-box'>
                           <p className='price  flex items-center md:text-[16px] max-md:text-[14px]  text-gray-500'>
                            Hạn sử dụng sẽ hết sau: {CountExpirationDate(item?.shipments[0]?.date)} ngày
                 
                           </p>
                        </div>}
                     </div>
                     
                  </div>
                  </Link>
               </SwiperSlide>
                  </>
               })}
               
  
            </Swiper>
         </div>
      </>
   );
}