import { Checkbox, ConfigProvider, Space } from 'antd';
import InputRange from './PriceInput';
import { FilterOutlined } from '@ant-design/icons';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useGetAllCateQuery } from '../../../../services/cate.service';
import { useContext, useState, useEffect } from 'react';
import { FilterFieldContext } from '../ProductPage';
import { getOriginData } from '../../../../api/origin';
import { IOrigin } from '../../../../interfaces/origin';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { useNavigate } from 'react-router-dom';
const FillterProducts = () => {
   const { data } = useGetAllCateQuery({});
   const filter = useContext(FilterFieldContext);
   const [origins, setOrigins] = useState<IOrigin[]>([]);
   useEffect(() => {
      (async () => {
         try {
            const { data } = await getOriginData();
            setOrigins(data.body.data);
         } catch (error) {
            console.log(error);
         }
      })();
   }, []);
   const navigate = useNavigate();
   const setCategoryId = (cate_id: string) => {
      if (filter.setfield) {
         filter.setfield({
            ...filter,
            field: {
               ...filter.field,
               category: cate_id
            }
         });
      }

      cate_id != '' ? navigate('/collections?cate_id=' + cate_id) : navigate('/collections');
   };
   const showSub = (name: string, afterName: string) => {
      const cate_title = document.querySelector(afterName);
      cate_title?.classList.toggle('after:!rotate-[225deg]');
      cate_title?.classList.toggle('after:bottom-[-8px]');
      const categories = document.querySelector(name);
      categories?.classList.toggle(`lg:!h-[53px]`);
      categories?.classList.toggle(`max-lg:!h-[47px]`);
   };
   const showFilter = () => {
      const main_header = document.querySelector('.main-header-filter');
      main_header?.classList.toggle('max-lg:!translate-y-[0%]');
      const main_header_overlay = document.querySelector('.main-header-overlay');
      main_header_overlay?.classList.toggle('hidden');
   };
   const onChange = (e: CheckboxChangeEvent) => {
      if (filter.setfield) {
         if (e.target.checked) {
            filter.setfield({
               ...filter,
               field: {
                  ...filter.field,
                  origin: filter.field.origin ? filter.field.origin + ',' + e.target.value : e.target.value
               }
            });
         } else {
            const temp = filter.field.origin?.split(',');
            const filterOriginId = temp?.filter((string: string) => string !== e.target.value);
            const newOriginId = filterOriginId?.join(',');
            filter.setfield({
               ...filter,
               field: {
                  ...filter.field,
                  origin: newOriginId
               }
            });
         }
      }
   };
   return (
      <div className='main-header-filter lg:mt-[20px] lg:bg-[#f8f8f8] max-lg:!mt-[-120px] max-lg:flex max-lg:flex-col max-lg:pb-[50px]  overflow-y-auto max-lg:bottom-0 max-lg:translate-y-[130%] transition-transform duration-500 max-lg:right-0 max-lg:left-0  lg:mx-[-15px] lg:sticky w-[25%] top-[120px]  max-lg:w-[100%] max-lg:fixed max-lg:z-[13] bg-white  max-md:p-0 '>
         <div className='main-header-title  lg:hidden px-[10px] py-[5px] bg-red-500 flex justify-between items-center'>
            <div>
               <FilterOutlined className='text-white' />
               <span className='font-bold text-white ml-[10px]'>Bộ lọc</span>
            </div>

            <AiOutlineCloseCircle onClick={showFilter} className='text-white text-[28px]'></AiOutlineCloseCircle>
         </div>
         <div className='max-lg:overflow-y-auto max-lg:px-[10px] max-lg:pt-[10px] lg:px-[5px]'>
            
            <div
               className={`categories   overflow-hidden   transition-all duration-200 ease-linear   pb-[30px] mb-[30px] shadow-[0_0_3px_rgba(0,0,0,0.08)] rounded-[4px]`}
            >
               <div
                  className='group'
                  onClick={() => {
                     showSub('.categories', '.cate-title');
                  }}
               >
                  <h1 className=' cursor-pointer cate-title max-lg:text-[14px]   after:transition-transform after:duration-200  font-bold text-[18px] px-[10px] py-[13px] after:content-[""] relative after:top-[-15px] after:bottom-0 after:right-[13px] after:m-auto after:border-[#666] after:border-t-[0px] after:border-r-[1px] after:border-b-[1px] after:border-l-[0px] after:w-[8px] after:h-[8px] after:absolute after:translate-y-[50%] after:rotate-[45deg]'>
                     Danh mục
                  </h1>
               </div>
               <div className='list-categories p-[10px]  border-t-[1px] border-[#eae4e8] gap-y-[20px] flex max-lg:gap-y-[15px] flex-col max-lg:flex-wrap max-lg:flex-row  '>
                  <div
                     onClick={() => setCategoryId('')}
                     style={{
                        background: filter.field.category == '' ? '#51A55C' : '',
                        color: filter.field.category == '' ? 'white' : '',
                        borderRadius: filter.field.category == '' ? '2px' : ''
                     }}
                     className='max-lg:w-[25%] max-lg:flex max-lg:flex-col max-lg:items-cente hover:text-[#51A55C] py-2 px-3'
                  >
                     <button type='button'>
                        <img className='w-[48px] h-[48px] cate-img hidden m-auto max-lg:block' src={'sdasd'} alt='' />
                        <span className='max-lg:text-[12px] text-center '>Tất cả</span>
                     </button>
                  </div>
                  {data?.body.data.map((item) => {
                     return (
                        <>
                           <div
                              onClick={() => setCategoryId(item._id)}
                              style={{
                                 background: filter.field.category == item._id ? '#51A55C' : '',
                                 borderRadius: filter.field.category == item._id ? '2px' : '',
                                 color: filter.field.category == item._id ? 'white' : ''
                              }}
                              className='max-lg:w-[25%] max-lg:flex max-lg:flex-col max-lg:items-center  hover:text-[#51A55C] py-2 px-3'
                           >
                              <button type='button' className='flex items-center flex-col'>
                                 <img
                                    className='w-[48px] h-[48px] cate-img hidden max-lg:block'
                                    src={item.image?.url}
                                    alt=''
                                 />
                                 <span className='max-lg:text-[12px] text-center '> {item.cateName}</span>
                              </button>
                           </div>
                        </>
                     );
                  })}
               </div>
            </div>
            <div
               className={`origin h-[${
                  32 * 6
               }px]   overflow-hidden    transition-all duration-200 ease-linear   pb-[30px] mb-[30px] shadow-[0_0_3px_rgba(0,0,0,0.08)] rounded-[4px]`}
            >
               <div className='group' onClick={() => showSub('.origin', '.origin-title')}>
                  <h1 className=' cursor-pointer origin-title  max-lg:text-[14px]   after:transition-transform after:duration-200  font-bold text-[18px] px-[10px] py-[13px] after:content-[""] relative after:top-[-15px] after:bottom-0 after:right-[13px] after:m-auto after:border-[#666] after:border-t-[0px] after:border-r-[1px] after:border-b-[1px] after:border-l-[0px] after:w-[8px] after:h-[8px] after:absolute after:translate-y-[50%] after:rotate-[45deg]'>
                     Xuất xứ
                  </h1>
               </div>

               <div className='list-origin p-[10px] border-t-[1px] border-[#eae4e8] gap-y-[20px] flex max-lg:gap-y-[20px] flex-col max-lg:flex-wrap max-lg:flex-row  '>
                  <form action='' className='origin-form flex flex-col gap-y-[10px]'>
                     <ConfigProvider
                        theme={{
                           token: {
                              colorPrimary: '#51A55C'
                           }
                        }}
                     >
                        {origins.map((item) => {
                           return (
                              <>
                                 <Checkbox
                                    onChange={(e) => onChange(e)}
                                    className='font-[500] font-Quicksand'
                                    value={item._id}
                                 >
                                    {item.name}
                                 </Checkbox>
                              </>
                           );
                        })}
                     </ConfigProvider>
                  </form>
               </div>
            </div>
            <div className={` pb-[30px] mb-[30px] shadow-[0_0_3px_rgba(0,0,0,0.08)] rounded-[4px]`}>
               <div className='group'>
                  <h1 className=' cursor-pointer origin-title  max-lg:text-[14px]    font-bold text-[18px] px-[10px] py-[13px] after:content-[""] relative after:top-[-15px] '>
                     Lọc theo giá
                  </h1>
               </div>

               <div className='filter-price p-[10px] border-t-[1px] border-[#eae4e8] gap-y-[20px] flex max-lg:gap-y-[20px] flex-col max-lg:flex-wrap max-lg:flex-row  '>
                  <ConfigProvider
                     theme={{
                        token: {
                           // Seed Token
                           colorPrimary: '#00b96b',
                           borderRadius: 5
                        }
                     }}
                  >
                     <Space style={{ width: '100%' }} direction='vertical'>
                        <InputRange></InputRange>
                     </Space>
                  </ConfigProvider>
               </div>
            </div>
         </div>
         <div className='main-header-bottom flex justify-between lg:hidden bg-white fixed bottom-0 px-[5px] pt-[10px] py-[12px] border-t-[1px] border-[#eae4e8] w-full'>
            <button
               onClick={showFilter}
               className='text-[13px] font-[500] bg-[#f3f4f6] border-[1px] border-[#e5e7eb] text-center py-[10px] px-[15px] cursor-pointer block rounded-[2px] outline-none w-[calc(50%-12px)] bg-[] '
            >
               HUỶ
            </button>
            <button   onClick={showFilter} className='text-[13px] text-white font-[500] bg-[#51A55C]  border-[1px] border-[#e5e7eb] text-center py-[10px] px-[15px] cursor-pointer block rounded-[2px] outline-none w-[calc(50%-12px)] bg-[] '>
               ÁP DỤNG
            </button>
         </div>
      </div>
   );
};

export default FillterProducts;
