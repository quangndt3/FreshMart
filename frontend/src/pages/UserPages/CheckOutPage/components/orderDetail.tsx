import { useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { IAuth } from '../../../../slices/authSlice';
import { useEffect, useState } from 'react';

const OrderDetail = () => {
   const {
      register,
      formState: { errors },
      setValue,
   } = useFormContext();
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer.user);
   // const [provinces, setProvinces] = useState<any>({});
   // const [districtCode, setDistrictCode] = useState<any>(0);
   // const [wards, setWards] = useState<any>({});
   useEffect(() => {
      setValue('customerName', auth.userName);
      setValue('email', auth.email);
      setValue('phoneNumber', auth.phoneNumber);
      setValue('shippingAddress', auth.address);
   }, [auth]);
   // useEffect(() => {
   //    fetch('https://provinces.open-api.vn/api/p/1/?depth=2', {
   //       method: 'GET'
   //    })
   //       .then((res) => res.json())
   //       .then((res) => {
   //          setProvinces(res);
   //       });
   // }, []);

   // useEffect(() => {
   //    fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`, {
   //       method: 'GET'
   //    })
   //       .then((res) => res.json())
   //       .then((res) => {
   //          setWards(res);
   //       });
   // }, [districtCode]);
   // useEffect(() => {
   //    setValue('districtName', wards.name);
   // }, [wards]);
   // useEffect(() => {
   //    setDistrictCode(watch('districtCode'));
   // }, [watch('districtCode')]);

   return (
      <>
         <div className='order-detail'>
            <form action=''>
               <h2 className='form-title text-[26px] text-[#333333] font-bold max-sm:text-[22px]'>
                  Thông tin đơn hàng
               </h2>
               <div className='order-form mt-[24px]'>
                  <div className='order-form-item mt-[15px]'>
                     <label>
                        Họ và tên
                        <input
                           type='text'
                           {...register('customerName', { required: 'Họ và tên là trường bắt buộc' })}
                           className='w-full mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[5px]'
                           placeholder='Họ và tên'
                        />
                     </label>
                     {errors.customerName && (
                        <p className='error-message text-[13px] text-red-500'>
                           {errors?.customerName?.message?.toString()}
                        </p>
                     )}
                  </div>
                  <div className='order-form-item  double-input flex justify-between max-sm:flex-wrap'>
                     <div className='form-item mt-[15px] sm:w-[calc(50%-7px)] max-sm:w-full'>
                        <label>
                           Email
                           <input
                              type='text'
                              {...register('email', {
                                 required: 'Email là trường bắt buộc',
                                 validate: {
                                    validEmail: (value) => {
                                       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                                       if (!emailRegex.test(value)) {
                                          return 'Email không hợp lệ';
                                       }
                                    }
                                 }
                              })}
                              className='w-full mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[5px]'
                              placeholder='Email'
                           />
                        </label>
                        {errors.email && (
                           <p className='error-message text-[13px] text-red-500'>
                              {errors?.email?.message?.toString()}
                           </p>
                        )}
                     </div>
                     <div className='form-item mt-[15px] sm:w-[calc(50%-7px)] max-sm:w-full'>
                        <label>
                           Số điện thoại
                           <input
                              {...register('phoneNumber', {
                                 required: 'Số điện thoại là trường bắt buộc',
                                 pattern: {
                                    value: /^0\d{9,10}$/,
                                    message: 'Vui lòng nhập đúng định dạng số điện thoại'
                                 }
                              })}
                              type='text'
                              className='w-full mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[5px]'
                              placeholder='Số điện thoại'
                           />
                        </label>
                        {errors.phoneNumber && (
                           <p className='error-message text-[13px] text-red-500'>
                              {errors?.phoneNumber?.message?.toString()}
                           </p>
                        )}
                     </div>
                  </div>

                  <div className='order-form-item mt-[15px]'>
                     <label>
                        Địa chỉ
                        <input
                           {...register('shippingAddress', { required: 'Địa chỉ là trường bắt buộc' })}
                           type='text'
                           className='w-full mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[5px]'
                           placeholder='Ví dụ: Số 20, Ngõ 86, Phố Kiều Mai'
                        />
                     </label>
                     {errors.shippingAddress && (
                        <p className='error-message text-[13px] text-red-500'>
                           {errors?.shippingAddress?.message?.toString()}
                        </p>
                     )}
                  </div>
                  {/* <div className='flex justify-between mt-[10px] items-start   max-md:block'>
                     <div className='w-[30%] max-md:w-[100%] mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[5px]'>
                        {provinces.name}
                     </div>

                     <div className='flex flex-col w-[30%] max-md:w-[100%]'>
                        <select
                           {...register('districtCode', { required: 'Huyện là trường bắt buộc' })}
                           className=' mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[5px]'
                        >
                           <option value={''}>Huyện</option>
                           {provinces?.districts?.map((item: any) => {
                              return (
                                 <>
                                    <option value={item.code}>{item.name}</option>
                                 </>
                              );
                           })}
                        </select>
                        {errors.districtCode && (
                           <p className='error-message text-[13px] text-red-500'>
                              {errors?.districtCode?.message?.toString()}
                           </p>
                        )}
                     </div>
                     <div className='flex flex-col w-[30%] max-md:w-[100%]'>
                        <select
                           {...register('ward', { required: 'Xã là trường bắt buộc' })}
                           className=' mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[5px]'
                        >
                           <option value=''>Xã</option>
                           {wards?.wards?.map((item: any) => {
                              return (
                                 <>
                                    <option value={item.name}>{item.name}</option>
                                 </>
                              );
                           })}
                        </select>
                        {errors.ward && (
                           <p className='error-message text-[13px] text-red-500'>{errors?.ward?.message?.toString()}</p>
                        )}
                     </div>
                  </div> */}
               </div>
            </form>
         </div>
      </>
   );
};
export default OrderDetail;
