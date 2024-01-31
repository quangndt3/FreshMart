import { createBrowserRouter } from 'react-router-dom';
import DefaultLayout from '../layouts/DefaultLayout';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/AdminPages/Dashboard/Dashboard';
import ProductAdmin from '../pages/AdminPages/Product/ProductAdmin';
import AddProduct from '../pages/AdminPages/Product/AddProduct';
import CategoryAdmin from '../pages/AdminPages/Category/CategoryAdmin';
import AddCategory from '../pages/AdminPages/Category/AddCategory';
import UpdateCategory from '../pages/AdminPages/Category/UpdateCategory';
import HomePage from '../pages/UserPages/HomePage/HomePage';
import ProductPage from '../pages/UserPages/ProductPage/ProductPage';
import UpdateProduct from '../pages/AdminPages/Product/UpdateProduct';
import LoginPage from '../pages/UserPages/LoginPage/LoginPage';
import SignUpPage from '../pages/UserPages/SignUpPage/SignUpPage';
import CartPage from '../pages/UserPages/CartPage/CartPage';
import NotFoundPage from '../pages/UserPages/NotFoundPage/NotFoundPage';
import ShipmentPage from '../pages/AdminPages/Shipment/ShipmentPage';
import AddShipment from '../pages/AdminPages/Shipment/AddShipment';
import ProductDetail from '../pages/UserPages/ProductDetailPage/ProductDetailPage';
import CheckOutPage from '../pages/UserPages/CheckOutPage/CheckOutPage';
import OrderCompletePage from '../pages/UserPages/OrderCompletePage/OrderCompletePage';
import OrderPage from '../pages/UserPages/OderPage/OrderPage';
import OrderDetail from '../pages/UserPages/OderPage/OrderDetail';
import OrdersAdmin from '../pages/AdminPages/Orders/OrdersAdmin';
import VNPayIpn from '../pages/UserPages/VNPay/VNPayIpn';
import ContactPage from '../pages/UserPages/ContactPage/ContactPage';
import IntroducePage from '../pages/UserPages/IntroducePage/IntroducePage';
import VoucherAdmin from '../pages/AdminPages/Voucher/VoucherAdmin';
import AddVoucher from '../pages/AdminPages/Voucher/AddVoucher';
import UpdateVoucher from '../pages/AdminPages/Voucher/UpdateVoucher';

import ChatAdmin from '../pages/AdminPages/Chat/ChatAdmin';

import Evaluation from '../pages/AdminPages/Evaluation/Evaluation';
import OriginAdmin from '../pages/AdminPages/Origins/OriginAdmin';
import AddOrigin from '../pages/AdminPages/Origins/AddOrigin';
import UpdateOrigin from '../pages/AdminPages/Origins/UpdateOrigin';
import UserInfoPage from '../pages/UserPages/UserInfoPage/UserInforPage';
import UnSoldProduct from '../pages/AdminPages/UnSoldProduct/UnSoldProduct';
import ForgetPassword from '../pages/UserPages/ForgetPassword/ForgetPassword';
import WishListPage from '../pages/UserPages/WishListPage/WishListPage';
import ChangePassword from '../pages/UserPages/ChangePassword/ChangePassword';
import Account from '../pages/AdminPages/Account/Account';

const router = createBrowserRouter(
   [
      {
         path: '/',
         element: <DefaultLayout />,
         children: [
            {
               path: '/',
               element: <HomePage />,
               errorElement: <NotFoundPage />
            },
            {
               path: '/collections',
               element: <ProductPage />,
               errorElement: <NotFoundPage />
            },
            {
               path: '/login',
               element: <LoginPage />,
               errorElement: <NotFoundPage />
            },
            {
               path: '/signup',
               element: <SignUpPage />,
               errorElement: <NotFoundPage />
            },
            {
               path: '/cart',
               element: <CartPage />,
               errorElement: <NotFoundPage />
            },
            {
               path: '/orders',
               element: <OrderPage />
            },
            {
               path: '/products/:id',
               element: <ProductDetail />,
               errorElement: <NotFoundPage />
            },
            {
               path: '/checkout',
               element: <CheckOutPage />
            },
            {
               path: '/orderComplete',
               element: <OrderCompletePage />
            },
            {
               path: 'my-order/:id',
               element: <OrderDetail />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'vnpay_return',
               element: <VNPayIpn />
            },
            {
               path: 'contact',
               element: <ContactPage />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'introduct',
               element: <IntroducePage />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'userInformation',
               element: <UserInfoPage />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'forgetPassword',
               element: <ForgetPassword />
            },
            {
               path: 'wishList',
               element: <WishListPage />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'changePassword',
               element: <ChangePassword />,
               errorElement: <NotFoundPage />
            }
         ]
      },
      {
         path: '*',
         element: <NotFoundPage />,
         errorElement: <NotFoundPage />
      },
      {
         path: '/manage',
         element: <AdminLayout />,
         errorElement: <NotFoundPage />,
         children: [
            {
               path: '',
               element: <Dashboard />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'dashboard',
               element: <Dashboard />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'products',
               element: <ProductAdmin />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'add-product',
               element: <AddProduct />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'categories',
               element: <CategoryAdmin />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'add-category',
               element: <AddCategory />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'update-category/:id',
               element: <UpdateCategory />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'products/:id',
               element: <UpdateProduct />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'shipments',
               element: <ShipmentPage />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'add-shipment',
               element: <AddShipment />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'orders',
               element: <OrdersAdmin />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'vouchers',
               element: <VoucherAdmin />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'add-voucher',
               element: <AddVoucher />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'update-voucher/:id',
               element: <UpdateVoucher />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'chat',
               element: <ChatAdmin />
            },
            {
               path: 'evaluation',
               element: <Evaluation />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'origin',
               element: <OriginAdmin />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'add-origin',
               element: <AddOrigin />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'update-origin/:id',
               element: <UpdateOrigin />,

               errorElement: <NotFoundPage />
            },
            {
               path: 'unsoldproduct',
               element: <UnSoldProduct />,
               errorElement: <NotFoundPage />
            },
            {
               path: 'account',
               element: <Account />,
               errorElement: <NotFoundPage />
            },
         ]
      }
   ],
   {
      basename: '/'
   }
);

export default router;
