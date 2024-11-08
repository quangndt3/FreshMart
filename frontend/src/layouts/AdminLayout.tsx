/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
   PieChartOutlined,
   UserOutlined,
   MenuFoldOutlined,
   MenuUnfoldOutlined,
   NotificationOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Badge, Button, Layout, Menu, message, theme } from 'antd';
import { Outlet } from 'react-router';
import { logoUrl } from '../constants/imageUrl';
import ProductIcon from '../components/Icons/ProductIcon';
import { Link, useLocation } from 'react-router-dom';
import TicketIcon from '../components/Icons/TicketIcon';
import OrderIcon from '../components/Icons/OrderIcon';
import HeaderAdmin from '../components/layout/HeaderAdmin';
import { useNavigate } from 'react-router-dom';
import { FaTruckRampBox } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import ReSizePage from '../pages/ReSizePage';
import Loading from '../components/Loading/Loading';
import { useGetAllChatQuery } from '../services/chat.service';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import { saveTokenAndUser } from '../slices/authSlice';
import { useGetTokenQuery } from '../services/auth.service';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[]): MenuItem {
   return {
      key,
      icon,
      children,
      label
   } as MenuItem;
}

const AdminLayout = () => {
   const [collapsed, setCollapsed] = useState(false);
   const [checking, setChecking] = useState(true);
   const [open, setOpen] = useState(false);
   const reload = useSelector((state: { noticeReducer: { reload: boolean } }) => state.noticeReducer.reload);
   const { data, isLoading, refetch } = useGetTokenQuery();
   const auth = useSelector((state: any) => state.userReducer);
   const navigate = useNavigate();
   const { pathname } = useLocation();
   const dispatch = useDispatch();
   const {
      data: allChat,
      isLoading: chatLoading,
      refetch: getAllRefetch
   } = useGetAllChatQuery({}, { skip: auth?.user?.id });
   const [messagesCount, setMessagesCount] = useState<number>(0);
   useEffect(() => {
      getAllRefetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [reload]);

   useEffect(() => {
      if (!chatLoading && allChat) {
         let count: number = 0;
         allChat?.body.data.map((room: any) =>
            room.messages.filter((message: any) => {
               if (message.isRead == false && message.sender == 'client') {
                  count += 1;
               }
            })
         );
         setMessagesCount(count);
      }
   }, [allChat, chatLoading]);

   const items: MenuItem[] = [
      getItem(<Link to='/manage/dashboard'>Trang chủ</Link>, '1', <PieChartOutlined />),
      getItem('Sản phẩm cửa hàng', '2', <ProductIcon />, [
         getItem(<Link to='/manage/products'>Sản phẩm</Link>, '3'),
         getItem(<Link to='/manage/categories'>Danh mục</Link>, '4'),
         getItem(<Link to='/manage/shipments'>Lô hàng</Link>, '5'),
         getItem(<Link to='/manage/origin'>Nguồn gốc</Link>, '6')
      ]),
      getItem(<Link to='/manage/orders'>Đơn hàng</Link>, 'sub1', <OrderIcon />),
      getItem(<Link to='/manage/vouchers'>Mã khuyễn mãi</Link>, 'sub2', <TicketIcon />),
      getItem(<Link to='/manage/evaluation'>Quản lý đánh giá</Link>, 'sub3', <UserOutlined />),
      getItem(<Link to='/manage/unsoldproduct'>Sản phẩm thất thoát</Link>, 'sub4', <FaTruckRampBox />),
      getItem(<Link to='/manage/account'>Quản lý tài khoản</Link>, 'sub5', <UserOutlined />),
      getItem(<Link to='/manage/chat' className='block w-full h-full'>
         Tư vấn mua hàng
         {messagesCount > 0 && <Badge
            color='red'
            count={
               <p className='!bg-red-400 text-white text-center w-6 h-6 flex flex-col justify-center leading-6 rounded-full text-xs'>
                  {messagesCount}
               </p>
            }
            showZero={false}
            offset={[20, 0]}
         >

         </Badge>}

      </Link>, 'sub6', <NotificationOutlined />)
   ];

   const ButtonTrigger = (
      <button className='bg-greenPrimary text-white w-full font-semibold'>{collapsed ? 'Hiện' : 'Ẩn'}</button>
   );
   const {
      token: { colorBgContainer }
   } = theme.useToken();

   useEffect(() => {
      if (!isLoading && data?.body?.data) {
         (async () => await refetch().unwrap().then(async (res: any) => {
            if (data?.body?.data.accessToken != "" && res?.body?.data.accessToken == "" && Object.keys(auth.user).length > 0) {
               navigate('/?err=1');
            } else if (Object.keys(auth.user).length == 0 && checking) {
               if (Object.keys(res.body.data.data).length > 0) {
                  dispatch(saveTokenAndUser({ accessToken: res.body.data.accessToken, user: res.body.data.data }));
                  if (res.body.data.data.role != 'admin') {
                     message.warning('Bạn không có quyền hạn để truy cập vào trang này');
                     navigate('/');
                  }
               } else {
                  message.warning('Vui lòng đăng nhập để vào trang này');
                  navigate('/');
               }
            } else if (Object.keys(res.body.data.data).length > 0 && Object.keys(auth.user).length > 0 && !checking) {
               dispatch(saveTokenAndUser({ accessToken: res.body.data.accessToken, user: res.body.data.data }));
               if (res.body.data.data.role != 'admin') {
                  message.warning('Bạn không có quyền hạn để truy cập vào trang này');
                  navigate('/');
               }
            }
            setChecking(false)
         }))()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [data, isLoading, pathname])
   if (checking) {
      return (
         <div className='h-screen flex items-center justify-center'>
            <Loading sreenSize='lg' />
         </div>
      );
   }
   return (
      <>
         <div className='w-full md:hidden'>
            <ReSizePage />
            <ScrollToTop />
         </div>
         <Layout>
            <Sider
               width={250}
               collapsible
               collapsed={collapsed}
               onCollapse={(value) => setCollapsed(value)}
               style={{ background: colorBgContainer, position: 'fixed' }}
               className={
                  ' z-[999] transition-all ' +
                  (open ? '-translate-x-0' : '-translate-x-full') +
                  ' md:-translate-x-0 h-screen overflow-y-auto overflow-x-hidden'
               }
               trigger={ButtonTrigger}
            >
               <div className='w-full max-h-[95%] pb-5 overflow-y-auto'>
                  <div className='max-h-[150px] flex justify-center items-center'>
                     <Link to={'/'} className='flex justify-center items-center'>
                        <img src={logoUrl} alt='logo' className='max-w-[50%]' />
                     </Link>
                  </div>
                  <Menu theme='light' defaultSelectedKeys={['1']} mode='inline' items={items} />
               </div>
               <Button
                  className='bg-greenP300  border-none absolute right-[-30px] top-[70px] z-[999] md:hidden md:opacity-0 md:invisible'
                  onClick={() => setOpen((prev) => !prev)}
                  icon={open ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                  style={{ color: 'green' }}
               ></Button>
            </Sider>
            {open ? (
               <div
                  onClick={() => setOpen(false)}
                  className='fixed top-0 right-0 z-[101] w-screen h-full bg-[rgba(0,0,0,0.1)] md:hidden md:opacity-0 md:invisible'
               ></div>
            ) : (
               ''
            )}
            <Layout
               className={
                  'transition-all ' +
                  (!collapsed ? 'md:pl-[250px]' : 'md:pl-[80px] ') +
                  ' max-w-screen-[100%] overflow-x-hidden'
               }
            >
               <HeaderAdmin />
               <Content className=' w-full px-6  pt-[50px] pb-[50px] flex justify-center '>
                  <Outlet />
               </Content>
            </Layout>
         </Layout>
      </>
   );
};

export default AdminLayout;
