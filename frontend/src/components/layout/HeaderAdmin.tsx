/* eslint-disable @typescript-eslint/no-explicit-any */
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Badge, Dropdown, Layout, MenuProps, Popover, notification } from 'antd';
import BellIcon from '../Icons/BellIcon';
import { useEffect, useState, useRef } from 'react';
import { IAuth } from '../../slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { FiLogOut } from 'react-icons/fi';
import { useClearTokenMutation } from '../../services/auth.service';
import { Link, useLocation, useNavigate } from 'react-router-dom';
const { Header } = Layout;
import { deleteTokenAndUser } from '../../slices/authSlice';
import { adminSocket } from '../../config/socket';
import {
   useDeleteNotificationMutation,
   useGetAdminNotificationQuery,
   useUpdateNotificationMutation
} from '../../services/notification';
import { INotification } from '../../interfaces/notification';
import { formatStringToDate } from '../../helper';
import { setItem } from '../../slices/cartSlice';
import NotificationSound from '../../assets/notification-sound.mp3';
import { setState } from '../../slices/notice';

const pagePaths = [
   {
      title: 'Sản phẩm',
      link: 'products'
   },
   {
      title: 'Danh mục',
      link: 'categories'
   },
   {
      title: 'Lô hàng',
      link: 'shipments'
   },
   {
      title: 'Đơn hàng',
      link: 'orders'
   },
   {
      title: 'Thêm sản phẩm',
      link: 'add-product'
   },
   {
      title: 'Thêm danh mục',
      link: 'add-category'
   },
   {
      title: 'Thêm lô hàng',
      link: 'add-shipment'
   }
];
const HeaderAdmin = () => {
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const [triggerDrop, setTriggerDrop] = useState(false);
   const [clearToken] = useClearTokenMutation();
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [keyword, setKeyword] = useState('');
   const [path, setPath] = useState<any[]>([]);
   const location = useLocation();
   const { data: adminNotification, refetch } = useGetAdminNotificationQuery(auth?.user?._id);
   const [updateNotification] = useUpdateNotificationMutation();
   const [deleteNotification] = useDeleteNotificationMutation();
   const audioPlayer = useRef<HTMLAudioElement | null>(null)
   const onHandleLogout = () => {
      dispatch(deleteTokenAndUser());
      dispatch(setItem());
      clearToken();
      navigate('/');
   };
   useEffect(() => {
      adminSocket.open();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handlePurchaseNotification = (data: any) => {
         refetch();
         if (audioPlayer.current !== null) {
            audioPlayer.current.play()
         }
         notification.info({
            message: 'Bạn có thông báo mới',
            description: data?.data?.message || 'Kiểm tra ngay'
         });
      };

      adminSocket.on('purchaseNotification', handlePurchaseNotification);
      adminSocket.on('expireProduct', handlePurchaseNotification);
      adminSocket.on('adminStatusNotification', handlePurchaseNotification);
      adminSocket.on('updatemess', () => {
         if (audioPlayer.current !== null) {
            audioPlayer.current.play()
            dispatch(setState())
         }
      });
      return () => {
         adminSocket.off('purchaseNotification', handlePurchaseNotification);
         adminSocket.off('adminStatusNotification', handlePurchaseNotification);
         adminSocket.off('expireProduct', handlePurchaseNotification);
         adminSocket.off('updatemess');
         adminSocket.disconnect();
      };
   }, [auth, location.pathname]);
   useEffect(() => {
      if (keyword != '') {
         const array: any[] = [];
         pagePaths.map((data: any) => {
            if (data.title.toLowerCase().match(keyword.toLowerCase())) {
               array.push(data);
            }
         });
         setPath(array);
      } else {
         setPath([]);
      }
   }, [keyword]);
   const items: MenuProps['items'] = [
      {
         label: (
            <p className='lg:hidden xl:hidden 2xl:hidden 3xl:hidden font-bold text-greenPrimary'>
               {auth.user.userName}
            </p>
         ),
         key: '-1'
      },
      {
         label: <Link to='/userInformation'>Hồ sơ</Link>,
         key: '0'
      },
      {
         type: 'divider'
      },
      {
         label: (
            <button className='flex items-center gap-[5px] py-[5px]' onClick={() => onHandleLogout()}>
               <FiLogOut></FiLogOut>Đăng xuất
            </button>
         ),
         key: '3'
      }
   ];
   return (
      <Header
         style={{
            boxShadow: ' 0 3px 4px -2px rgba(0, 0, 0, 0.123)'
         }}
         className='pl-[10px] !pr-[10px] xl:!pr-[30px] bg-white flex md:justify-between items-center z-50 justify-start gap-2'
      >
         <div className='w-[80%] xl:w-[40%] flex justify-between items-center gap-2 rounded-lg border-[1px] border-[rgba(0,0,0,0.1)] px-3 py-2'>
            <SearchOutlined width={'1.5rem'} height={'1.5rem'} color='rgba(0,0,0,0.2)' />
            <Popover
               placement='bottomLeft'
               arrow={false}
               open={path.length > 0 ? true : false}
               content={() =>
                  path.map((data, index) => (
                     <Link to={'/manage/' + data.link} key={index} className='p-1 block'>
                        <h1 className='text-lg font-bold'>{data.title}</h1>
                     </Link>
                  ))
               }
            >
               <input
                  type='text'
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className='outline-none border-none h-full p-2 md:p-1 w-full'
                  placeholder='Tìm kiếm'
               />
            </Popover>
         </div>
         <div className='3xl:max-w-[15%] max-w-[30%] flex justify-end items-center gap-3'>
            <Dropdown
               menu={{ items }}
               trigger={['click']}
               onOpenChange={(open) => {
                  setTriggerDrop(open);
               }}
            >
               <div className='justify-center flex lg:justify-start items-center gap-2 lg:border-[1px] lg:border-[rgba(0,0,0,0.1)] rounded-full lg:p-2 lg:rounded-lg overflow-hidden h-[3rem] w-[50%] md:w-[20%] xl:w-[60%]'>
                  <img
                     src={auth.user.avatar}
                     alt='avatar'
                     className='rounded-full xl:rounded-md object-cover xl:w-[20%] aspect-square w-[80%]  '
                  />

                  <div className='hidden xl:flex-1 xl:flex xl:justify-start xl:gap-2 xl:items-center cursor-pointer p-1 text-center '>
                     <span className='font-medium text-sm text-[#6b6765] '>{auth.user.userName}</span>
                     <div className={triggerDrop ? 'round-up' : 'round-down'}>
                        <DownOutlined color='#6b6765' size={1} />
                     </div>
                  </div>
               </div>
            </Dropdown>
            <Popover
               placement='bottom'
               content={
                  <div className='max-h-[400px] lg:min-w-[350px] overflow-scroll pr-3 pl-2 w-[20rem] overflow-x-hidden'>
                     {adminNotification?.body?.data?.map((noti: INotification, index: number) => (
                        <div key={index} className='relative border-b-[1px] border-gray-400  p-2 hover:bg-gray-200'>
                           <Link
                              className='w-[400px] pb-4 block'
                              onClick={async () => {
                                 await updateNotification({ id: noti._id, isRead: true });
                              }}
                              to={noti.link}
                           >
                              <h1 className='font-bold break-words max-w-[80%]'>{noti.title}</h1>
                              <p className='text-gray-400 break-words max-w-[80%]'>{noti.message}</p>
                              <span className='text-gray-400'>{formatStringToDate(noti.createdAt)}</span>
                           </Link>
                           <p className='flex justify-between text-right mt-2 absolute bottom-0 right-2 bg-red-300 px-3 py-1 mb-2 text-white hover:bg-red-400 duration-300'>
                              <button
                                 onClick={async () => {
                                    await deleteNotification(noti._id);
                                 }}
                                 className='text-black-300 hover:underline'
                              >
                                 Xóa
                              </button>
                           </p>
                           {!noti.isRead && (
                              <span className='absolute top-3 right-2 w-[15px] h-[15px] bg-red-500 rounded-full text-center text-white text-[9px]'>
                                 !
                              </span>
                           )}
                        </div>
                     ))}
                  </div>
               }
               trigger='click'
            >
               <Badge
                  color='red'
                  count={
                     <p className='!bg-red-400 text-white w-6 h-6 flex justify-center items-center rounded-full text-xs'>
                        {adminNotification?.body?.data?.filter((noti: any) => noti.isRead == false).length}
                     </p>
                  }
                  showZero={false}
                  offset={[-3, 5]}
               >
                  <div className='relative  md:w-[2rem] md:h-[2rem] lg:w-[3rem] lg:h-[3rem] flex justify-center items-center rounded-xl p-2 bg-[#dfdede] cursor-pointer'>
                     <BellIcon />
                  </div>
               </Badge>
            </Popover>
            <audio ref={audioPlayer} src={NotificationSound} />
         </div>
      </Header>
   );
};

export default HeaderAdmin;
