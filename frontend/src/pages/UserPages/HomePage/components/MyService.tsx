import { BsTruck, BsCurrencyDollar } from 'react-icons/bs';
import { FaHeadphones } from 'react-icons/fa6';
import { GiFruitBowl } from "react-icons/gi";
const MyService = () => {
   return (
      <div className=''>
         <section className='section-services lg:my-[100px] md:my-[80px] max-md:my-[60px]'>
            <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
               <div className='list-service flex flex-wrap lg:justify-between md:justify-around md:gap-y-[30px] max-md:gap-[12px]'>
                  <div className='service-item max-md:w-full p-[20px] border-[1px] border-[rgba(0,0,0,10%)] lg:w-[calc(25%-30px)]  md:w-[calc(50%-30px)] rounded-[5px] flex items-center'>
                     <div className='service-icon text-[#51A55C] text-[30px]'>
                        <BsTruck></BsTruck>
                     </div>
                     <div className='service-text ml-[20px]'>
                        <p className='service-title text-[#333333] font-bold text-[18px]'>Giao hàng uy tín</p>
                        <p className='text-[16px]'>Đảm bảo giao đến tận nơi</p>
                     </div>
                  </div>
                  <div className='service-item max-md:w-full p-[20px] border-[1px] border-[rgba(0,0,0,10%)] lg:w-[calc(25%-30px)]  md:w-[calc(50%-30px)] rounded-[5px] flex items-center'>
                     <div className='service-icon text-[#51A55C] text-[30px]'>
                        <BsCurrencyDollar></BsCurrencyDollar>
                     </div>
                     <div className='service-text ml-[20px]'>
                        <p className='service-title text-[#333333] font-bold text-[18px]'>Giá cả hợp lý</p>
                        <p className='text-[16px]'>Giá cả phù hợp</p>
                     </div>
                  </div>
                  <div className='service-item max-md:w-full p-[20px] border-[1px] border-[rgba(0,0,0,10%)] lg:w-[calc(25%-30px)]  md:w-[calc(50%-30px)] rounded-[5px] flex items-center'>
                     <div className='service-icon text-[#51A55C] text-[30px]'>
                        <FaHeadphones></FaHeadphones>
                     </div>
                     <div className='service-text ml-[20px]'>
                        <p className='service-title text-[#333333] font-bold text-[18px]'>Hỗ trợ trực tuyến 24/7</p>
                        <p className='text-[16px]'>Hỗ trợ khách hàng nhiệt tình</p>
                     </div>
                  </div>
                  <div className='service-item max-md:w-full p-[20px] border-[1px] border-[rgba(0,0,0,10%)] lg:w-[calc(25%-30px)]  md:w-[calc(50%-30px)] rounded-[5px] flex items-center'>
                     <div className='service-icon text-[#51A55C] text-[30px]'>
                       <GiFruitBowl></GiFruitBowl>
                     </div>
                     <div className='service-text ml-[20px]'>
                        <p className='service-title text-[#333333] font-bold text-[18px]'>Trái cây chất lượng cao</p>
                        <p className='text-[16px]'>Đạt chuẩn chất lượng</p>
                     </div>
                  </div>
               </div>
            </div>
         </section>
      </div>
   );
};

export default MyService;
