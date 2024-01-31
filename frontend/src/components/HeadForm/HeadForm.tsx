import { useEffect, useState } from 'react';
import { Form } from 'antd';
import { Link } from 'react-router-dom';
type Props = {
   placeHolder: string;
   onSubmit?: () => void;
   changeValue?: (value: string) => void;
   linkBack: string;
   initValue?: string;
   disabled?: boolean;
   hasName?: boolean;
};

const HeadForm = ({
   hasName = true,
   disabled = false,
   placeHolder,
   changeValue,
   linkBack,
   initValue,
   onSubmit
}: Props) => {
   const [value, setValue] = useState<string>(initValue || '');
   useEffect(() => {
      if (!initValue) return;
      setValue(initValue);
   }, [initValue]);
   return (
      <div className='flex justify-between items-center w-full relative '>
         {hasName && (
            <input
               onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setValue(e.target.value);
                  changeValue && changeValue(e.target.value);
               }}
               disabled={disabled}
               value={value}
               type='text'
               placeholder={placeHolder}
               className='hidden underline-offset-[11px] font-semibold text-[rgba(0,0,0,0.5)] text-[3rem] outline-none border-none bg-transparent decoration-greenPri600 hover:underline hover:decoration-dashed decoration-1 focus:underline focus:decoration-solid max-w-[50%]'
            />
         )}
         <div className='flex justify-end items-center gap-5 absolute right-0 mb-5'>
            <Link to={linkBack}>
               <button
                  type='button'
                  className='border-[1px] border-[#80b235] text-greenPrimary py-2 px-5 rounded-xl font-semibold text-[1rem] hover:bg-greenPrimary duration-200 hover:text-white'
               >
                  Hủy
               </button>
            </Link>
            <Form.Item className='flex flex-col items-center !mb-0'>
               <button
                  onClick={onSubmit}
                  className='!bg-greenPrimary !text-white py-2 px-5 rounded-xl font-semibold text-[1rem]'
                  type='submit'
               >
                  Lưu
               </button>
            </Form.Item>
         </div>
      </div>
   );
};

export default HeadForm;
