import { Swiper, SwiperSlide } from 'swiper/react';
import { useMemo } from 'react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Autoplay, Navigation } from 'swiper/modules';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { ConfigProvider, Rate, message } from 'antd';
import { AiOutlineHeart, AiOutlineEye } from 'react-icons/ai';
import { IProduct, IProductExpanded } from '../../../../interfaces/product';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveProduct } from '../../../../slices/productSlice';
import { addItem } from '../../../../slices/cartSlice';
import { IShipmentOfProduct } from '../../../../interfaces/shipment';

import QuickView from '../../../../components/QuickView/QuickView';
import { RootState } from '../../../../store';
import { addToWishList } from '../../../../slices/wishListSlice';
import { IAuth } from '../../../../slices/authSlice';
import { useAddCartMutation } from '../../../../services/cart.service';
import { CountExpirationDate } from '../../../../helper';
interface IRelatedProduct {
   products: IProductExpanded[] | undefined;
}

export default function SlideBestProduct({ products }: IRelatedProduct) {
   const dispatch = useDispatch();
   const productSlice = useSelector((state: RootState) => state.productSlice.products);
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const [addCart] = useAddCartMutation();
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const add_to_wishList = (product: any) => {
      dispatch(addToWishList(product));
   };
   const openQuickViewModal = (data: IProduct) => {
      const modal_product = document.querySelector('.modal-product');
      setTimeout(() => {
         modal_product?.classList.toggle('hidden');
         modal_product?.classList.toggle('!z-[20]');
      }, 200);
      setTimeout(() => {
         const modal_product_content = document.querySelector('.modal-product-content');
         modal_product_content?.classList.toggle('lg:!scale-[1]');
         modal_product_content?.classList.toggle('lg:!opacity-100');
         modal_product_content?.classList.toggle('max-lg:!translate-y-[0%]');
      }, 300);
      dispatch(saveProduct(data));
   };
   const calAvgRate = useMemo(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => (evaluations: any[]) => {
         const totalRate = evaluations?.reduce((rate, item) => {
            return (rate += Number(item.evaluatedId.rate));
         }, 0);
         return totalRate / evaluations?.length;
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [products]
   );
   const add_to_cart = async (data: IProductExpanded) => {
      if (auth.user._id) {
         const product = {
            productName: data?.productName,
            productId: data?._id,
            weight: 1
         };
         await addCart(product)
            .unwrap()
            .then((res) => {
               res;
               message.success('Thêm sản phẩm vào giỏ hàng thành công');
            })
            .catch((error) => {
               if (error.data.message == 'Product not found') {
                  message.error('Sản phẩm đã bị xoá khỏi hệ thống');
                  return;
               }
               else if (error.data.message == 'Please check the weight again!') {
                  message.error('Sản phẩm đã hết hàng');
               }
               message.error('Số lượng vượt quá sản phẩm đang có trong kho');
            });
      } else {
         const totalWeight = data?.shipments.reduce((accumulator: number, shipmentWeight: IShipmentOfProduct) => {
            return accumulator + shipmentWeight.weight;
         }, 0);
         const product = {
            productId: {
               _id: data?._id,
               productName: data?.productName,
               images: [{ url: data?.images[0].url }],
               price: data?.price - (data?.price * data?.discount) / 100,
               originId: {
                  _id: data?.originId._id,
                  name: data?.originId.name
               },
               isSale: data?.isSale
            },
            weight: 1,
            totalWeight: totalWeight
         };
         dispatch(addItem(product));
      }
   };
   return (
      <>
         <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
            <Swiper
               slidesPerView={4}
               spaceBetween={30}
               navigation={true}
               rewind={true}
               autoplay={{
                  delay: 3000,
                  disableOnInteraction: false
               }}
               breakpoints={{
                  1201: {
                     slidesPerView: 4
                  },
                  1200: {
                     slidesPerView: 3
                  },
                  991: {
                     spaceBetween: 10
                  },
                  767: {
                     slidesPerView: 3
                  },
                  766: {
                     slidesPerView: 2,
                     spaceBetween: 10
                  },
                  400: {
                     slidesPerView: 2,
                     spaceBetween: 10
                  },
                  1: {
                     slidesPerView: 1,
                     spaceBetween: 10
                  }
               }}
               modules={[Navigation, Autoplay]}
               className='mySwiper slide-best-pr pb-[75px]'
            >
               {products?.map((item) => {
                  return (
                     <>
                        <SwiperSlide>
                           <div className=' product-item md:p-[10px]  max-xl:mb-[18px]'>
                              <div className='product-wrap overflow-hidden group/product-wrap rounded-[5px] relative flex flex-col justify-between max-xl:pb-[40px]'>
                                 {item.discount > 0 && (
                                    <span className='discount z-[1] transition-all duration-300 group-hover/product-wrap:translate-x-[-115%] bg-red-500 min-w-[40px] text-center absolute rounded-[3px] py-[5px] px-[10px] text-[12px] text-white left-[7px] top-[7px]'>
                                       {item.discount + '%'}
                                    </span>
                                 )}

                                 {item.shipments.length <= 0 && (
                                    <span className='discount z-[1] transition-all duration-300 group-hover/product-wrap:translate-x-[-115%] bg-red-500 min-w-[40px] text-center absolute rounded-[3px] py-[5px] px-[10px] text-[12px] text-white left-[7px] top-[7px]'>
                                       Hết hàng
                                    </span>
                                 )}
                                 {item.isSale == true && (
                                    <span
                                       style={{ top: item.discount > 0 || item.shipments.length == 0 ? '40px' : '7px' }}
                                       className='discount z-[1] transition-all duration-300 group-hover/product-wrap:translate-x-[-115%] bg-[#2981e1] min-w-[40px] text-center absolute rounded-[3px] py-[5px] px-[10px] text-[12px] text-white left-[7px] top-[40px]'
                                    >
                                       Hàng thành lý
                                    </span>
                                 )}
                                 <div className='wrap-product-img overflow-hidden xl:relative max-xl:text-center '>
                                    <div className='xl:relative product-img   after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 bg-[#ffffff] after:opacity-0 after:invisible transition-all duration-300 group-hover/product-wrap:visible xl:group-hover/product-wrap:opacity-[0.4] max-xl:group-hover/product-wrap:opacity-[0.5] '>
                                       <img
                                          className='product-main-img lg:h-[331px] min-w-[100%] max-w-[100%] md:w-[212px] md:h-[257px] sm:h-[280px] object-center max-sm:w-full max-sm:h-[210px]  xl:group-hover/product-wrap:invisible  visible transition-all duration-300 opacity-100 object-cover '
                                          src={item?.images[0]?.url}
                                          alt=''
                                       />
                                       <img
                                          className='product-sub-img lg:h-[331px] min-w-[100%] max-w-[100%] md:w-[212px] md:h-[257px] sm:h-[280px] object-center  max-sm:w-full max-sm:h-[210px] max-xl:hidden absolute group-hover/product-wrap:opacity-100 group-hover/product-wrap:visible transition-all duration-300 top-0 left-0 invisible opacity-0  object-cover '
                                          src={item?.images[1]?.url}
                                          alt=''
                                       />
                                    </div>
                                    <div className='product-action max-xl:w-full max-xl:justify-center  transition-all duration-300 xl:invisible xl:opacity-0 flex absolute xl:bottom-[50%] bottom-0 xl:right-[50%] xl:translate-x-[50%] xl:gap-[15px]  max-xl:gap-[10px] group-hover/product-wrap:opacity-100 group-hover/product-wrap:visible'>
                                       <button
                                          onClick={() => add_to_cart(item)}
                                          className='add-to-card flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-[#51A55C] w-[40px] h-[40px] text-[20px] rounded-[100%] text-white bg-[#7aa32a]'
                                       >
                                          <HiOutlineShoppingBag></HiOutlineShoppingBag>
                                       </button>
                                       <button
                                          onClick={() => openQuickViewModal(item)}
                                          className='flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-[#51A55C] w-[40px] h-[40px] text-[20px] rounded-[100%] text-white bg-[#7aa32a]'
                                       >
                                          <AiOutlineEye></AiOutlineEye>
                                       </button>
                                       <button
                                          onClick={() => add_to_wishList(item)}
                                          className='add-to-card flex items-center justify-center transition-all duration-300 cursor-pointer hover:bg-[#51A55C] w-[40px] h-[40px] text-[20px] rounded-[100%] text-white bg-[#7aa32a]'
                                       >
                                          <AiOutlineHeart></AiOutlineHeart>
                                       </button>
                                    </div>
                                 </div>
                                 <Link to={'/products/' + item._id}>
                                    <p className='product-name font-bold md:mt-[10px] text-center md:text-[18px] max-md:text-[16px] line-clamp-2 break-words hover:text-[#51A55C]'>
                                       <Link to={'/products/' + item._id}>{item?.productName}</Link>
                                       <p className='text-[14px]'>
                                          {item.isSale == true
                                             ? 'HSD: còn ' + CountExpirationDate(item?.shipments[0]?.date) + ' ngày'
                                             : ''}
                                       </p>
                                    </p>
                                 </Link>
                                 <div className='rate text-center'>
                                    <ConfigProvider
                                       theme={{
                                          token: {
                                             controlHeightLG: 34
                                          }
                                       }}
                                    >
                                       <Rate allowHalf disabled value={calAvgRate(item.evaluated)} />
                                    </ConfigProvider>
                                 </div>
                                 <p className='price mt-[9px] flex items-center justify-center  text-center font-bold md:mb-[20px] max-md:mb-[10px] md:text-[18px]  text-[#7aa32a]'>
                                    {(item?.price - (item?.price * item?.discount) / 100)?.toLocaleString('vi-VN', {
                                       style: 'currency',
                                       currency: 'VND'
                                    })}
                                    {item.discount > 0 && (
                                       <span className='discount-price text-[#878c8f] line-through text-[13px] ml-[10px] font-normal'>
                                          {item?.price.toLocaleString('vi-VN', {
                                             style: 'currency',
                                             currency: 'VND'
                                          })}
                                       </span>
                                    )}
                                 </p>
                              </div>
                           </div>
                        </SwiperSlide>
                     </>
                  );
               })}
            </Swiper>
         </div>
         <QuickView product_info={productSlice}></QuickView>
      </>
   );
}
