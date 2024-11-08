
import SlideEvaluate from './SlideEvaluate';

const HappyClient = () => {
   
   return (
      <div>
         <section className='section-evaluate  xl:py-[100px] lg:py-[80px] max-lg:py-[60px]'>
            <div className='evaluate -header text-center xl:mb-[70px] lg:mb-[40px] max-lg:mb-[30px]'>
               <p className='evaluate -title text-[#51A55C] font-bold mb-[10px]'>KHÁCH HÀNG ĐÁNH GIÁ</p>
               <p className=' text-[#333333] font-bold  lg:text-[28px] md:text-[23px]  max-md:text-[20px]'>
                  Khách hàng hạnh phúc nhận xét
               </p>
            </div>
            <div className='evaluate -content'>
               <div className='slide-evaluate'>
                  <SlideEvaluate></SlideEvaluate>
               </div>
            </div>
         </section>
      </div>
   );
};

export default HappyClient;
