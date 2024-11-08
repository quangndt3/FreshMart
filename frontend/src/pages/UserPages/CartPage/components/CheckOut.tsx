/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux';
import {
   ICartSlice,
   removeFromCart,
   setItem,
   updateImgProductInCartLocal,
   updateItem,
   updateNameProductInCartLocal,
   updateOriginProductInCartLocal,
   updatePriceProductInCartLocal,
   updateTotalPrice
} from '../../../../slices/cartSlice';
import { IAuth, deleteTokenAndUser } from '../../../../slices/authSlice';
import { useCheckCartMutation, useGetCartQuery } from '../../../../services/cart.service';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, message } from 'antd';
import { useCheckVoucherMutation, useGetVoucherUsefulMutation } from '../../../../services/voucher.service';
import { IVoucher, remoteVoucher, saveVoucher } from '../../../../slices/voucherSlice';
import {  formatStringToDate } from '../../../../helper';
import { useClearTokenMutation } from '../../../../services/auth.service';

const CheckOut = () => {
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const [showfetch, setShowFetch] = useState(false);
   const { data: cartdb, refetch } = useGetCartQuery(undefined, { skip: showfetch == false });
   const [checkCartLocal] = useCheckCartMutation();
   const [GetVoucherUseful] = useGetVoucherUsefulMutation();
   const [addVoucher] = useCheckVoucherMutation();
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isModalOpen2, setIsModalOpen2] = useState(false);
   const voucher = useSelector((state: { vouchersReducer: IVoucher }) => state.vouchersReducer);

   useEffect(() => {
      if (auth.user._id) {
         setShowFetch(true);
      } else {
         setShowFetch(false);
      }
   }, [auth]);
   const CartLocal = useSelector((state: { cart: ICartSlice }) => state?.cart);
   const cart = auth.user._id ? cartdb?.body.data.products : CartLocal;
   const [total, setTotal] = useState<number>(0);
   const [subtotal, setSubtotal] = useState<number>(0);
   const [error, setError] = useState<string[]>([]);
   const [inputVoucher, setInputVoucher] = useState<string>('');
   const [listVoucher, setListVoucher] = useState<any[]>([]);

   useEffect(() => {
      const temp = auth.user._id
         ? cart?.reduce(
              (accumulator: number, product: any) =>
                 accumulator +
                 (product.productId.price - (product.productId.price * product.productId.discount) / 100) *
                    product.weight,
              0
           )
         : cart?.totalPrice;

      setSubtotal(temp);
   }, [cart]);
   useEffect(() => {
      if (voucher._id) {
         const temp = cartdb?.body.data.products?.reduce(
            (accumulator: number, product: any) =>
               accumulator +
               (product.productId.price - (product.productId.price * product.productId.discount) / 100) *
                  product.weight,
            0
         );

         voucher.miniMumOrder && temp < voucher.miniMumOrder ? dispatch(remoteVoucher()) : '';
      }
   }, [cart]);
   useEffect(() => {
      if (voucher._id) {
         if (voucher.maxReduce) {
            const temp =
               subtotal > voucher.maxReduce
                  ? subtotal - voucher.maxReduce
                  : subtotal - (subtotal * voucher.percent) / 100;
            setTotal(temp);
         } else {
            const temp = subtotal - (subtotal * voucher.percent) / 100;
            setTotal(temp);
         }
      } else {
         const temp = auth.user._id
            ? cart?.reduce(
                 (accumulator: number, product: any) =>
                    accumulator +
                    (product.productId.price - (product.productId.price * product.productId.discount) / 100) *
                       product.weight,
                 0
              )
            : cart?.totalPrice;
         setTotal(temp);
      }
   }, [cart, voucher, subtotal]);
   const navigate = useNavigate();
   const handleOk = (index: number) => {
      index == 1 ? setIsModalOpen(false) : setIsModalOpen2(false);
      setError([]);
   };
   const showModal = () => {
      setIsModalOpen2(true);
   };
   const dispatch = useDispatch();
   const goCheckOut = async () => {
      if (auth.user._id) {
         let status = true;
         if (voucher._id) {
            const object = {
               code: voucher.code,
               userId: auth.user._id,
               miniMumOrder: subtotal
            };
            await addVoucher(object)
               .unwrap()
               .catch((error) => {
                  status = false;
                  setIsModalOpen(true);
                  if (error.data.message == 'Voucher does not exist!') {
                     setError((prevError: string[]) => [...prevError, 'Mã giảm giá không tồn tại']);
                     dispatch(remoteVoucher());
                  } else if (error.data.message == 'Voucher does not work!') {
                     setError((prevError: string[]) => [...prevError, 'Mã giảm giá không hoạt động']);
                     dispatch(remoteVoucher());
                  } else if (error.data.message == 'Voucher is out of quantity!') {
                     setError((prevError: string[]) => [...prevError, 'Mã giảm giá đã hết']);
                     dispatch(remoteVoucher());
                  } else if (error.data.message == 'Voucher is out of date') {
                     setError((prevError: string[]) => [...prevError, 'Mã giảm giá đã hết hạn']);
                     dispatch(remoteVoucher());
                     
                  } 
                  else if (
                     error.data.message == 'This voucher code has already been used. Please enter a different code!'
                  ) {
                     setError((prevError: string[]) => [...prevError, 'Bạn đã dùng mã giảm giá này trước đó']);
                     dispatch(remoteVoucher());
                  }
                  else if (error.data.message == 'Orders are not satisfactory!') {
                     setError((prevError: string[]) => [
                        ...prevError,
                        'Đơn hàng của bạn phải có tổng giá trị trên' +
                           error.data.miniMumOrder.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                     ]);
                     dispatch(remoteVoucher());
                  }
                  else if (
                     error.data.message == 'Sorry, this voucher is not yet available for use!'
                  ) {
                     message.error('Mã giảm giá chưa đến ngày bắt đầu sử dụng');
                  }
               });
         }

         await refetch().unwrap().then((res) => {
              res
               status ? navigate('/checkout') : '';
         }) .catch(err => {
            setIsModalOpen(true);
            if (err?.data?.body?.errors as any) {
               err.data.body.errors.map((item: any) => {
      
                  if (item.message == 'The remaining quantity is not enough!') {
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Số lượng trong kho của sản phẩm ' +
                           item.productName +
                           ' không đủ đáp ứng nhu cầu của bạn và đã được cập nhật lại số lượng.'
                     ]);
                  } else if (item.message == 'Product is currently out of stock!') {
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Sản phẩm ' + item.productName + ' đã hết hàng'
                     ]);
                     refetch()
                  } else if (item.message == 'Product is no longer available!') {
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Sản phẩm' + item.productName + ' đã  bị xoá khỏi hệ thống'
                     ]);
                  }
               });
            
         }
         status =  false;  
         });
      } else {
         const cartLocal = {

            products: cart['products'].map((product: any) => {
               let {
                  totalWeight,
                  productId: { originId: { name = undefined, ...originIdRest } = {}, ...productIdRest } = {},
                  ...rest
               } = product;
       
               name = undefined;
               return { totalWeight, productId: { originId: originIdRest, ...productIdRest }, ...rest };
            })
         };
         await checkCartLocal(cartLocal).unwrap().then(res=>{
            res  
            navigate("/checkout")
         }).catch((err: any) => {
               setIsModalOpen(true);

              
               
                
               err.data.body?.error.map((item: any) => {      
                  if (item.message == 'Product is not exsit!') {
                     dispatch(removeFromCart({ id: item.productId }));
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Sản phẩm ' + item.productName + ' đã bị xoá khỏi hệ thống'
                     ]);
                  } else if (item.message == 'Invalid product origin!') {
                     dispatch(updateOriginProductInCartLocal({ id: item.productId,origin_id: item.originId, name: item.originName }));
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Xuất xứ của sản phẩm ' + item.productName + ' đã được cập nhật'
                     ]);
                  } else if (item.message == 'Invalid product name!') {
                     dispatch(updateNameProductInCartLocal({ id: item.productId, name: item.productName }));
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Tên của sản phẩm ' + item.invalid + ' đã được cập nhật thành ' + item.productName
                     ]);
                  } else if (item.message == 'Invalid price for product!') {
                     dispatch(updatePriceProductInCartLocal({ id: item.productId, price: item.price }));
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Giá của sản phẩm ' +
                           item.productName +
                           ' không đồng nhất với dữ liệu trên hệ thống và đã được cập nhật'
                     ]);
                  } else if (item.message == 'Invalid product image!') {
                     dispatch(updateImgProductInCartLocal({ id: item.productId, img: item?.image }));
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Ảnh của sản phẩm ' +
                           item.productName +
                           ' không đồng nhất với dữ liệu trên hệ thống và đã được cập nhật'
                     ]);
                  } else if (item.message == 'Insufficient quantity of the product in stock!') {
                     dispatch(updateItem({ id: item.productId, weight: item.maxWeight }));
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Số lượng sản phẩm ' +
                           item.productName +
                           ' trong kho không đủ đáp ứng nhu cầu của bạn và đã được cập nhật về ' +
                           item.maxWeight
                     ]);
                  } else if (item.message == 'The product is currently out of stock!') {
                     dispatch(removeFromCart({ id: item.productId }));
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Sản phẩm ' + item.productName + ' đã hết hàng và đã được xoá khỏi giỏ hàng'
                     ]);
                  } else if (item.message == 'Invalid totalPayment!') {
                     dispatch(updateTotalPrice({ total: item.true }));
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Tổng tiền của bạn đang bị sai và đã được cập nhật lại'
                     ]);
                  }
                  else if (item.message == 'Invalid product weight!') {
                     setError((prevError: string[]) => [
                        ...prevError,
                        '- Sản phẩm phải có số lượng trên 0'
                     ]);
                  }
               });
               if (err.data.message) {
                  err.data.message.forEach((item: string) => {
                    if (item.includes("must be a number")) {
                      setError((prevError: string[]) => [
                        ...prevError,
                        '- Trong giỏ hàng của bạn có sản phẩm chưa đúng định dạng số lượng'
                      ]);
                    }
                  });
                }
         });
      }
   };
   const [clearToken] = useClearTokenMutation();
   const onHandleLogout = () => {
        dispatch(deleteTokenAndUser());
        dispatch(setItem());
        clearToken();
        navigate('/login');
     };
   const handleAddVoucher = async (code: string) => {
      if (!auth.user._id) {
         message.error('Bạn cần đăng nhập để sử dụng mã giảm giá');
      }

      const object = {
         code: code,
         userId: auth.user._id,
         miniMumOrder: subtotal
      };
      await addVoucher(object)
         .unwrap()
         .then((res) => {
            dispatch(remoteVoucher());
            dispatch(saveVoucher(res.body.data));
            setInputVoucher('');
            setIsModalOpen2(false);
            message.success('Sử dụng mã giảm giá thành công');
         })
         .catch((error) => {
            if (error.data.message == 'Voucher does not exist!') {
               message.error('Mã giảm giá không tồn tại');
            } else if (error.data.message == 'Voucher does not work!') {
               message.error('Mã giảm giá không còn hoạt động');
            } else if (error.data.message == 'Voucher is out of quantity!') {
               message.error('Mã giảm giá đã hết');
            } else if (error.data.message == 'Voucher is out of date') {
               message.error('Mã giảm giá đã hết hạn');
            } else if (error.data.message == 'Orders are not satisfactory!') {
               message.error(
                  'Đơn hàng của bạn phải có tổng giá trị trên ' +
                     error.data.miniMumOrder.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
               );
            } else if (
               error.data.message == 'Sorry, this voucher is not yet available for use!'
            ) {
               message.error('Mã giảm giá chưa đến ngày bắt đầu sử dụng');
            }
            else if (
               error.data.message == 'This voucher code has already been used. Please enter a different code!'
            ) {
               message.error('Bạn đã dùng mã giảm giá này trước đó');
            }
            else if(error.data.message=="Refresh Token is invalid" || error.data.message== "Refresh Token is expired ! Login again please !"){
               onHandleLogout()

            } 
         });
   };
   const handleGetListVoucher = async () => {
      const object = {
         miniMumOrder: subtotal,
         userId: auth?.user._id
      };
      await GetVoucherUseful(object)
         .unwrap()
         .then((res) => {
            setListVoucher(res.body.data);
         });
      showModal();
   };
   return (
      <div>
         <div className='cart-total'>
            <div className='temporary items-center flex justify-between pb-[17px] border-b-[1px] border-[#e2e2e2]'>
               <span className='temporary-title font-bold'>Tính tạm</span>
               <span className='temporary font-bold text-[#333333] '>
                  {auth.user._id
                     ? subtotal?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                     : cart?.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
               </span>
            </div>
            {voucher?._id && (
               <div>
                  <div className='discount flex justify-between items-center pb-[17px] border-b-[1px] border-[#e2e2e2] mt-[10px]'>
                     <span className="before:content-[''] before:block before:w-[10px] relative before:h-[10px] before:border-[#51A55C] before:border-[1px] overflow-hidden  before:bg-white  before:absolute  before:rounded-[50%]  before:translate-y-[-50%]  before:left-[-5px]  before:top-[50%] before:z-[2] after:content-[''] after:block after:w-[10px] after:h-[10px] after:border-[#51A55C] after:border-[1px] after:bg-white  after:absolute  after:rounded-[50%]  after:translate-y-[-50%]  after:right-[-5px]  after:top-[50%] after:z-[2]">
                        <div className='px-[10px] py-[5px] border-[1px] border-[#51A55C] text-[#51A55C]  font-bold max-sm:text-[12px] '>
                           {voucher.code}
                        </div>
                     </span>

                     <div className='discount-value'>
                        <span className='temporary font-bold  text-[14px] '>
                           {!voucher.maxReduce
                              ? '- ' +
                                ((subtotal * voucher.percent) / 100).toLocaleString('vi-VN', {
                                   style: 'currency',
                                   currency: 'VND'
                                })
                              : ''}
                        </span>
                        {voucher.maxReduce && (
                           <span className='temporary font-bold  text-[14px] '>
                              {voucher.maxReduce && subtotal > voucher?.maxReduce
                                 ? '- ' +
                                   voucher.maxReduce.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                 : '- ' +
                                   ((subtotal * voucher.percent) / 100).toLocaleString('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                   })}
                           </span>
                        )}
                        <button
                           onClick={() => {
                              dispatch(remoteVoucher());
                              message.success('Xoá Mã giảm giá thành công');
                           }}
                           type='button'
                           className='text-black text-[14px] ml-[10px]'
                        >
                           [Xoá]
                        </button>
                     </div>
                  </div>
               </div>
            )}
            <div className='total flex justify-between pb-[17px] border-b-[1px] border-[#e2e2e2] mt-[17px]'>
               <span className='total-title font-bold items-center'>Tổng</span>
               <span className='total font-bold  text-[20px] text-red-500'>
                  {auth.user._id
                     ? total?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                     : cart?.totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
               </span>
            </div>
            {!voucher._id ? <div className='discount-action mt-[30px] text-center'>
               <input
                  type='text'
                  value={inputVoucher}
                  onChange={(e) => setInputVoucher(e.target.value)}
                  className='outline-none border-[1px] rounded-[5px] px-[15px] py-[10px] border-[#e2e2e2] w-full'
                  placeholder='Mã Giảm giá'
               />
               <button
                  type='button'
                  className='block mt-[10px] hover:text-[#51A55C] cursor-pointer'
                  onClick={handleGetListVoucher}
               >
                  Xem tất cả mã giảm giá
               </button>
               <button
                  onClick={() => handleAddVoucher(inputVoucher)}
                  type='button'
                  className=' bg-[#51A55C]  text-white py-[10px] px-[15px] rounded-[5px] mt-[15px] transition-color duration-300 hover:bg-black'
               >
                  Sử dụng
               </button>
            </div>: <div className='discount-action mt-[30px] text-center'>

               <button
                  type='button'
                  className='block mt-[10px] hover:text-[#51A55C] cursor-pointer'
                  onClick={handleGetListVoucher}
               >
                  Xem tất cả mã giảm giá
               </button>
            
            </div>}
           
            <div className='btn-checkout'>
               <button
                  onClick={goCheckOut}
                  type='button'
                  className=' bg-[#51A55C] w-full  text-white py-[10px] px-[15px] rounded-[5px] mt-[25px] transition-color duration-300 hover:bg-black'
               >
                  Thanh toán
               </button>
            </div>
         </div>
         <div>
            <Modal
               title='Cập nhật lại giỏ hàng'
               open={isModalOpen}
               onOk={() => handleOk(1)}
               closeIcon={false}
               cancelButtonProps={{ style: { display: 'none' } }}
            >
               {error?.map((item) => {
                  return (
                     <>
                        <div>{item}</div>
                     </>
                  );
               })}
            </Modal>
         </div>
         <div>
            <Modal
               title='Chọn giảm giá'
               open={isModalOpen2}
               onOk={() => handleOk(2)}
               onCancel={() => handleOk(2)}
               cancelButtonProps={{ style: { display: 'none' } }}
               className=' overflow-y-scroll max-h-[80%]'
            >
               <div className='list-voucher flex flex-col gap-y-[10px]'>
                  {listVoucher.map((item) => {
                     return (
                        <>
                           <div className=' py-[10px] shadow-[0px_0px_3px_rgba(0,0,0,0.15)] px-[16px]'>
                              <h1 className='text-[17px] my-[5px]'>{item.title}</h1>
                              <h1 className='text-[16px] mb-[10px]'>
                                 Mã giảm giá: <span className='font-bold'>{item.code}</span>
                              </h1>
                              <ul className='list-disc px-[15px]'>
                                 <li>
                                    Giảm: <span className='text-red-500'>{item.percent}%</span>
                                 </li>

                                 {item.maxReduce > 0 && (
                                    <li>
                                       Giảm tối đa:{' '}
                                       {item.maxReduce?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </li>
                                 )}

                                 {item.miniMumOrder > 0 && (
                                    <li>
                                       Đơn hàng phải có giá trị trên {item.miniMumOrder > 0 &&
                                          item.miniMumOrder?.toLocaleString('vi-VN', {
                                             style: 'currency',
                                             currency: 'VND'
                                          })}
                                    </li>
                                 )}
                                  <li>
                                       Mã giảm giá có giá trị từ {formatStringToDate(item.dateStart)} đến {formatStringToDate(item.dateEnd)} 
                                    </li>
                              </ul>
                              {item.active === false && (
                                 <span className='text-red-500'>*Bạn phải đăng nhập để sử dụng mã khuyễn mãi</span>
                              )}
                              <button
                                 disabled={!item.active || !item.isValidDate}
                                 style={{
                                    backgroundColor: item.active == false ? 'grey' : ''
                                 }}
                                 onClick={() => {
                                    handleAddVoucher(item.code);
                                 }}
                                 className='my-[10px] bg-[#51A55C] p-[5px] rounded-sm text-white float-right disabled:cursor-not-allowed disabled:bg-gray-400'
                                 type='button'
                              >
                                 Áp dụng
                              </button>
                           </div>
                        </>
                     );
                  })}
               </div>
            </Modal>
         </div>
      </div>
   );
};

export default CheckOut;
