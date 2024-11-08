import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
export type ICartSlice = {
   customerName: string;
   email: string;
   items: ICartItems[];
   wishListName: string;
};
export interface ICartItems {
   _id: string;
   name: string;
   image: string;
   price: number;
}
const initialState: ICartSlice = {
   customerName: '',
   email: '',
   items: [],
   wishListName: 'wishList'
};
const wishListSlice = createSlice({
   name: 'wishList',
   initialState,
   reducers: {
      setWishListName: (state, action) => {
         state.wishListName = action.payload || 'wishList';
      },
      setWishList: (state) => {
         if (!localStorage.getItem(state.wishListName)) {
            localStorage.setItem(state.wishListName, '[]');
         }
         const products = localStorage.getItem(state.wishListName)
            ? JSON.parse(localStorage.getItem(state.wishListName)!)
            : [];
         state.items = products;
      },
      addToWishList: (state, action) => {
         const value = action.payload;
         let isAdded = false;
         const products = state.items.map((item: any) => {
            if (item?._id === value._id) {
               isAdded = true;
            }
            return item;
         });
         // Cập nhật biến isAdded
         for (const product of products) {
            if (product?._id === value._id) {
               isAdded = true;
               break;
            }
         }

         if (isAdded) {
            // Sản phẩm đã có trong whishList, xóa sản phẩm khỏi whishList
            const newProducts = products.filter((product: any) => product?._id !== value._id);
            localStorage.setItem(state.wishListName, JSON.stringify(newProducts));
            state.items = newProducts;
            message.success('xóa sản phẩm yêu thích thành công');
         } else {
            // Sản phẩm chưa có trong whishList, thêm sản phẩm vào whishList
            localStorage.setItem(state.wishListName, JSON.stringify([...state.items, value]));
            state.items = [...state.items, value];
            message.success('thêm sản phẩm vào sản phẩm yêu thích thành công');
         }
      },
      removeFromWishList: (state, action) => {
         const products = JSON.parse(localStorage.getItem(state.wishListName)!);
         const newProducts = products.filter((product: any) => product._id !== action.payload.id);
         state.items = newProducts;
         localStorage.setItem(state.wishListName, JSON.stringify(state.items));
         message.success('Xóa sản phẩm yêu thích thành công');
      }
   }
});
export const { addToWishList, setWishList, setWishListName, removeFromWishList } = wishListSlice.actions;
export default wishListSlice;
