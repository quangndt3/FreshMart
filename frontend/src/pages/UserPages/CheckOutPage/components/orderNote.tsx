import { useFormContext } from "react-hook-form";

const OrderNote = () => {
   const { register } = useFormContext();
   return (
      <>
         <div className='order-note'>
            <form action=''>
               <h2 className='form-title text-[26px] text-[#333333] font-bold max-sm:text-[22px]'>Ghi chú đơn hàng</h2>
               <div className='order-form mt-[24px]'>
                  <div className='order-form-item mt-[15px]'>
                     <label>
                        <textarea
                           className='w-full resize-none mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[5px]'
                           id=''
                           cols={30}
                           rows={10}
                           {...register('note')}
                        ></textarea>
                     </label>
                  </div>
               </div>
            </form>
         </div>
      </>
   );
};

export default OrderNote;
