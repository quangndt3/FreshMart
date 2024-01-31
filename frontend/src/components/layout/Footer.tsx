/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import { BiStore } from 'react-icons/bi';
import { BsBell } from 'react-icons/bs';
import { HiOutlineShoppingBag, HiOutlineTrash } from 'react-icons/hi2';
import { FaXmark } from 'react-icons/fa6';
import { FaArrowUp, FaPlus, FaWindowMinimize, FaInstagram } from 'react-icons/fa';
import { FiHeadphones, FiLogOut, FiLogIn } from 'react-icons/fi';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { ICartItems, ICartSlice, removeFromCart, setItem } from '../../slices/cartSlice';
import { Link, useNavigate } from 'react-router-dom';
import NotificationSound from '../../assets/notification-sound.mp3';
import { PiUserListBold } from 'react-icons/pi';
import { RiBillLine } from 'react-icons/ri';
import { LuUser2 } from 'react-icons/lu';
import { MdOutlineLockReset } from 'react-icons/md';
import { logoUrl } from '../../constants/imageUrl';
import { useGetAllCateQuery } from '../../services/cate.service';
import { useDeleteProductInCartMutation, useGetCartQuery } from '../../services/cart.service';
import { IAuth, deleteTokenAndUser } from '../../slices/authSlice';
import { ICartDataBaseItem } from '../../interfaces/cart';
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { clientSocket } from '../../config/socket';
import { useGetOneChatUserQuery, useSendMessageMutation, useUpdateIsReadMutation } from '../../services/chat.service';
import { Badge, message } from 'antd';
import { IoChatbubblesOutline, IoSend } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md';
import SearchFilter from './Header/components/SearchFilter';
import { formatStringToDate } from '../../helper';
import {
   useDeleteNotificationMutation,
   useGetClientNotificationQuery,
   useUpdateNotificationMutation
} from '../../services/notification';
import { INotification } from '../../interfaces/notification';
import { useClearTokenMutation } from '../../services/auth.service';
import { IVoucher } from '../../slices/voucherSlice';

