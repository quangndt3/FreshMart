import Header from '../components/layout/Header/Header';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { useEffect } from 'react';
import { setItem } from '../slices/cartSlice';
import { setWishListName, setWishList } from '../slices/wishListSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useClearTokenMutation, useGetTokenQuery } from '../services/auth.service';
import { deleteTokenAndUser, saveTokenAndUser } from '../slices/authSlice';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';

const DefaultLayout = () => {
   const dispatch = useDispatch();
   const { data, isLoading, refetch } = useGetTokenQuery();
   const { pathname } = useLocation();
   const auth = useSelector((state: any) => state.userReducer);
   const [clearToken] = useClearTokenMutation();
   useEffect(() => {
      if (!isLoading &&  data?.body?.data.accessToken != "" ) {
         dispatch(saveTokenAndUser({ accessToken: data?.body.data?.accessToken, user: data?.body.data?.data }));
         dispatch(setWishListName(data?.body.data?.data?.userName || 'wishList'));
      } else if (!isLoading && data?.body?.data.accessToken == "" && Object.keys(auth?.user).length > 0) {
         dispatch(deleteTokenAndUser())
         clearToken();
      }
      dispatch(setItem());
      dispatch(setWishList());
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [data, isLoading]);
   useEffect(() => {
      if (data?.body?.data) {
         refetch()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [data?.body?.data, pathname, refetch])
   return (
      <>
         <ScrollToTop />
         <Header />
         <Outlet />
         <Footer />
      </>
   );
};

export default DefaultLayout;
