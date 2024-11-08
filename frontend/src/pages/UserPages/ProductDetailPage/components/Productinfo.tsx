/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import { ConfigProvider, Rate, message } from 'antd';
import ProductThumbsGallery from './ProductThumbsGallery';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, setItem } from '../../../../slices/cartSlice';
import { useEffect, useState } from 'react';
import { IProductInfoProp } from '../../../../interfaces/product';
import { IShipmentOfProduct } from '../../../../interfaces/shipment';
import { AiOutlineHeart } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { addToWishList } from '../../../../slices/wishListSlice';
import { FcLike } from 'react-icons/fc';
import { IAuth, deleteTokenAndUser } from '../../../../slices/authSlice';
import { useAddCartMutation } from '../../../../services/cart.service';
import { CountExpirationDate } from '../../../../helper';
import { useClearTokenMutation } from '../../../../services/auth.service';

const ProductInfo = ({ product_info }: IProductInfoProp) => {
   const [inputWeight, setinputWeight] = useState<any>(0.5);
   const [totalWeight, setTotalWeight] = useState<number>(0);
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const [addCart] = useAddCartMutation();
   const [clearToken] = useClearTokenMutation();
   const navigate = useNavigate();
   const handleinputWeight = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (/^[\d.]+$/.test(e.target.value)) {
         if(e.target.value=="."){
            return
         }
         const value = e.target.value;
         if (value.endsWith('.') && !/\.\d+$/.test(value)) {
            const count = value.split('.').length - 1;
            if (count < 2) {
               setinputWeight(value);
            }
         } else {
            if (isNaN(Number(e.target.value))) {
               setinputWeight(0.5);
            }
            const rounded = Math.floor(Number(e.target.value));
            const result = Number(e.target.value) - rounded;
            if (result >= 0.5) {
               setinputWeight(rounded + 0.5);
            } else {
               setinputWeight(rounded);
            }
         }
         if (value === '') {
            message.warning('Vui lòng nhập đúng định dạng số lượng');
            setinputWeight('');
         }
      } else {
         setinputWeight('');
      }
   };
   useEffect(() => {
      setTotalWeight(
         product_info?.shipments.reduce((accumulator: number, shipmentWeight: IShipmentOfProduct) => {
            return (accumulator += shipmentWeight.weight);
         }, 0) as number
      );
   }, [product_info]);
   const dispatch = useDispatch();
   const onHandleLogout = () => {
      dispatch(deleteTokenAndUser());
      dispatch(setItem());
      clearToken();
      navigate('/login');
   };
   const add_to_cart = async () => {
      if (inputWeight === '' || inputWeight === 0 || inputWeight.toString().endsWith('.')) {
         message.warning('Vui lòng nhập đúng định dạng số lượng');
         return;
      }
      if (inputWeight != '') {
         if (auth.user._id) {
            const product = {
               productId: product_info?._id,
               productName: product_info?.productName,
               weight: inputWeight
            };
            await addCart(product)
               .unwrap()
               .then((res) => {
                  res;
                  message.success('Thêm sản phẩm vào lô hàng thành công');
               })
               .catch((err) => {            
                  if (err.data.message == 'Product not found') {
                     message.error('Sản phẩm đã bị xoá khỏi hệ thống');
                     navigate('/products/' + product_info?._id);
                     return;
                  }
                  else if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
                     onHandleLogout()

                  } 
                  else if (err.data.message == '"weight" must be a number') {
                     message.error('Vui lòng nhập số');
                  }
                  else if (err.data.message == 'Please check the weight again!') {
                     message.error('Sản phẩm đã hết hàng');
                  } else {
                     message.error('Số lượng sản phẩm trong giỏ hàng của bạn vượt quá số lượng sản phẩm hiện có');
                  }
               });
         } else {
            const product = {
               productId: {
                  _id: product_info?._id,
                  productName: product_info?.productName,
                  images: [{ url: product_info?.images[0].url }],
                  price:
                     product_info?.discount && product_info?.discount > 0
                        ? product_info?.price - (product_info?.price * product_info?.discount) / 100
                        : product_info?.price,
                  originId: {
                     _id: product_info?.originId._id,
                     name: product_info?.originId.name
                  },
                  isSale: product_info?.isSale
               },
               weight: inputWeight,
               totalWeight: totalWeight
            };
            dispatch(addItem(product));
         }
      } else {
         setinputWeight(0.5);
         message.error('Kg không hợp lệ');
      }
   };
   const add_to_wishList = () => {
      const product = {
         _id: product_info?._id,
         name: product_info?.productName,
         images: product_info?.images[0].url,
         price: product_info?.price,
         discount: product_info?.discount,
         originId: product_info?.originId
      };
      dispatch(addToWishList(product));
   };
   const dec = () => {
      setinputWeight(Number(inputWeight) + 0.5);
   };
   const inc = () => {
      if (inputWeight > 0.5) {
         setinputWeight(Number(inputWeight) - 0.5);
      }
   };
   const isAdded = useSelector((state: any) =>
      state?.wishList?.items?.find((item: any) => item?._id === product_info?._id)
   );
   const avgRate = useMemo(() => {
      if (!product_info) return 0;
      const totalRate = product_info?.evaluated.reduce((rate, item) => {
         return (rate += Number(item.evaluatedId.rate));
      }, 0);
      return totalRate / product_info.evaluated.length;
   }, [product_info]);
   return (
      <>
         <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
            <div className='pro-detail flex max-lg:flex-wrap lg:items-start mt-[-30px]'>
               <div className='pro-detail-header xl:w-[42%] lg:w-[50%] max-lg:w-full '>
                  <ProductThumbsGallery body={product_info?.images}></ProductThumbsGallery>
               </div>
               <div className='pro-detail-content max-lg:mt-[30px] lg:sticky lg:top-[10px] xl:pl-[60px] lg:pl-[30px] xl:w-[58%] lg:w-[50%] max-lg:w-full '>
                  <div className='rate flex items-center'>
                     <ConfigProvider
                        theme={{
                           token: {
                              controlHeightLG: 35
                           }
                        }}
                     >
                        <Rate allowHalf disabled value={avgRate} />
                        <span className='text-[#bbb] before:content-["("] after:content-[")"] ml-[5px] after:absolute before:absolute after:right-0 before:left-0 relative px-[10px]'>
                           {product_info && product_info.evaluated.length} đánh giá
                        </span>
                     </ConfigProvider>
                  </div>
                  <div className='product-info-wrap'>
                     <div className='product-info md:mt-[30px] max-md:mt-[20px]'>
                        <div className='product-name  lg:text-[28px] max-lg:text-[24px] text-[#333333] font-bold '>
                           {product_info?.productName} 
                           <p className='text-[14px]'>
                                    {product_info?.isSale == true
                                       ? 'Hạn sử dụng: còn ' + CountExpirationDate(product_info?.shipments[0]?.date) + ' ngày'
                                       : ''}
                                 </p>
                        </div>
                        
                     </div>
                     <div className='product-info md:mt-[30px] max-md:mt-[20px] '>
                        {product_info?.price ? (
                           <div className='product-price text-[20px] font-bold flex items-center'>
                              {(
                                 product_info?.price -
                                 (product_info?.price * product_info?.discount) / 100
                              ).toLocaleString('vi-VN', {
                                 style: 'currency',
                                 currency: 'VND'
                              })}
                              {product_info?.discount > 0 && (
                                 <>
                                    <span className='discount-price text-[#878c8f] line-through text-[13px] ml-[10px] font-normal'>
                                       {product_info?.price?.toLocaleString('vi-VN', {
                                          style: 'currency',
                                          currency: 'VND'
                                       })}
                                    </span>
                                    <div className='text-[14px] text-white bg-red-500 h-[100%] px-[10px] ml-[10px] rounded-sm'>
                                       -{product_info.discount}%
                                    </div>
                                 </>
                              )}
                           </div>
                        ) : (
                           ''
                        )}
                     </div>
                     <div className='product-info md:mt-[30px] max-md:mt-[20px] flex items-center'>
                        <div className='stock-qty-title text-[20px] text-[#333333] font-bold'>Số lượng còn lại:</div>
                        <div className='stock-qty-value text-[16px] ml-[15px] text-[#198754] font-bold'>
                           {totalWeight} kg
                        </div>
                     </div>
                     {product_info?.shipments.length != 0 ? (
                        <div className='act'>
                           <div className='product-info md:mt-[30px] max-md:mt-[20px] flex items-center'>
                              <div className='stock-qty-title text-[20px] text-[#333333] font-bold'>Kg:</div>

                              <div className='stock-qty-value text-[16px] ml-[15px] text-[#198754] font-bold'>
                                 <div className='product-quantity-action flex lg:justify-center'>
                                    <div className='product-quantity flex  '>
                                       <input
                                          type='text'
                                          value={inputWeight}
                                          onChange={handleinputWeight}
                                          className='input-quantity text-center text-[#6f6f6f] w-[calc(100%-25px)] outline-none border-[#e2e2e2] max-w-[50px] h-[50px]  border-[1px] rounded-[5px]'
                                       />
                                       <div className='flex flex-col'>
                                          <button
                                             disabled={inputWeight >= totalWeight!}
                                             onClick={dec}
                                             type='button'
                                             className={`${
                                                inputWeight >= totalWeight! ? 'bg-gray-300' : ''
                                             } inc qty-btn text-[15px] text-[#232323] flex items-center justify-center cursor-pointer border-[1px] border-[#e2e2e2] rounded-[5px] w-[25px] h-[25px]`}
                                          >
                                             +
                                          </button>
                                          <button
                                             disabled={inputWeight <= 0}
                                             onClick={inc}
                                             type='button'
                                             className={`${
                                                inputWeight <= 0 ? 'bg-gray-300' : ''
                                             } inc qty-btn text-[15px] text-[#232323] flex items-center justify-center cursor-pointer border-[1px] border-[#e2e2e2] rounded-[5px] w-[25px] h-[25px]`}
                                          >
                                             -
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div className='product-btn md:mt-[30px] max-md:mt-[20px]  flex sm:gap-[30px] max-sm:flex-wrap max-sm:gap-y-[15px]'>
                              <div className='btn-add-card-wrap group/btn-add-cart max-sm:w-full'>
                                 <button
                                    type='button'
                                    onClick={add_to_cart}
                                    className={`${
                                       inputWeight <= 0 ? 'before:bg-gray-300' : ''
                                    } btn-add-cart py-[12px] text-[#333333] w-full transition-colors duration-300 z-[3] before:z-[-1] px-[30px] text-center rounded-[5px] group-hover/btn-add-cart:text-white font-bold bg-[#333333] border-[2px] border-[#333333] before-content-[""] before:absolute relative before:w-full before:h-full overflow-hidden before:bg-white before:transition-all before:duration-300 before:group-hover/btn-add-cart:scale-y-[0] before:origin-right   before:right-0 before:left-[0px] before:top-0`}
                                 >
                                    {totalWeight! > 0 ? 'THÊM VÀO GIỎ HÀNG' : 'HẾT HÀNG'}
                                 </button>
                              </div>
                              <div className='btn-checkout-wrap group/btn-add-cart max-sm:w-full border-[2px] border-[#333333] transition-colors duration-300 hover:border-[#d2401e] rounded-[5px] overflow-hidden'>
                                 <Link to='/cart'>
                                    <button
                                       onClick={add_to_cart}
                                       type='button'
                                       className=' btn-checkout py-[12px] text-white w-full transition-colors duration-300 z-[3] before:z-[-1] sm:px-[71px] text-center   font-bold bg-[#d2401e]  before-content-[""] before:absolute relative before:w-full before:h-full overflow-hidden before:bg-[#333333] before:transition-all  before:duration-300 before:group-hover/btn-add-cart:scale-x-[0]    before:right-0 before:left-[0px] before:top-0'
                                    >
                                       MUA NGAY
                                    </button>
                                 </Link>
                              </div>
                           </div>
                           <div className='product-info md:mt-[30px] max-md:mt-[20px] flex items-center'>
                              <button
                                 onClick={add_to_wishList}
                                 type='button'
                                 className='btn-love text-[18px]  font-bold flex items-center hover:text-[#333333]'
                              >
                                 {isAdded ? (
                                    <FcLike className='text-[22px] mr-[5px] bg-red' />
                                 ) : (
                                    <AiOutlineHeart className='text-[20px] mr-[5px] bg-red' />
                                 )}
                                 YÊU THÍCH
                              </button>
                           </div>
                        </div>
                     ) : (
                        <h1 className='text-[23px] font-bold mt-[20px] text-red-500'>Hết hàng</h1>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};
export default ProductInfo;