const Footer = () => {
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const { data: cartdb, refetch: refetchCart } = useGetCartQuery(undefined, { skip: !auth.user?._id });
   const scrollRef = useRef<HTMLDivElement | null>(null);
   const CartLocal = useSelector((state: { cart: ICartSlice }) => state?.cart.products);
   const totalPrice = useSelector((state: { cart: ICartSlice }) => state?.cart.totalPrice);
   const cart = auth.user._id ? cartdb?.body.data.products : CartLocal;
   const { data: clientNotification, refetch: refetchNoti } = useGetClientNotificationQuery(auth?.user?._id);
   const voucher = useSelector((state: { vouchersReducer: IVoucher }) => state.vouchersReducer);
   const [sendMessage] = useSendMessageMutation();
   const [updateIsRead] = useUpdateIsReadMutation();
   const [deleteProductInCartDB] = useDeleteProductInCartMutation();
   const [openChat, setOpenChat] = useState(false);
   const dispatch = useDispatch();
   const { data } = useGetAllCateQuery({});
   const [updateNotification] = useUpdateNotificationMutation();
   const [deleteNotification] = useDeleteNotificationMutation();
   const [clearToken] = useClearTokenMutation();
   const audioPlayer = useRef<HTMLAudioElement | null>(null);
   const navigate = useNavigate();
   const onHandleLogout = () => {
      dispatch(deleteTokenAndUser());
      dispatch(setItem());
      clearToken();
      navigate('/');
   };
   useEffect(() => {
      clientSocket.open();
      const handlePurchaseNotification = () => {
         refetchCart();
         refetchNoti();
      };
      if (auth?.user?._id) {
         clientSocket.on('purchaseNotification', handlePurchaseNotification);
         clientSocket.on('statusNotification', handlePurchaseNotification);
      }
   }, [auth]);
   const showMiniCart = () => {
      const mini_cart_overlay = document.querySelector('.mini-cart-overlay');
      mini_cart_overlay?.classList.toggle('hidden');
      const wrap_mini_cart = document.querySelector('.wrap-mini-cart');
      wrap_mini_cart?.classList.toggle('!translate-x-[0%]');
   };

   const toTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };
   const showSudMenuFooter = (selecter: string, afterSelecter: string, beforeSelecter: string) => {
      const ft_cate = document.querySelector(selecter);
      ft_cate?.classList.toggle('max-lg:!h-[247px]');
      const afterSelecterElement = document.querySelector(afterSelecter);
      afterSelecterElement?.classList.toggle('hidden');
      const beforeSelecterElement = document.querySelector(beforeSelecter);
      beforeSelecterElement?.classList.toggle('hidden');
   };

   const showUserTag = () => {
      const bodyElement = document.querySelector('body');
      bodyElement?.classList.toggle('overflow-hidden');
      const overlay_user_tag_mobile = document.querySelector('.overlay-user-tag-mobile');
      overlay_user_tag_mobile?.classList.toggle('!opacity-[0.15]');
      overlay_user_tag_mobile?.classList.toggle('!visible');
      const user_tag_mobile_content = document.querySelector('.user-tag-mobile-content');
      user_tag_mobile_content?.classList.toggle('max-xl:translate-x-[0%]');
   };
   const showNotificationTag = () => {
      const bodyElement = document.querySelector('body');
      bodyElement?.classList.toggle('overflow-hidden');
      const overlay_notifi_tag_mobile = document.querySelector('.overlay-noti-tag-mobile');
      overlay_notifi_tag_mobile?.classList.toggle('!opacity-[0.15]');
      overlay_notifi_tag_mobile?.classList.toggle('!visible');
      const notifi_tag_mobile_content = document.querySelector('.noti-tag-mobile-content');
      notifi_tag_mobile_content?.classList.toggle('max-xl:translate-x-[0%]');
   };
   const handleRemoveProductInCart = (item: ICartDataBaseItem | ICartItems) => {
      if (auth.user._id) {
         deleteProductInCartDB(item?.productId?._id).then((res) => {
            res;
            message.success('Xoá sản phẩm khỏi giỏ hàng thành công');
         });
      } else {
         dispatch(removeFromCart({ id: item.productId._id }));
      }
   };

   const [subtotal, setSubtotal] = useState<number>(0);
   const [discount, setDiscount] = useState<number>(0);
   useEffect(() => {
      if (auth.user._id) {
         const temp = cartdb?.body.data.products?.reduce((cal: any, product: any) => {
            return cal + product.weight * (product.productId.price-(product.productId.price*product.productId.discount/100));
         }, 0);

         if (temp !== undefined) {
            setSubtotal(temp);
         }
      }
   }, [data, voucher, cartdb]);
   useEffect(() => {
      if (voucher && auth.user._id) {
         if (voucher?.maxReduce) {
            if (voucher.maxReduce < subtotal) {
               setDiscount(voucher.maxReduce);
            } else {
               setDiscount((subtotal * voucher.percent) / 100);
            }
         } else {
            setDiscount((subtotal * voucher.percent) / 100);
         }
      }
   }, [data, subtotal, voucher]);
   const [messages, setMesssages] = useState<string>();
   const { data: chat, refetch } = useGetOneChatUserQuery(auth.user._id!, {
      skip: !auth.user._id || auth.user.role == 'admin'
   });

   useEffect(() => {
      const handleUpdateChat = () => {
         if (auth?.user?.role == 'member') {
            if (audioPlayer.current !== null) {
               audioPlayer.current.play();
            }
            refetch();
         }
      };
      if (auth.user._id && clientSocket) {
         clientSocket.on('updatemess', handleUpdateChat);
      }
      return () => {
         clientSocket.off('updatemess', handleUpdateChat);
         clientSocket.disconnect();
      }
   }, [auth]);

   useEffect(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollIntoView({ block: 'end' });
      }
      if (openChat == true && auth?.user?._id && auth?.user?.role == 'member') {
         updateIsRead(auth.user._id);
      }
   }, [chat, openChat]);
   const handleChangeMessage = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target) setMesssages(e.target.value);
   };
   const handleSubmitChat = async (e: React.FormEvent) => {
      e.preventDefault();
      if (messages?.trim() != '') {
         const data = {
            roomChatId: auth.user?._id,
            content: messages,
            sender: 'client'
         };
         await sendMessage(data).unwrap().catch((err) => {
            if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
               setOpenChat(false);
               onHandleLogout()
            } 
         });
         const jsonData = JSON.stringify(data);
         clientSocket.emit('ClientSendMessage', jsonData);
      }
      setMesssages('');
   };
   return (
      <>
         <section
            style={{
               display: auth.user.role == 'admin' || !auth.user.role ? 'none' : 'block'
            }}
            onClick={() => {
               setOpenChat(!openChat);
               if (scrollRef.current) {
                  scrollRef.current.scrollIntoView({ block: 'end' });
               }
            }}
            className=' section-icon-contact fixed bottom-[105px] right-[24px] cursor-pointer z-[4]'
         >
            <div className="icon-contact-item w-[48px] h-[48px] rounded-[50%] border-[1px] text-center border-white shadow-[0_4px_8px_rgba(0,0,0,0.15)] bg-[#0090E4] animate-pulse_icon_contact after:[''] relative after:absolute after:z-[-1] after:w-[48px] after:h-[48px] after:left-0 after:top-0 before:rounded-[50%] before:bg-[#0090E4]  before:animate-euiBeaconPulseSmall2            before:absolute before:z-[-1] before:w-[48px] before:h-[48px] before:left-0 before:top-0 after:rounded-[50%] after:bg-[#0090E4]  after:animate-euiBeaconPulseSmall">
               <IoChatbubblesOutline className='text-white w-[30px] text-center m-auto h-[45px] animate-skew_icon_contact transition-all duration-300 ease-in-out' />
               <Badge
                  color='red'
                  count={
                     chat?.body?.data.messages.filter((item: any) => {
                        if (item.isRead == false && item.sender == 'admin') {
                           return item;
                        }
                     }).length
                  }
                  showZero={false}
                  offset={[-24, -50]}
               >
                  <></>
               </Badge>
            </div>
         </section>
         <section
            style={{
               display: openChat == true ? 'block' : 'none'
            }}
            className='chat max-sm:max-w-[316px] max-sm:bottom-[71px] max-md:right-[3px] max-w-[450px] min-w-[300px] rounded-t-md fixed bottom-[0px] right-[100px] shadow-[0_12px_28px_0_rgba(0,0,0,0.1)] z-[8] bg-white h-[455px]'
         >
            <div className='header-right justify-between rounded-t-md mb-[10px] bg-white  sticky top-[0] pl-[10px] flex items-center  shadow-[0_0_4px_rgba(0,0,0,0.2)] py-[5px]'>
               <div className='user ifo flex items-center gap-x-[10px]'>
                  <img
                     className='avatar w-[48px] h-[48px] rounded-[100%]'
                     src={'https://res.cloudinary.com/diqyzhuc2/image/upload/v1700971559/logo_ssgtuy_1_dktoff.png'}
                     alt=''
                  />
                  <span className='user-name text-black font-bold '>Admin - Fresh Mart</span>
               </div>
               <button type='button' onClick={() => setOpenChat(!openChat)}>
                  <MdOutlineCancel className='text-[#0A7CFF] text-[30px] mr-[10px]' />
               </button>
            </div>
            <div className='list-chat w-full overflow-scroll px-[5px] h-[350px] '>
               {chat?.body?.data?.messages?.map((item: any) => {
                  return (
                     <>
                        {item.sender == 'client' ? (
                           <div className='admin-message flex justify-end items-center mb-[6px]  '>
                              <div className='content-admin ml-[10px] bg-[#0A7CFF] max-w-[60%] break-words text-left rounded-[15px] px-[12px] py-[8px]'>
                                 <span className='admin-name text-white  font-[400]'>{item.content}</span>
                              </div>
                           </div>
                        ) : (
                           <div className='use-message flex items-center mb-[6px]'>
                              <img
                                 className='avatar w-[38px] h-[38px] rounded-[100%]'
                                 src='https://res.cloudinary.com/diqyzhuc2/image/upload/v1700971559/logo_ssgtuy_1_dktoff.png'
                                 alt=''
                              />
                              <div className='content-user ml-[10px] bg-[#E5E5E5] break-words max-w-[60%] rounded-[15px] px-[12px] py-[8px] text-left'>
                                 <span className='user-name text-black  font-[400]  '>{item.content}</span>
                              </div>
                           </div>
                        )}
                     </>
                  );
               })}
               <div ref={scrollRef!}></div>
            </div>
            <form
               action=''
               className='flex  w-full px-[5px] items-center py-[5px]  sticky bottom-0 bg-white   '
               onSubmit={handleSubmitChat}
            >
               <input
                  onChange={handleChangeMessage}
                  value={messages}
                  placeholder='Aa'
                  className=' pl-[15px] text-black outline-none bg-[#E5E5E5] w-[90%] h-[30px] rounded-[20px]'
                  type='text'
               />
               <div className='p-[8px] hover:bg-[E5E5E5] w-[7%] rounded-[50%]  flex items-center'>
                  <button className='text-[#0A7CFF] ml-[3px]'>
                     <IoSend className='text-[20px]'></IoSend>
                  </button>
               </div>
            </form>
         </section>

         <footer className='bg-[#f8f8f8] '>
            <div className=' mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
               <ul className='footer-list flex py-[60px] flex-wrap ml-[-30px]'>
                  <li className='footer-if  w-full lg:w-[calc(35%-30px)] ml-[30px]'>
                     <div className='logo-ft '>
                        <img className='max-w-[120px]' src={logoUrl} alt='logo' />
                     </div>
                     <div className='footer-if-text leading-7 '>
                        <p>
                           <br />
                           <span>
                              Địa chỉ: Lô A2, CN5, Cụm Công nghiệp Từ Liêm, Phường Phương Canh, Quận Nam Từ Liêm, Thành
                              phố Hà Nội, Việt Nam.
                           </span>
                        </p>
                     </div>
                     <div className='call-line mt-[30px] flex items-center'>
                        <div className='call-icon mr-[15px] text-[50px] text-[#51A55C]'>
                           <FiHeadphones></FiHeadphones>
                        </div>
                        <div className='call-if'>
                           <p className='call-title text-[#333333] text-[20px] font-bold'>Số HOTLINE:</p>
                           <span className='call-phonenumber text-[16px]'>0888 888 888</span>
                        </div>
                     </div>
                  </li>
                  <li className='footer-if ft-cate list-link ml-[30px] transition-all duration-500  lg:w-[calc(21%-30px)] w-full max-lg:mt-[15px] max-lg:h-[51px]  overflow-hidden max-lg:pb-[10px]'>
                     <div className='ft-title  font-bold text-[#6F6F6F] text-[18px] relative max-lg:mb-[30px] '>
                        Danh mục
                        <button
                           onClick={() => showSudMenuFooter('.ft-cate', '.icon-1-ft-cate', '.icon-2-ft-cate')}
                           className='lg:hidden border-b-[1px]  border-[#e2e2e2] w-full h-full pb-[40px] absolute top-0 left-0  cursor-pointer'
                           type='button'
                        >
                           <FaPlus className=' icon-1-ft-cate absolute right-0 top-[8px] text-[12px] '></FaPlus>
                           <FaWindowMinimize className='hidden icon-2-ft-cate absolute right-0 top-[4px] text-[12px]'></FaWindowMinimize>
                        </button>
                     </div>

                     <ul className='ft-sublist'>
                        {data?.body.data.slice(0, 5).map((item) => {
                           return (
                              <>
                                 <li className='text-[16px] mt-[15px] hover:text-[#51A55C] transition-colors duration-300'>
                                    <Link to={'/collections?cate_id=' + item._id}>{item.cateName}</Link>
                                 </li>
                              </>
                           );
                        })}
                     </ul>
                  </li>
                  <li className='footer-if list-link ft-policy ml-[30px] transition-all duration-500  lg:w-[calc(21%-30px)] w-full max-lg:mt-[15px] max-lg:h-[45px]  overflow-hidden max-lg:pb-[10px]'>
                     <div className='ft-title font-bold text-[#6F6F6F] text-[18px] relative'>
                        Chính sách và dịch vụ
                        <button
                           onClick={() => showSudMenuFooter('.ft-policy', '.icon-1-ft-policy', '.icon-2-ft-policy')}
                           className='lg:hidden border-b-[1px]  border-[#e2e2e2] w-full h-full pb-[40px] absolute top-0 left-0  cursor-pointer'
                           type='button'
                        >
                           <FaPlus className=' icon-1-ft-policy absolute right-0 top-[8px] text-[12px] '></FaPlus>
                           <FaWindowMinimize className='hidden icon-2-ft-policy absolute right-0 top-[4px] text-[12px]'></FaWindowMinimize>
                        </button>
                     </div>

                     <ul className='ft-sublist'>
                        <li className='text-[16px] mt-[15px] hover:text-[#51A55C] transition-colors duration-300'>
                           <a href='#'>Chính sách bảo mật</a>
                        </li>
                        <li className='text-[16px] mt-[15px] hover:text-[#51A55C] transition-colors duration-300'>
                           <a href='#'>Chính sách hoàn trả</a>
                        </li>
                        <li className='text-[16px] mt-[15px] hover:text-[#51A55C] transition-colors duration-300'>
                           <a href='#'>Điều khoản & Điều kiện</a>
                        </li>
                        <li className='text-[16px] mt-[15px] hover:text-[#51A55C] transition-colors duration-300'>
                           <a href='#'>Chăm sóc khách hàng</a>
                        </li>
                        <li className='text-[16px] mt-[15px] hover:text-[#51A55C] transition-colors duration-300'>
                           <a href='#'>Danh sách yêu thích</a>
                        </li>
                     </ul>
                  </li>
                  <li className='footer-if list-link-instar ml-[30px] w-full lg:w-[calc(23%-30px)] max-lg:mt-[20px] '>
                     <div className='ft-title font-bold text-[#6F6F6F] text-[18px] mb-[5px] relative'>
                        Theo dõi trên instagram
                     </div>
                     <div className='list-img flex flex-wrap'>
                        <div className='list-img-item relative mr-[15px] mt-[15px] h-[calc(50%-15px)] w-[calc(33%-15px)]  object-cover '>
                           <Link
                              to={'#'}
                              className='ft-img-overlay opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[5px] bg-[#00000033] h-full absolute top-0 left-0 right-0 flex items-center justify-center'
                           >
                              <FaInstagram className='text-white text-[18px]'></FaInstagram>
                           </Link>
                           <img
                              className='w-full h-full rounded-[5px]'
                              src='https://spacingtech.com/html/tm/freozy/freezy-ltr/image/footer/f-1.jpg'
                              alt=''
                           />
                        </div>
                        <div className='list-img-item relative mr-[15px] mt-[15px] h-[calc(50%-15px)]  w-[calc(33%-15px)] object-cover '>
                           <Link
                              to={'#'}
                              className='ft-img-overlay opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[5px] bg-[#00000033] h-full absolute top-0 left-0 right-0 flex items-center justify-center'
                           >
                              <FaInstagram className='text-white text-[18px]'></FaInstagram>
                           </Link>
                           <img
                              className='w-full h-full rounded-[5px]'
                              src='	https://spacingtech.com/html/tm/freozy/freezy-ltr/image/footer/f-2.jpg'
                              alt=''
                           />
                        </div>
                        <div className='list-img-item relative mr-[15px] mt-[15px] h-[calc(50%-15px)] w-[calc(33%-15px)] object-cover '>
                           <Link
                              to={'#'}
                              className='ft-img-overlay opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[5px] bg-[#00000033] h-full absolute top-0 left-0 right-0 flex items-center justify-center'
                           >
                              <FaInstagram className='text-white text-[18px]'></FaInstagram>
                           </Link>
                           <img
                              className='w-full h-full rounded-[5px]'
                              src='https://spacingtech.com/html/tm/freozy/freezy-ltr/image/footer/f-3.jpg'
                              alt=''
                           />
                        </div>
                        <div className='list-img-item relative mr-[15px] mt-[15px] h-[calc(50%-15px)] w-[calc(33%-15px)]  object-cover '>
                           <Link
                              to={'#'}
                              className='ft-img-overlay opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[5px] bg-[#00000033] h-full absolute top-0 left-0 right-0 flex items-center justify-center'
                           >
                              <FaInstagram className='text-white text-[18px]'></FaInstagram>
                           </Link>
                           <img
                              className='w-full h-full rounded-[5px]'
                              src='https://spacingtech.com/html/tm/freozy/freezy-ltr/image/footer/f-4.jpg'
                              alt=''
                           />
                        </div>
                        <div className='list-img-item relative mr-[15px] mt-[15px] h-[calc(50%-15px)]  w-[calc(33%-15px)] object-cover '>
                           <Link
                              to={'#'}
                              className='ft-img-overlay opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[5px] bg-[#00000033] h-full absolute top-0 left-0 right-0 flex items-center justify-center'
                           >
                              <FaInstagram className='text-white text-[18px]'></FaInstagram>
                           </Link>
                           <img
                              className='w-full h-full rounded-[5px]'
                              src='https://spacingtech.com/html/tm/freozy/freezy-ltr/image/footer/f-5.jpg'
                              alt=''
                           />
                        </div>
                        <div className='list-img-item relative mr-[15px] mt-[15px] h-[calc(50%-15px)] w-[calc(33%-15px)] object-cover '>
                           <Link
                              to={'#'}
                              className='ft-img-overlay opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-[5px] bg-[#00000033] h-full absolute top-0 left-0 right-0 flex items-center justify-center'
                           >
                              <FaInstagram className='text-white text-[18px]'></FaInstagram>
                           </Link>
                           <img
                              className='w-full h-full rounded-[5px]'
                              src='https://spacingtech.com/html/tm/freozy/freezy-ltr/image/footer/f-6.jpg'
                              alt=''
                           />
                        </div>
                     </div>
                  </li>
               </ul>
            </div>
         </footer>
         <section className='section-search-modal translate-y-[-100%] transition-all duration-300  hidden fixed top-0 left-0 right-0  py-[30px] bg-white z-[7] '>
            <div className='container mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
               <div className='search-modal-content '>
                  <div className='text-right'>
                     <button
                        // onClick={closeModalSearch}
                        type='button'
                        className='close-modal-search text-[20px] text-[#6f6f6f]'
                     >
                        <FaXmark></FaXmark>
                     </button>
                  </div>
                  <form className='form-search relative' action=''>
                     <input
                        className='w-full outline-none border-b-[1px] border-[#e2e2e2] py-[10px] text-[#6f6f6f]'
                        type='text'
                        placeholder='Tìm kiếm sản phẩm...'
                     />
                     <button className='absolute right-0 translate-y-[50%] bottom-[50%]'>
                        <SearchOutlined className='text-[20px] text-[#6f6f6f]'></SearchOutlined>
                     </button>
                  </form>
               </div>
            </div>
         </section>

         <section className='section-mobile-menu max-sm:block hidden  '>
            <div className='mobile-menu-content  pt-[10px] z-[4] flex justify-between fixed bottom-0 left-0 right-0 rounded-t-xl shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]  bg-white'>
               <div className='mobile-menu-item text-[#939596] p-[5px] text-center flex items-end justify-center w-[20%] '>
                  <Link to='/'>
                     <BiStore className='m-auto' style={{ fontSize: '24px' }} />
                     <p className='  text-[10px] sm:text-[12px]'>Trang chủ</p>
                  </Link>
               </div>

               <div className='mobile-menu-item text-[#939596] p-[5px] text-center w-[20%] '>
                  <SearchFilter>
                     <SearchOutlined style={{ fontSize: '24px' }} />
                  </SearchFilter>
                  <p className='  text-[10px]  sm:text-[12px]'>Tìm kiếm</p>
               </div>
               <div
                  onClick={showMiniCart}
                  className='mobile-menu-item text-[#939596] p-[5px] text-center w-[20%] flex flex-col'
               >
                  <div className='test relative w-[24px] h-[24px] m-auto '>
                     <HiOutlineShoppingBag style={{ fontSize: '24px' }} />
                     <Badge
                        count={cart?.length}
                        showZero={false}
                        className='custom-badge    text-[9px]  right-[2px] top-[4px] absolute text-white'
                     >
                        <li
                           onClick={showMiniCart}
                           className='max-sm:hidden header-icon-item header-search-icon text-[20px] flex flex-col ml-[30px] relative transition-colors  duration-300 cursor-pointer hover:text-[#d2401e]   '
                        >
                           <HiOutlineShoppingBag></HiOutlineShoppingBag>
                        </li>
                     </Badge>
                  </div>
                  <p className=' text-[10px] mt-[2px] sm:text-[12px]'>Giỏ hàng</p>
               </div>
               {auth.user?._id && (
                  <div
                     onClick={showNotificationTag}
                     className='mobile-menu-item text-[#939596] p-[5px] text-center w-[20%] flex flex-col'
                  >
                     <div className='test relative w-[24px] h-[24px] m-auto '>
                        <BsBell style={{ fontSize: '24px' }} />
                        <Badge
                           className='custom-badge    text-[9px]  right-[-5px] top-[-6px] absolute text-white'
                           count={clientNotification?.body?.data?.filter((noti: any) => noti.isRead == false).length}
                           showZero={false}
                        ></Badge>
                     </div>
                     <p className=' text-[10px] sm:text-[12px] mt-[2px]'>Thông báo</p>
                  </div>
               )}
               <div onClick={showUserTag} className='mobile-menu-item text-[#939596] p-[5px] text-center w-[20%] '>
                  <UserOutlined style={{ fontSize: '24px' }} />
                  <p className='  text-[10px] sm:text-[12px]'>Tài khoản</p>
               </div>
            </div>
         </section>
         <section className='section-mini-cart '>
            {cart?.length === 0 || cart?.length == undefined ? (
               <div className='cart-emty'>
                  <div className='container mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
                     <div
                        onClick={showMiniCart}
                        className='mini-cart-overlay hidden overlay-menu-homepage  fixed w-[110%] top-0 bottom-0 left-0 right-0 z-[6] opacity-[0.5] bg-[#333333]  '
                     ></div>
                  </div>
                  <div className='wrap-mini-cart transition-all duration-300 translate-x-[100%] w-[320px] flex h-full fixed  top-0 right-0 flex-col bg-white text-[#6f6f6f]  z-[8]'>
                     <div className='mini-cart-header flex border-b-[#e2e2e2] border-[1px]    '>
                        <p className='cart-header-text w-full gap-[10px] py-[10px] px-[15px] flex items-center  text-[14px]'>
                           <span className='cart-count px-[8px] text-[14px] py-[4px] text-white bg-[#d2401e]'>
                              {cart?.length}
                           </span>
                           sản phẩm trong giỏ hàng
                        </p>
                        <button
                           onClick={showMiniCart}
                           className='close-mini-cart text-[#333333] text-[20px] mt-[5px] cursor-pointer hover:opacity-100 mr-[15px]  opacity-[0.5]'
                           type='button'
                        >
                           <FaXmark></FaXmark>
                        </button>
                     </div>
                     <div className='mini-cart-content overflow-auto m-h-[100%-269px]'>
                        <ul className='cart-item relative'>
                           <li className='cart-product border-[#e2e2e2] items-center text-center mt-[50] border-t-[1px] relative first:border-none '>
                              <p className='cart-title xl:text-[20px] border-[#e2e2e2] max-xl:text-[20px] text-[red] font-bold pb-[12px]'>
                                 Không có sản phẩm trong giỏ hàng
                              </p>
                              <div className='start-shopping cart-title  border-[#e2e2e2] gap-2 text-[#51A55C] font-bold flex justify-center items-center text-center pb-[12px]'>
                                 <Link
                                    to={'/collections'}
                                    onClick={showMiniCart}
                                    className='block  xl:text-[14px] max-xl:text-[14px] view-cart w-[40%] transition-all duration-300 hover:bg-[#333333] rounded-[50px] py-[10px] px-[30px] bg-[#d2401e] text-white text-center mb-[20px]'
                                 >
                                    Mua hàng
                                 </Link>
                                 <Link
                                    to={'/cart'}
                                    onClick={showMiniCart}
                                    className='block  xl:text-[14px] max-xl:text-[14px] view-cart w-[40%] transition-all duration-300 hover:bg-[#333333] rounded-[50px] py-[10px] px-[30px] bg-[#d2401e] text-white text-center mb-[20px]'
                                 >
                                    Giỏ hàng
                                 </Link>
                              </div>
                           </li>
                        </ul>
                     </div>
                  </div>
               </div>
            ) : (
               <div>
                  <div className='container mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
                     <div
                        onClick={showMiniCart}
                        className='mini-cart-overlay hidden overlay-menu-homepage  fixed w-[110%] top-0 bottom-0 left-0 right-0 z-[6] opacity-[0.5] bg-[#333333]  '
                     ></div>
                  </div>
                  <div className='wrap-mini-cart transition-all duration-300 translate-x-[100%] w-[320px] flex h-full fixed  top-0 right-0 flex-col bg-white text-[#6f6f6f]  z-[8]'>
                     <div className='mini-cart-header flex border-b-[#e2e2e2] border-[1px]    '>
                        <p className='cart-header-text w-full gap-[10px] py-[10px] px-[15px] flex items-center  text-[14px]'>
                           <span className='cart-count px-[8px] text-[14px] py-[4px] text-white bg-[#d2401e]'>
                              {cart?.length}
                           </span>
                           sản phẩm trong giỏ hàng
                        </p>
                        <button
                           onClick={showMiniCart}
                           className='close-mini-cart text-[#333333] text-[20px] mt-[5px] cursor-pointer hover:opacity-100 mr-[15px]  opacity-[0.5]'
                           type='button'
                        >
                           <FaXmark></FaXmark>
                        </button>
                     </div>
                     <div className='mini-cart-content overflow-auto m-h-[100%-269px]'>
                        <ul className='cart-item relative'>
                           {cart?.map((item: any, index: number) => (
                              <li
                                 key={index}
                                 className='cart-product p-[15px] flex border-[#e2e2e2] border-t-[1px] relative first:border-none '
                              >
                                 <div className='cart-img w-[65px]'>
                                    <Link to={'#'}>
                                       <img
                                          className='m-w-full h-[69px]  border-[#e2e2e2] border-[1px]'
                                          src={item.productId?.images[0]?.url}
                                          alt=''
                                       />
                                    </Link>
                                 </div>
                                 <div className='cart-content w-[calc(100%-65px)] pl-[15px] flex flex-col justify-center'>
                                    <Link
                                       to={'#'}
                                       className='product-name font-bold text-[16px] text-[#6f6f6f] overflow-ellipsis whitespace-nowrap'
                                    >
                                       {item.productId?.productName}
                                    </Link>
                                    <div className='product-info mt-[9px] flex'>
                                       <span className='product-qt text-[16px]'>{item?.weight}kg ×</span>
                                       <span className='product-price text-[#d2401e] text-[16px] ml-[5px]'>
                                          {item.productId?.discount
                                             ? (
                                                item?.productId?.price -
                                                (item?.productId?.price * item?.productId?.discount) / 100
                                             ).toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                             })
                                             : item.productId?.price.toLocaleString('vi-VN', {
                                                style: 'currency',
                                                currency: 'VND'
                                             })}
                                       </span>
                                    </div>
                                    <div className='delete-cart'>
                                       <button
                                          onClick={() => handleRemoveProductInCart(item)}
                                          type='button'
                                          className='absolute right-[15px] bottom-[15px] text-[20px] opacity-[0.6] text-[#dc3545] hover:opacity-100'
                                       >
                                          <HiOutlineTrash></HiOutlineTrash>
                                       </button>
                                    </div>
                                 </div>
                              </li>
                           ))}
                        </ul>
                     </div>
                     <div className='mini-cart-footer'>
                        {voucher._id && auth.user._id && (
                           <div className='subtotal flex justify-between px-[15px] py-[10px] border-t-[#e2e2e2] border-[1px]'>
                              <span className='subtotal-title text-[16px] '>Tính tạm:</span>
                              <span className='subtotal-price text-[#d2401e] font-bold text-[16px]'>
                                 {subtotal.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                              </span>
                           </div>
                        )}
                        {voucher._id && auth.user._id && (
                           <div className='subtotal flex justify-between px-[15px] py-[10px] border-t-[#e2e2e2] border-[1px]'>
                              <span className='subtotal-title text-[16px] '>Giảm giá:</span>
                              <span className='subtotal-price text-[#d2401e] font-bold text-[16px]'>
                                 -{discount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                              </span>
                           </div>
                        )}
                        <div className='subtotal flex justify-between px-[15px] py-[10px] border-t-[#e2e2e2] border-[1px]'>
                           <span className='subtotal-title text-[16px] '>Tổng:</span>
                           <span className='subtotal-price text-[#d2401e] font-bold text-[16px]'>
                              {auth.user._id
                                 ? (
                                    cart?.reduce(
                                       (accumulator: number, product: any) =>
                                          accumulator +
                                          (product.productId.price -
                                             (product.productId.price * product.productId.discount) / 100) *
                                          product.weight,
                                       0
                                    ) -
                                    (voucher.maxReduce
                                       ? voucher.maxReduce
                                       : auth.user._id
                                          ? (cart?.reduce(
                                             (accumulator: number, product: any) =>
                                                accumulator +
                                                (product.productId.price -
                                                   (product.productId.price * product.productId.discount) / 100) *
                                                product.weight,
                                             0
                                          ) *
                                             voucher.percent) /
                                          100
                                          : totalPrice - (totalPrice * voucher.percent) / 100)
                                 ).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                 : totalPrice?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                           </span>
                        </div>

                        <div className='cart-btn px-[15px] pb-[15px] pt-[10px] w-full'>
                           <Link
                              to={'/cart'}
                              onClick={showMiniCart}
                              className='block  text-[14px] view-cart w-[100%] transition-all duration-300 hover:bg-[#333333] rounded-[50px] py-[12px] px-[30px] bg-[#d2401e] text-white text-center mb-[20px]'
                           >
                              GIỎ HÀNG
                           </Link>
                           <Link
                              to={'/checkout'}
                              onClick={showMiniCart}
                              className='block text-[14px]  view-cart w-[100%] transition-all duration-300 hover:bg-[#333333] rounded-[50px] py-[12px] px-[30px] bg-[#d2401e] text-white text-center'
                           >
                              THANH TOÁN
                           </Link>
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </section>

         <section className=' section-icon-to-top transition-all duration-300 fixed bottom-[180px] right-[30px] cursor-pointer z-[4] invisible opacity-0'>
            <div
               onClick={toTop}
               className='to-top-content  transition-all duration-300 hover:bg-white hover:text-[#d2401e] text-white text-[16px] h-[40px] w-[40px] bg-[#d2401e] rounded-[5px] flex items-center justify-center shadow-[0px_0px_10px_rgba(51,51,51,0.15)]'
            >
               <FaArrowUp></FaArrowUp>
            </div>
         </section>
         <section className='user-tag-moble w-[320px]'>
            <div
               onClick={showUserTag}
               className='overlay-user-tag-mobile xl:hidden fixed w-[100%] top-0 bottom-0 left-0 right-0 z-[7] opacity-0 bg-[#333333]   invisible'
            ></div>
            <div className='user-tag-mobile-content transition duration-300 fixed top-0 left-0 h-full bg-white z-[8] min-w-[320px] translate-x-[-100%]'>
               <ul>
                  <li className='px-[15px] py-[10px] flex justify-end'>
                     <span onClick={showUserTag} className='cursor-pointer text-center'>
                        <FaXmark className='text-[20px]'></FaXmark>
                     </span>
                  </li>
                  {!auth.accessToken && (
                     <>
                        <li onClick={showUserTag} className='px-[15px] py-[10px] hover:bg-[#51A55C] hover:text-white'>
                           <Link to={'/login'} className='flex items-center gap-[5px] py-[5px]'>
                              <FiLogIn></FiLogIn> Đăng nhập
                           </Link>
                        </li>
                        <li onClick={showUserTag} className='px-[15px] py-[10px] hover:bg-[#51A55C] hover:text-white'>
                           <Link to={'/signup'} className='flex items-center gap-[5px] py-[5px]'>
                              <AiOutlineUserAdd></AiOutlineUserAdd> Đăng ký
                           </Link>
                        </li>
                        <li onClick={showUserTag} className='px-[15px] py-[10px] hover:bg-[#51A55C] hover:text-white'>
                           <Link to='forgetPassword' className='flex items-center gap-[5px] py-[5px]'>
                              <MdOutlineLockReset></MdOutlineLockReset> Quên mật khẩu
                           </Link>
                        </li>
                     </>
                  )}
                  {auth.accessToken && (
                     <>
                        {auth.user.role == 'admin' && (
                           <li
                              onClick={showUserTag}
                              className='px-[15px] py-[10px] hover:bg-[#51A55C] hover:text-white'
                           >
                              <Link to='/manage' className='flex items-center gap-[5px] py-[5px]'>
                                 <PiUserListBold></PiUserListBold> Quản lý cửa hàng
                              </Link>
                           </li>
                        )}
                        <li onClick={showUserTag} className='px-[15px] py-[10px] hover:bg-[#51A55C] hover:text-white'>
                           <Link to='/userInformation' className='flex items-center gap-[5px] py-[5px]'>
                              <LuUser2></LuUser2> Hồ sơ của bạn
                           </Link>
                        </li>
                        <li onClick={showUserTag} className='px-[15px] py-[10px] hover:bg-[#51A55C] hover:text-white'>
                           <Link to='orders' className='flex items-center gap-[5px] py-[5px]'>
                              <RiBillLine></RiBillLine> Lịch sử mua hàng
                           </Link>
                        </li>
                        <li onClick={showUserTag} className='px-[15px] py-[10px] hover:bg-[#51A55C] hover:text-white'>
                           <Link to='changePassword' className='flex items-center gap-[5px] py-[5px]'>
                              <MdOutlineLockReset></MdOutlineLockReset> Đổi mật khẩu
                           </Link>
                        </li>
                        <li onClick={showUserTag} className='px-[15px] py-[10px] hover:bg-[#51A55C] hover:text-white'>
                           <button onClick={() => onHandleLogout()} className='flex items-center gap-[5px] py-[5px]'>
                              <FiLogOut></FiLogOut> Đăng xuất
                           </button>
                        </li>
                     </>
                  )}
               </ul>
            </div>
         </section>
         {auth.user?._id && (
            <section className='noti-tag-moble '>
               <div
                  onClick={showNotificationTag}
                  className='overlay-noti-tag-mobile xl:hidden  fixed w-[100%] top-0 bottom-0 left-0 right-0 z-[7] opacity-0 bg-[#333333]   invisible'
               ></div>
               <div className='noti-tag-mobile-content w-[320px] transition duration-300 fixed top-0 left-0 h-full bg-white z-[8] min-w-[320px] translate-x-[-100%]'>
                  <ul>
                     <li className='px-[15px] py-[10px] flex justify-end'>
                        <span onClick={showNotificationTag} className='cursor-pointer text-center'>
                           <FaXmark className='text-[20px]'></FaXmark>
                        </span>
                     </li>

                     <li className='px-[15px] py-[10px] '>
                        <div className='max-h-[450px] w-full overflow-scroll '>
                           {clientNotification?.body?.data?.map((noti: INotification, index: number) => (
                              <div key={index} className='relative border-b-[1px] w-[270px] border-gray-400  p-2  '>
                                 <Link
                                    onClick={async () => {
                                       await updateNotification({ id: noti._id, isRead: true });
                                    }}
                                    to={noti.link}
                                    className='w-[270px] block'
                                 >
                                    {!noti.isRead && (
                                       <span className='absolute top-2 right-2 w-[15px] h-[15px] bg-red-500 rounded-full text-center text-white text-[9px]'>
                                          !
                                       </span>
                                    )}
                                    <h1 className='font-bold break-words'>{noti.title}</h1>
                                    <p className='text-gray-400 '>{noti.message}</p>
                                    <span className='text-gray-400'>{formatStringToDate(noti.createdAt)}</span>
                                 </Link>
                                 <p className='text-right mt-2 absolute bottom-0 right-2 bg-red-300 px-3 py-1 mb-2 text-white hover:bg-red-400 duration-300'>
                                    <button
                                       onClick={async () => {
                                          await deleteNotification(noti._id);
                                       }}
                                       className='text-black-300 hover:underline'
                                    >
                                       Xóa
                                    </button>
                                 </p>
                              </div>
                           ))}
                        </div>
                     </li>
                  </ul>
               </div>
               <audio ref={audioPlayer} src={NotificationSound} />
            </section>
         )}
      </>
   );
};

export default Footer;
