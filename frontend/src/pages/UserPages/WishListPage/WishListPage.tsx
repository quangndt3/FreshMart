import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishList } from '../../../slices/wishListSlice';
import { AiOutlineArrowRight } from 'react-icons/ai';
const WishListPage = () => {
   const wishList = useSelector((state: { wishList: any }) => state?.wishList);
   console.log(wishList.items);
   const dispatch = useDispatch();
   const remove_from_wishList = (id: any) => {
      // console.log(id);

      dispatch(removeFromWishList({ id: id }));
   };
   const totalProductInWishList = useSelector((state: { wishList: any }) => state?.wishList?.items.length);
   return (
      <div className='mx-auto px-[15px] py-[30px] items-center 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
         <div>
            {wishList?.items?.length <= 0 ? (
               <div className='cart-emty'>
                  <p className='cart-title xl:text-[30px]  border-[#e2e2e2] max-xl:text-[18px] text-[#51A55C] font-bold items-center text-center pb-[12px]'>
                     Không có sản phẩm yêu thích
                  </p>
                  <div className='start-shopping cart-title xl:text-[17px]  border-[#e2e2e2] max-xl:text-[18px] text-[#51A55C] font-bold flex justify-center items-center text-center pb-[12px]'>
                     <Link to={'/collections'}>
                        <button
                           type='button'
                           className=' bg-[#51A55C]  text-white py-[10px] px-[15px] rounded-[5px] mt-[25px]'
                        >
                           Thêm sản phẩm yêu thích ?
                        </button>
                     </Link>
                  </div>
               </div>
            ) : (
               <div className='flex  flex-col  items-center w-full p-6 space-y-4 sm:p-10 dark:bg-gray-900 dark:text-gray-100'>
                  <h2 className='text-xl font-semibold'> {totalProductInWishList} sản phẩm yêu thích</h2>
                  <div className='flex gap-x-[63px] items-center flex-wrap '>
                     {wishList?.items?.map((item: any, index: number) => (
                        <ul
                           key={index}
                           className='flex flex-col divide-y dark:divide-gray-700 xl:max-w-[30%] sm:w-[100%]'
                        >
                           <li className='flex flex-col py-6 sm:flex-row sm:justify-between '>
                              <div className='flex w-full space-x-2 sm:space-x-4 max-sm:items-center max-sm:flex-wrap '>
                                 <img
                                    className='flex-shrink-0 max-sm:m-auto  max-sm:w-[300px] max-sm:h-[200px] object-cover w-20 h-20 dark:border-transparent rounded outline-none sm:w-32 sm:h-32 dark:bg-gray-500'
                                    src={Array.isArray(item.images) ? item.images[0].url : item.images}
                                    alt='Polaroid camera'
                                 />
                                 <div className='flex flex-col justify-between w-full pb-4 '>
                                    <div className='flex max-sm:flex-col justify-between w-full pb-2 space-x-2 '>
                                       <div className='space-y-1'>
                                          <h3 className='text-lg font-semibold leadi sm:pr-8'>
                                             {item.productName ? item.productName : item.name}
                                          </h3>
                                          <p className='text-sm dark:text-gray-400'>{item.originId.name}</p>
                                       </div>
                                       <div className='sm:text-right max-sm:flex max-sm:items-center max-sm:gap-x-[20px] max-sm:!ml-[0px]'>
                                          <p className='text-lg font-semibold'>
                                             {item?.discount > 0
                                                ? (item?.price - (item?.price * item?.discount) / 100).toLocaleString(
                                                     'vi-VN',
                                                     {
                                                        style: 'currency',
                                                        currency: 'VND'
                                                     }
                                                  )
                                                : item.price.toLocaleString('vi-VN', {
                                                     style: 'currency',
                                                     currency: 'VND'
                                                  })}{' '}
                                             /kg
                                          </p>
                                          <p className='text-sm line-through dark:text-gray-600'>
                                             {item?.discount > 0
                                                ? item.price.toLocaleString('vi-VN', {
                                                     style: 'currency',
                                                     currency: 'VND'
                                                  })
                                                : ''}
                                          </p>
                                       </div>
                                    </div>
                                    <div className='flex text-sm divide-x'>
                                       <button
                                          onClick={() => remove_from_wishList(item._id)}
                                          type='button'
                                          className='flex items-center px-2 py-1 pl-0 space-x-1'
                                       >
                                          <svg
                                             xmlns='http://www.w3.org/2000/svg'
                                             viewBox='0 0 512 512'
                                             className='w-4 h-4 fill-current'
                                          >
                                             <path d='M96,472a23.82,23.82,0,0,0,23.579,24H392.421A23.82,23.82,0,0,0,416,472V152H96Zm32-288H384V464H128Z'></path>
                                             <rect width='32' height='200' x='168' y='216'></rect>
                                             <rect width='32' height='200' x='240' y='216'></rect>
                                             <rect width='32' height='200' x='312' y='216'></rect>
                                             <path d='M328,88V40c0-13.458-9.488-24-21.6-24H205.6C193.488,16,184,26.542,184,40V88H64v32H448V88ZM216,48h80V88H216Z'></path>
                                          </svg>
                                          <span>Remove</span>
                                       </button>
                                       <Link
                                          to={'/products/' + item._id}
                                          className='flex items-center px-2 py-1 space-x-1'
                                       >
                                          <AiOutlineArrowRight className='w-4 h-4 fill-current' />
                                          <span>Chi tiết sản phẩm</span>
                                       </Link>
                                    </div>
                                 </div>
                              </div>
                           </li>
                        </ul>
                     ))}
                  </div>

                  <div className='flex justify-end space-x-4'>
                     <Link to={'/collections'} className='px-6 py-2 border rounded-md dark:border-violet-400'>
                        Trở về trang sản phẩm
                     </Link>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
};

export default WishListPage;
