import { Link } from 'react-router-dom';

const BannerSales = () => {
   return (
      <div>
         <section className='section-banner xl:py-[80px] lg:py-[80px] max-lg:py-[60px]'>
            <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
               <div className='banner-content flex flex-wrap  md:gap-[30px] max-md:gap-[12px] justify-between'>
                  <div className='banner-item md:w-[calc(50%-15px)] max-md:w-[100%] '>
                     <Link to='/collections' className='banner-img flex items-center relative'>
                        <img
                           className='w-full rounded-[5px]'
                           src='https://spacingtech.com/html/tm/freozy/freezy-ltr/image/banner/banner-1.png'
                           alt=''
                        />
                        <div className='banner-text absolute m-w-[35%] max-lg:left-[15px] max-lg:max-w-full lg:left-[30px] '>
                           <p className='banner-sub-title  lg:text-[28px] md:text-[23px] sm:text-[28px] max-sm:text-[20px] font-bold text-[#333333] mt-[10px] '>
                              Hoa quả tươi
                           </p>
                           <Link to="/collections">
                           <p className=' inline-block hover:text-white xl:mt-[20px] max-xl:mt-[15px] text-[#51A55C] bg-white rounded-[50px] py-[10px] hover:bg-[#7aa32a] transition-colors duration-500   px-[30px] font-bold text-[16px] '>
                              MUA NGAY
                           </p>
                           </Link>
                          
                        </div>
                     </Link>
                  </div>
                  <div className='banner-item md:w-[calc(50%-15px)] max-md:w-[100%]   '>
                     <Link to='/collections' className='banner-img flex items-center relative'>
                        <img
                           className='w-full rounded-[5px]'
                           src='https://spacingtech.com/html/tm/freozy/freezy-ltr/image/banner/banner-2.png'
                           alt=''
                        />
                        <div className='banner-text absolute m-w-[35%] max-lg:left-[15px] max-lg:max-w-full lg:left-[30px] '>
                           <p className='banner-sub-title   lg:text-[28px] md:text-[23px] sm:text-[28px] max-sm:text-[20px] font-bold text-[#333333] mt-[10px] '>
                              Hoa quả tươi
                           </p>
                           <Link to="/collections">
                           <p className=' inline-block hover:text-white xl:mt-[20px] max-xl:mt-[15px] text-[#51A55C] bg-white rounded-[50px] py-[10px] hover:bg-[#7aa32a] transition-colors duration-500   px-[30px] font-bold text-[16px] '>
                              MUA NGAY
                           </p>
                              </Link>
                 
                        </div>
                     </Link>
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
};

export default BannerSales;
