/* eslint-disable @typescript-eslint/ban-types */
import { Slider } from 'antd';
import { useContext } from 'react';
import { FilterFieldContext } from '../ProductPage';

const debounce = (func: Function, delay: number) => {
   let timeoutId: NodeJS.Timeout;

   return (...args: any[]) => {
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
         func(...args);
      }, delay);
   };
};

const InputRange: React.FC = () => {
   const filter = useContext(FilterFieldContext);
   const changePrice = (value: [number, number]) => {
      if (filter.setfield) {
         filter.setfield({
            ...filter,
            field: {
               ...filter.field,
               minPrice: value[0],
               maxPrice: value[1]
            }
         });
      }
   };
   const handleChange = debounce(changePrice, 500);

   return (
      <>
         {filter.field.minPriceOfAllProducts && filter.field.maxPriceOfAllProducts && (
            <Slider
               // onChange={(current: [number, number]) => handleChange(current)}
               onChange={(value: number[]) => handleChange(value)}
               step={10000}
               range={{ draggableTrack: true }}
               min={filter.field.minPriceOfAllProducts}
               max={filter.field.maxPriceOfAllProducts}
               defaultValue={[filter.field.minPriceOfAllProducts, filter.field.maxPriceOfAllProducts]}
            />
         )}

         <br />
         <div className='flex justify-between'>
            <span>
               {filter.field.minPriceOfAllProducts?.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
               })}
            </span>

            <span>
               {filter.field.maxPriceOfAllProducts?.toLocaleString('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
               })}
            </span>
         </div>
      </>
   );
};
export default InputRange;
