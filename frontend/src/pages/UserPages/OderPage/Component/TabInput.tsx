import { useState } from 'react';
import { Radio, Input } from 'antd';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const InputComponent = ({ inputs }: { inputs: any[] }) => {
   const [input, setInput] = useState(inputs[0]);
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const handleClick = (id: any) => {
      setInput(inputs[id]);
   };

   return (
      <div>
         <div className='mb-5'>
            <Radio.Button onClick={() => handleClick(3)}>Ngày mua</Radio.Button>
            <Radio.Button onClick={() => handleClick(4)}>Mã đơn hàng</Radio.Button>
         </div>
         <div>
            <form action=''>
               <Input className='w-[40%]' type='text' value={input.value} placeholder={input.label} />
            </form>
         </div>
      </div>
   );
};

export default InputComponent;
