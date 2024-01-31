/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { message } from 'antd';
import ModalProductSlide from '../../pages/UserPages/ProductPage/components/ModalProductSlide';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { IShipmentOfProduct } from '../../interfaces/shipment';
import { IProductExpanded } from '../../interfaces/product';
import { Link, useNavigate } from 'react-router-dom';
import { addItem } from '../../slices/cartSlice';
import { saveProduct } from '../../slices/productSlice';
import { useAddCartMutation } from '../../services/cart.service';
import { IAuth } from '../../slices/authSlice';
import { CountExpirationDate } from '../../helper';
export interface QuickViewProp {
   product_info: IProductExpanded[];
}
const QuickView = ({ product_info }: QuickViewProp) => {
   const dispatch = useDispatch();
   const [inputWeight, setinputWeight] = useState<any>(0.5);
   const [totalWeight, setTotalWeight] = useState<number>();
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const [addCart] = useAddCartMutation();
   const navigate = useNavigate();
   useEffect(() => {
      setTotalWeight(
         product_info[0]?.shipments?.reduce((accumulator: number, shipmentWeight: IShipmentOfProduct) => {
            return accumulator + shipmentWeight.weight;
         }, 0)
      );
   }, [product_info]);
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
   const add_to_cart = async () => {
      if (inputWeight === '' || inputWeight === 0 || inputWeight.toString().endsWith('.')) {
         message.warning('Vui lòng nhập đúng định dạng số lượng');
         return;
      }
      if (inputWeight != '') {
         if (auth.user._id) {
            const product = {
               productId: product_info[0]?._id,
               productName: product_info[0]?.productName,
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
                     navigate('/products/' + product_info[0]?._id);
                     return;
                  } else if (err.data.message == '"weight" must be a number') {
                     message.error('Vui lòng nhập số');
                  }
                  else if (err.data.message == 'Please check the weight again!') {
                     message.error('Sản phẩm đã hết hàng');
                  }
                   else {
                     message.error('Số lượng sản phẩm trong giỏ hàng của bạn vượt quá số lượng sản phẩm hiện có');
                  }
               });
         } else {
            const product = {
               productId: {
                  _id: product_info[0]?._id,
                  productName: product_info[0]?.productName,
                  images: [{ url: product_info[0]?.images[0].url }],
                  price:
                     product_info[0]?.discount && product_info[0]?.discount > 0
                        ? product_info[0]?.price - (product_info[0]?.price * product_info[0]?.discount) / 100
                        : product_info[0]?.price,
                  originId: {
                     _id: product_info[0]?.originId._id,
                     name: product_info[0]?.originId.name
                  },
                  isSale: product_info[0]?.isSale
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
   const dec = () => {
      setinputWeight(Number(inputWeight) + 0.5);
   };
   const inc = () => {
      if (inputWeight > 0.5) {
         setinputWeight(Number(inputWeight) - 0.5);
      }
   };
   const closeModal = () => {

      const modal_product = document.querySelector('.modal-product');
      setTimeout(() => {
         const modal_product_content = document.querySelector('.modal-product-content');
         modal_product_content?.classList.toggle('lg:!scale-[1]');
         modal_product_content?.classList.toggle('lg:!opacity-100');
         modal_product_content?.classList.toggle('max-lg:!translate-y-[0%]');
      }, 200);
      setTimeout(() => {
         modal_product?.classList.toggle('hidden');
         modal_product?.classList.toggle('!z-[20]');
         dispatch(saveProduct(null));
      }, 600);
   };
   return (
      <>
         <section
            className={`modal-product hidden  fixed  top-0 left-0 w-full  h-full   bg-[rgba(3,17,27,0.3)] z-[-2]   outline-none`}
         >
            <div
               className={`modal-product-content delay-500 overflow-y-auto max-lg:h-[90%] max-lg:flex-wrap max-lg:fixed max-lg:bottom-0 max-lg:w-[100%] lg:opacity-0  max-lg:max-w-full transition-all opacity-100 duration-700 lg:scale-[0.8] max-lg:translate-y-[100%]  relative flex w-[80%] lg:my-[28px] lg:max-h-[615px] gap-[20px] lg:mx-auto lg:px-[20px] lg:py-[25px] p-[10px]  bg-white rounded-[3px] overflow-hidden border-[1px] outline-none border-[rgba(0,0,0,.2)]  max-w-[840px]`}
            >
               <div className='product-slide  text-[14px] relative max-w-[calc(50%-10px)] z-[-1]  text-center max-lg:max-w-full max-lg:w-full'>
                  <ModalProductSlide body={product_info?.[0]?.images}></ModalProductSlide>
                  {product_info[0]?.discount > 0 && product_info[0].shipments.length > 0 && (
                     <div className='product-discount absolute text-[14px] text-white bg-red-500 px-[10px] py-[5px] rounded-br-[10px] w-[46px] z-[3] rounded-bl-[10px] left-0 top-0'>
                        <p>-{product_info[0]?.discount}%</p>
                        <p>OFF</p>
                     </div>
                  )}
               </div>
               <div className='product-detail w-[calc(50%-10px)] lg:pt-[30px] max-lg:max-w-full max-lg:w-full'>
                  <div className='product-name'>
                     <div className='product-name-content  text-[18px] mb-[5px] font-[700]'>
                        {product_info[0]?.productName}
                     </div>
                     <p className='text-[14px]'>
                                    {product_info[0]?.isSale == true
                                       ? 'Hạn sử dụng: còn ' + CountExpirationDate(product_info[0]?.shipments[0]?.date) + ' ngày'
                                       : ''}
                                 </p>
                     <span className='product-origin text-[14px]'>
                        Xuất xứ: <strong className='text-[#51A55C]'>{product_info[0]?.originId.name}</strong>
                     </span>
                     <br />
                     <span className='product-origin text-[14px]'>
                        Số lượng còn lại: <strong className='text-[#51A55C]'>{totalWeight} kg</strong>
                     </span>
                  </div>
                  {product_info[0]?.shipments.length > 0 && (
                     <div className='product-price flex w-full items-center'>
                        <div className='product-price-title min-w-[28%] text-[14px] font-[600]'>Giá:</div>
                        <div className='product-price-content text-[18px] text-red-500 pr-[10px] font-bold flex items-center'>
                           {(
                              product_info[0]?.price -
                              (product_info[0]?.price * product_info[0]?.discount) / 100
                           ).toLocaleString('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                           })}
                           (/kg)
                           {product_info[0]?.discount > 0 && (
                              <>
                                 <span className='discount-price text-[#878c8f] line-through text-[13px] ml-[10px] font-normal'>
                                    {product_info[0]?.price?.toLocaleString('vi-VN', {
                                       style: 'currency',
                                       currency: 'VND'
                                    })}
                                 </span>
                                 
                              </>
                           )}
                        </div>
                     </div>
                  )}

                  {product_info[0]?.shipments.length > 0 ? (
                     <>
                        <div className='product-select mt-[20px] flex  w-full items-center'>
                           <div className='product-size-title min-w-[28%] text-[14px] font-[600]'>Kg:</div>
                           <div className='product-size w-[72%]'>
                              <div className='stock-qty-value text-[16px] text-[#198754] font-bold'>
                                 <div className='product-quantity-action flex '>
                                    <div className='product-quantity flex  '>
                                       <input
                                          type='text'
                                          value={inputWeight}
                                          onChange={handleinputWeight}
                                          className='input-quantity text-center text-[#6f6f6f] w-[calc(100%-25px)] outline-none border-[#e2e2e2] max-w-[50px] h-[50px]  border-[1px] rounded-[5px]'
                                       />
                                       <div className='flex flex-col'>
                                          <button
                                             onClick={dec}
                                             type='button'
                                             className='inc qty-btn text-[15px] text-[#232323] flex items-center justify-center cursor-pointer border-[1px] border-[#e2e2e2] rounded-[5px] w-[25px] h-[25px]'
                                          >
                                             +
                                          </button>
                                          <button
                                             onClick={inc}
                                             type='button'
                                             className='inc qty-btn text-[15px] text-[#232323] flex items-center justify-center cursor-pointer border-[1px] border-[#e2e2e2] rounded-[5px] w-[25px] h-[25px]'
                                          >
                                             -
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <div className='product-content '>
                           <button
                              onClick={add_to_cart}
                              className='max-lg:w-full  btn-product-form bg-[#ff0000] rounded-[4px] text-white text-center w-full h-[40px] leading-[40px] border-[1px] border-[#ff0000] mt-[15px] text-[14px]'
                           >
                              THÊM VÀO GIỎ
                           </button>
                        </div>
                     </>
                  ) : (
                     <h1 className='text-red-500 text-[23px] font-bold'>Hết hàng</h1>
                  )}

                  <div onClick={closeModal} className='link-product-detail mt-[10px]'>
                     <Link to={`/products/` + product_info[0]?._id}>
                        <span className='decoration-1 underline text-[14px]'>Xem chi tiết sản phẩm</span>
                     </Link>
                  </div>
               </div>

               <button
                  onClick={closeModal}
                  type='button'
                  className='group/close-modal absolute right-4 z-[10] max-lg:top-[10px] max-lg:right-[10px] max-lg:fixed'
               >
                  <AiOutlineCloseCircle className=' text-[30px] max-lg:text-[40px]  group-hover/close-modal:fill-[#51A55C]'></AiOutlineCloseCircle>
               </button>
            </div>
         </section>
      </>
   );
};
export default QuickView;
