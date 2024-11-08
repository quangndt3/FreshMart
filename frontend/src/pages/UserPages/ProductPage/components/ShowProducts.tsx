/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigProvider, Rate, message } from 'antd';
import { AiOutlineEye, AiOutlineHeart } from 'react-icons/ai';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { Link, useNavigate } from 'react-router-dom';
import { addToWishList } from '../../../../slices/wishListSlice';
import { IResponseHasPaginate } from '../../../../interfaces/base';
import { IProduct, IProductExpanded } from '../../../../interfaces/product';
import QuickView from '../../../../components/QuickView/QuickView';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { saveProduct } from '../../../../slices/productSlice';
import { addItem, setItem } from '../../../../slices/cartSlice';
import { IShipmentOfProduct } from '../../../../interfaces/shipment';
import { IAuth, deleteTokenAndUser } from '../../../../slices/authSlice';
import { useAddCartMutation } from '../../../../services/cart.service';
import { CountExpirationDate } from '../../../../helper';
import { useClearTokenMutation } from '../../../../services/auth.service';

interface IProps {
   data: IResponseHasPaginate<IProductExpanded> | undefined;
}
const ShowProducts = ({ data }: IProps) => {
   const dispatch = useDispatch();
   const productSlice = useSelector((state: RootState) => state.productSlice.products);
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const [addCart] = useAddCartMutation();
   const add_to_wishList = (product: any) => {
      dispatch(addToWishList(product));
   };
   const [clearToken] = useClearTokenMutation();
   const navigate = useNavigate();
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
   const onHandleLogout = () => {
      dispatch(deleteTokenAndUser());
      dispatch(setItem());
      clearToken();
      navigate('/login');
   };
   const add_to_cart = async (data: IProductExpanded) => {
      if (auth.user._id) {
         const product = {
            productId: data?._id,
            productName: data?.productName,
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
                  navigate('/collections');
                  return;
               }
               else if (error.data.message == 'Please check the weight again!') {
                  message.error('Sản phẩm đã hết hàng');
                  return
               } 
               else if(error.data.message=="Refresh Token is invalid" || error.data.message== "Refresh Token is expired ! Login again please !"){
                  onHandleLogout()
                  return
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
               price:
                  data?.discount && data?.discount > 0
                     ? data?.price - (data?.price * data?.discount) / 100
                     : data?.price,
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
      <div>
         <div className='list-products grid xl:grid-cols-3 pt-[30px] lg:grid-cols-3 md:grid-cols-3 sm:grid-cols-2 max-sm:grid-cols-2  max-md:gap-[12px]'>
            {data?.body.data.map((item) => {
               return (
                  <>
                     <div className=' product-item md:p-[10px]  max-xl:mb-[18px]'>
                        <div className='product-wrap h-full overflow-hidden group/product-wrap rounded-[5px] relative flex flex-col justify-between   max-xl:pb-[40px]'>
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
                                 className='discount z-[1] transition-all duration-300 group-hover/product-wrap:translate-x-[-115%] bg-[#2981e1] min-w-[40px] text-center absolute rounded-[3px] py-[5px] px-[10px] text-[12px] text-white left-[7px]'
                              >
                                 Hàng thành lý
                              </span>
                           )}
                           <div className='wrap-product-img overflow-hidden xl:relative max-xl:text-center '>
                              <div className='xl:relative product-img   after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 bg-[#ffffff] after:opacity-0 after:invisible transition-all duration-300 group-hover/product-wrap:visible xl:group-hover/product-wrap:opacity-[0.4] max-xl:group-hover/product-wrap:opacity-[0.5] '>
                                 <img
                                    className='product-main-img lg:!h-[350px] w-[full] md:!h-[270px] sm:!h-[290px] max-sm:h-[170px] rounded-[5px]  xl:group-hover/product-wrap:invisible  visible transition-all duration-300 opacity-100 object-cover object-center'
                                    src={item?.images[0]?.url}
                                    alt=''
                                 />
                                 <img
                                    className='product-sub-img lg:!h-[350px] w-[full] md:h-[270px] sm:h-[290px] max-sm:h-[170px]  rounded-[5px] max-xl:hidden absolute group-hover/product-wrap:opacity-100 group-hover/product-wrap:visible transition-all duration-300 top-0 left-0 invisible opacity-0  object-cover object-center'
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
                           <Link
                              to={'/products/' + item._id}
                              onClick={() => {
                                 window.scrollTo(0, 0);
                              }}
                           >
                              <p className='product-name font-bold md:mt-[10px] text-center md:text-[18px] max-md:text-[16px] line-clamp-2 break-words hover:text-[#51A55C]'>
                                 {item?.productName}
                                 <p className='text-[14px]'>
                                    {item.isSale == true
                                       ? 'HSD: còn ' + CountExpirationDate(item?.shipments[0]?.date) + ' ngày'
                                       : ''}
                                 </p>
                              </p>
                           </Link>
                           <div className=''>
                              <div className='rate text-center '>
                                 <ConfigProvider
                                    theme={{
                                       token: {
                                          controlHeightLG: 34
                                       }
                                    }}
                                 >
                                    <Rate
                                       allowHalf
                                       disabled
                                       defaultValue={
                                          item.evaluated.reduce(
                                             (current, evaluation) => (current += evaluation.evaluatedId.rate),
                                             0
                                          ) / item.evaluated.length
                                       }
                                    />
                                 </ConfigProvider>
                              </div>
                              <p className='price mt-[9px] flex items-center justify-center  text-center font-bold md:mb-[20px] max-md:mb-[10px] md:text-[18px]  text-[#7aa32a]'>
                                 {(item?.price - (item?.price * item.discount) / 100).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                 })}
                                 {item.discount > 0 && (
                                    <span className='discount-price text-[#878c8f] line-through text-[13px] ml-[10px] font-normal'>
                                       {item?.price?.toLocaleString('vi-VN', {
                                          style: 'currency',
                                          currency: 'VND'
                                       })}
                                    </span>
                                 )}
                              </p>
                           </div>
                        </div>
                     </div>
                  </>
               );
            })}
         </div>
         <QuickView product_info={productSlice}></QuickView>
      </div>
   );
};

export default ShowProducts;