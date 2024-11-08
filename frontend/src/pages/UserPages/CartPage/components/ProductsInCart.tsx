/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { ICartItems, ICartSlice, setItem } from '../../../../slices/cartSlice';
import { removeFromCart, updateItem, removeAllProductFromCart } from '../../../../slices/cartSlice';
import { message } from 'antd';
import { IAuth, deleteTokenAndUser } from '../../../../slices/authSlice';
import {
   useDeleteAllProductInCartMutation,
   useDeleteProductInCartMutation,
   useGetCartQuery,
   useUpdateCartMutation
} from '../../../../services/cart.service';
import { ICartDataBaseItem } from '../../../../interfaces/cart';
import { useEffect, useRef, useState } from 'react';
import { useClearTokenMutation } from '../../../../services/auth.service';
// eslint-disable-next-line @typescript-eslint/ban-types
const debounce = (func: Function, delay: number) => {
   let timeoutId: NodeJS.Timeout;
   return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
         func(...args);
      }, delay);
   };
};
const ProductsInCart = () => {
   const dispatch = useDispatch();
   const [updateCartDB] = useUpdateCartMutation();
   const [deleteProductInCartDB] = useDeleteProductInCartMutation();
   const [deleteAllProductInCartDB] = useDeleteAllProductInCartMutation();
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const [showfetch, setShowFetch] = useState(false);
   const { data: cartdb } = useGetCartQuery(undefined, { skip: !showfetch });
   useEffect(() => {
      if (auth.user._id) {
         setShowFetch(true);
      }
   }, [auth.user._id]);
   const CartLocal = useSelector((state: { cart: ICartSlice }) => state?.cart.products);
   const cart = auth.user._id ? cartdb?.body.data.products : CartLocal;
   const [clickCount, setClickCount] = useState(1);
   const debouncedUpdateCartDBRef = useRef<any>(null);
   const [cartState, setCartState] = useState(cart);
   useEffect(() => {
      setCartState(cart);
   }, [cart]);
   const navigate = useNavigate()
   const [clearToken] = useClearTokenMutation();
   const onHandleLogout = () => {
      dispatch(deleteTokenAndUser());
      dispatch(setItem());
      clearToken();
      navigate('/login');
   };
   if (!debouncedUpdateCartDBRef.current) {
      debouncedUpdateCartDBRef.current = debounce(async (temp: any) => {
         await updateCartDB(temp)
            .unwrap()
            .then((res) => {
               res;
               message.success('Cập nhật sản phẩm thành công');
            })
            .catch((error) => {
             
               if(error.data.message=="The remaining quantity is not enough!"){
                  setCartState(error?.data?.body?.data?.products);
                  message.error('Số lượng vượt quá sản phẩm đang có trong kho');
               }
               else if(error.data.message=="Refresh Token is invalid" || error.data.message== "Refresh Token is expired ! Login again please !"){
                  onHandleLogout()
               } 
               else if(error.status==500){
                  message.error('Vui lòng nhập số');
               }
            });
      }, 1000);
   }
   const updateCart = async (item: ICartDataBaseItem | ICartItems, index: number, cal: boolean) => {
      setClickCount(1);
      if (auth.user._id) {
         let updatedCartState = [...cartState];
         let updatedItem = { ...updatedCartState[index] };
         updatedItem.weight = cal ?    Number(updatedItem.weight) + 0.5 :  Number(updatedItem.weight) - 0.5;
         updatedCartState[index] = updatedItem;
         setCartState(updatedCartState);
         const temp = {
            productId: item.productId._id,
            weight: cal ? cartState[index].weight + 0.5 : cartState[index].weight - 0.5
         };
         cal ? setClickCount(clickCount + 1) : setClickCount(clickCount - 1);
         debouncedUpdateCartDBRef.current(temp);
      } else {
         dispatch(
            updateItem({
               id: item.productId._id,
               weight:
                  item.weight == 0 && item.weight + 0.5 <= 0 ? item.weight : cal ? item.weight + 0.5 : item.weight - 0.5
            })
         );
      }
   };
   const handleInputSize = (e: React.ChangeEvent<HTMLInputElement>, id: string, maxWeight: number, index: number) => {
      if (auth.user._id) {
         let updatedCartState = [...cartState];
         let updatedItem = { ...updatedCartState[index] };
         if(e.target.value!="."){
            updatedItem.weight = e.target.value;
         }

         if (e.target.value == '') {
            updatedCartState[index] = updatedItem;
            setCartState(updatedCartState);
         } else if (/^(\d*\.?\d*)$/.test(e.target.value)) {
            if (e.target.value.endsWith('.') && !/\.\d+$/.test(e.target.value)) {
               updatedCartState[index] = updatedItem;
               setCartState(updatedCartState);
            } else {
               const rounded = Math.floor(Number(e.target.value));
               const result = Number(e.target.value) - rounded;
               if (result >= 0.5) {
                  updatedItem.weight = rounded + 0.5;
                  updatedCartState[index] = updatedItem;
               } else {
                  updatedItem.weight = rounded;
                  updatedCartState[index] = updatedItem;
               }
            }
            setCartState(updatedCartState);
         }

         if (updatedItem.weight != '' && !e.target.value.endsWith('.')) {
            const temp = {
               productId: id,
               weight: updatedItem.weight
            };
            debouncedUpdateCartDBRef.current(temp);
         }
      } else {
         if (e.target.value === '') {
            return dispatch(updateItem({ id: id, weight: '' }));
         }
         if (/^[\d.]+$/.test(e.target.value)) {
            const value = e.target.value;
            if (Number(value) <= maxWeight ) {
               if (value.endsWith('.') && !/\.\d+$/.test(value)) {
                  dispatch(updateItem({ id: id, weight: value }));
               } else {
                  if(e.target.value!=""){
                     const rounded = Math.floor(Number(e.target.value));
                     const result = Number(e.target.value) - rounded;
                     if (result >= 0.5) {
                        dispatch(updateItem({ id: id, weight: rounded + 0.5 }));
                     } else {
                        dispatch(updateItem({ id: id, weight: rounded }));
                     }
                  }
                 
               }
            }
         } else {
            if (e.target.value != '' && !e.target.value.endsWith('.')) {              
               dispatch(updateItem({ id: id, weight: Number(e.target.value.replace(/\./g, ',')) }));
            }
           
         }
      }
   };
   const handleRemoveProductInCart = (item: ICartDataBaseItem | ICartItems) => {
      if (auth.user._id) {
         deleteProductInCartDB(item?.productId?._id).unwrap().then((res) => {
            res;
            message.success('Xoá sản phẩm khỏi giỏ hàng thành công');
         }).catch(err=>{
         if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
               onHandleLogout()
            } 
         })
      } else {
         dispatch(removeFromCart({ id: item.productId._id }));
      }
   };
   const handleRemoveAllCart = () => {
      if (auth.user._id) {
         deleteAllProductInCartDB(auth.user._id).unwrap().then((res) => {
            res;
            message.success('Xoá giỏ hàng thành công');
         }).catch(err=>{
            if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
                  onHandleLogout()
               } 
            });
      } else {
         dispatch(removeAllProductFromCart());
         message.success('Xoá giỏ hàng thành công');
      }
   };

   return (
      <div>
         {cart?.length === 0 || cart?.length === undefined ? (
            <div className='art-item-wrap md:px-[20px] md:pt-[20px] md:pb-[7px] max-md:px-[12px] max-md:py-[30px] border-[#e2e2e2] border-[1px] '>
               <p className='cart-title xl:text-[30px]  border-[#e2e2e2] max-xl:text-[18px] text-[red] font-bold items-center text-center pb-[12px]'>
                  Không có sản phẩm trong giỏ hàng
               </p>
               <div className='start-shopping cart-title xl:text-[17px]  border-[#e2e2e2] max-xl:text-[18px] text-[#51A55C] font-bold flex justify-center items-center text-center pb-[12px]'>
                  <Link to={'/collections'}>
                     <button
                        type='button'
                        className=' bg-[#51A55C]  text-white py-[10px] px-[15px] rounded-[5px] mt-[25px]'
                     >
                        Tiếp tục mua hàng
                     </button>
                  </Link>
               </div>
            </div>
         ) : (
            <div className='cart-item-wrap md:px-[20px] md:pt-[20px] md:pb-[7px] max-md:px-[12px] max-md:py-[30px] border-[#e2e2e2] border-[1px] '>
               <div className='cart-title xl:text-[20px] border-b-[1px] border-[#e2e2e2] max-xl:text-[18px] text-[#333333] font-bold flex justify-between pb-[12px]'>
                  <span>Giỏ hàng:</span>

                  <span className='cart-count font-bold border-b-[2px] border-[#6f6f6f] text-[#6f6f6f]'>
                     {cart?.length} sản phẩm
                  </span>
               </div>
               <div className='list-cart-item text-[#333333]'>
                  {cart?.map((item: any, index: number) => (
                     <div
                        key={index}
                        className='cart-item py-[30px] flex max-lg:flex-wrap items-center border-b-[1px] border-[#e2e2e2]'
                     >
                        <div className='cart-item-info lg:w-[60%] max-lg:w-full flex items-center h-auto'>
                           <div className='item-img w-[100px]'>
                              <Link
                                 to={'/products/'+item.productId._id}
                                 className=' border-[1px] border-[#e2e2e2] block overflow-hidden rounded-[5px] h-[98px] w-[98px]'
                              >
                                 <img src={item.productId?.images[0]?.url} className='h-[98px] w-[98px]' alt='' />
                              </Link>
                           </div>
                           <div className='item-title px-[15px]'>
                              <Link to={'/products/'+item.productId._id} className='product-name ư font-bold'>
                                 {item.productId?.productName}
                              </Link>
                              <div className='origin flex'>
                                 <span className='origin-title  font-bold'>Xuất xứ:</span>
                                 <span className='origin-name ml-[5px]'>{item.productId.originId.name}</span>
                              </div>
                              <span className='price'>
                                 {item.productId.discount
                                    ? (
                                         item.productId?.price -
                                         (item.productId?.price * item.productId?.discount) / 100
                                      ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                    : item.productId.price.toLocaleString('vi-VN', {
                                         style: 'currency',
                                         currency: 'VND'
                                      })}
                              </span>
                           </div>
                        </div>
                        <div className='cart-item-qty lg:w-[20%] md:w-[50%] max-lg:pt-[15px] max-lg:flex-wrap md:mt-[30px] max-md:mt-[20px] max-lg:flex max-lg:items-center max-lg:gap-[15px] max-sm:w-full '>
                           <div className='product-size-action flex lg:justify-center '>
                              <div className='product-info  flex items-center'>
                                 <div className='stock-qty-title text-[20px] text-[#333333] font-bold'>Kg:</div>

                                 <div className='stock-qty-value text-[16px] xl:ml-[15px] text-[#198754] font-bold'>
                                    <div className='product-quantity-action flex lg:justify-center'>
                                       <div className='product-quantity flex  '>
                                          <input
                                             type='text'
                                             value={cartState?.length > 0 && index >= 0 ? cartState[index]?.weight : ''}
                                             onChange={(e) =>
                                                handleInputSize(e, item.productId._id, item.totalWeight, index)
                                             }
                                             className={`outline-none border ${
                                                item.weight == '' ? 'border-red-500' : ''
                                             } border-[#e2e2e2] rounded-[5px]  ml-[10px] input-quantity text-center text-[#6f6f6f] w-[calc(100%-25px)] outline-none max-w-[50px] h-[50px]  border-[1px] `}
                                          />
                                          <div className='flex flex-col'>
                                             <button
                                                disabled={
                                                   item.weight == item.totalWeight &&
                                                   item.weight + 0.5 >= item.totalWeight
                                                      ? true
                                                      : false
                                                }
                                                onClick={() => updateCart(item, index, true)}
                                                type='button'
                                                className={`${
                                                   item.weight == item.totalWeight &&
                                                   item.weight + 0.5 >= item.totalWeight
                                                      ? 'bg-gray-300'
                                                      : ''
                                                } inc qty-btn text-[15px] text-[#232323] flex items-center justify-center cursor-pointer border-[1px] border-[#e2e2e2] rounded-[5px] w-[25px] h-[25px]`}
                                             >
                                                +
                                             </button>
                                             <button
                                                disabled={item.weight == 0 && item.weight - 0.5 <= 0 ? true : false}
                                                type='button'
                                                onClick={() => updateCart(item, index, false)}
                                                className={`${
                                                   item.weight == 0 && item.weight - 0.5 <= 0 ? 'bg-gray-300' : ''
                                                } inc qty-btn text-[15px] text-[#232323] flex items-center justify-center cursor-pointer border-[1px] border-[#e2e2e2] rounded-[5px] w-[25px] h-[25px]`}
                                             >
                                                -
                                             </button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <p className='text-red-500 max-lg:text-[14px] max-sm:order-3'>
                              {item.weight == '' ? 'Bạn phải nhập số lượng' : ''}
                           </p>
                           <div className='product-quanitity-remove flex justify-center lg:mt-[15px] max-sm:order-2'>
                              <button
                                 className='text-[#dc3545] transition-all duration-300 hover:text-[#ffc107] underline'
                                 type='button'
                                 onClick={() => handleRemoveProductInCart(item)}
                              >
                                 Xoá
                              </button>
                           </div>
                        </div>
                        <div className='cart-item-price sm:text-right max-sm:mt-[10px] w-[20%] max-lg:w-[50%]'>
                           <span className='full-price font-bold'>
                              {item.productId.discount
                                 ? (
                                      (item.productId?.price -
                                         (item.productId?.price * item.productId?.discount) / 100) *
                                      item.weight
                                   ).toLocaleString('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                   })
                                 : (item.productId.price * item.weight).toLocaleString('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                   })}
                           </span>
                        </div>
                     </div>
                  ))}
               </div>
               
               <div className='cart-footer flex justify-between py-[13px] flex-wrap gap-[15px]'>
                  <Link
                     to='/collections'
                     className='link-to-homepage px-[30px] py-[10px] bg-[#51A55C] text-white rounded-[5px] transition-colors duration-300 hover:bg-[#333333]'
                  >
                     TIẾP TỤC MUA HÀNG
                  </Link>
                  <button
                     onClick={() => {
                        handleRemoveAllCart();
                     }}
                     className='link-to-homepage px-[30px] py-[10px] bg-[#51A55C] text-white rounded-[5px] transition-colors duration-300 hover:bg-[#333333]'
                  >
                     XOÁ GIỎ HÀNG
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};

export default ProductsInCart;
