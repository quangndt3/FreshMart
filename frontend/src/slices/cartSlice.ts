/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from '@reduxjs/toolkit';
import { message } from 'antd';
import { IImage } from '../interfaces/image';
export type ICartSlice = {
   customerName: string;
   email: string;
   shippingAddress: string;
   phoneNumber: string;
   products: ICartItems[];
   totalPrice: number;
   cartName: string;
};
export interface ICartItems {
   productId:{
      discount: number;
      _id: string;
      productName: string;
      images: IImage[];
      price: number;
      originId:{
         _id:string,
         name: string
      }
   }
   weight: number;
   totalWeight: number;
}
const initialState: ICartSlice = {
   customerName: '',
   email: '',
   shippingAddress: '',
   phoneNumber: '',
   products: [],
   totalPrice: 0,
   cartName: 'cart',
};
const cartSlice = createSlice({
   name: 'cart',
   initialState,
   reducers: {
      setItem: (state) => {
         if (!localStorage.getItem("cart")) {
            localStorage.setItem("cart", '[]');
         }
         const products =  JSON.parse(localStorage.getItem("cart")!);
         state.products = products;
         state.totalPrice = products.reduce(
            (accumulator: any, product: any) => accumulator + product.productId?.price * product.weight,
            0
         );
      },
      updatePrice: (state, action) => {
         const value = action.payload;

         state.products.find((item: any) => {
            if (item?._id === value._id) {
               item.price = value.price;
            }
         });
         localStorage.setItem("cart", JSON.stringify(state.products));
         state.totalPrice = state.products.reduce(
            (accumulator: any, product: any) => accumulator + product?.price * product.weight,
            0
         );
      },
      addItem: (state, action) => {
         const value = action.payload;
         let isItemExist = false;
         let error = false;
         if (value.weight > value.totalWeight) {
            message.error('Số lượng đã quá số lượng hiện có');
            error = true;
            return
         }
         const products = state.products.map((item: any) => {
            if (item?.productId._id === value.productId._id) {
               isItemExist = true;
               if (item.weight + value.weight <= value.totalWeight) {
                  item.weight += value.weight;
               } else {
                  message.error('Số lượng sản phẩm trong giỏ hàng của bạn vượt quá số lượng hiện có trong');
                  error = true;
               }
            }
            return item;
         });
         if (isItemExist && !error) {
            state.totalPrice = products.reduce(
               (accumulator: any, product: any) => accumulator + product?.productId?.price * product.weight,
               0
            );
               
            localStorage.setItem("cart", JSON.stringify([...products]));
            state.products = products;
            message.success('Thêm sản phẩm vào giỏ hàng thành công');
         } else if (!isItemExist && !error) {
            state.totalPrice = [...state.products, value].reduce(
               (accumulator: any, product: any) => accumulator + product.productId?.price * product.weight,
               0
            );
           
            
            localStorage.setItem("cart", JSON.stringify([...state.products, value]));
            state.products = [...state.products, value];
            message.success('Thêm sản phẩm vào giỏ hàng thành công');
         }
      },
      removeFromCart: (state, action) => {
         const nextCartproducts = state.products.filter((cartItem: any) => cartItem.productId._id !== action.payload.id);
         state.totalPrice = nextCartproducts.reduce(
            (accumulator, product) => accumulator + product.productId?.price * product.weight,
            0
         );
         state.products = nextCartproducts;
        
         localStorage.setItem("cart", JSON.stringify(state.products));

      },
      removeAllProductFromCart: (state) => {
         state.products = [];
         state.totalPrice = 0;
         localStorage.setItem("cart", JSON.stringify(state.products));
      },
      updateItem: (state, action) => {
         
         const nextCartproducts = state.products.map((cartItem: any) => {
            if (cartItem.productId._id === action.payload.id) {
               if (action.payload.weight >= 0) {
                  return {
                     ...cartItem,
                     weight: action.payload.weight
                  };
               }
            }
            return cartItem;
         });
         localStorage.setItem("cart", JSON.stringify(nextCartproducts));
         state.totalPrice = nextCartproducts.reduce(
            (accumulator, product) => accumulator + product.productId?.price * product.weight,
            0
         );
         state.products = nextCartproducts;
         message.success('Cập nhật sản phẩm thành công');
      },
      updateNameProductInCartLocal:(state,action)=>{
         console.log(action.payload.name);
         
         const nextCartproducts = state.products.map((cartItem: any) => {
            if (cartItem.productId._id === action.payload.id) {
                  return {
                     ...cartItem,
                     productId: {
                        ...cartItem.productId,
                        productName: action.payload.name
                      }
                  };
            }
            return cartItem;
         });
         console.log(nextCartproducts);
         
         state.products = nextCartproducts;
         localStorage.setItem("cart", JSON.stringify(nextCartproducts));
      },
      updatePriceProductInCartLocal:(state,action)=>{
         console.log("action.payload.name");
         
         const nextCartproducts = state.products.map((cartItem: any) => {
            if (cartItem.productId._id === action.payload.id) {
                  return {
                     ...cartItem,
                     productId: {
                        ...cartItem.productId,
                        price: action.payload.price
                      }
                  };
            }
            return cartItem;
         });
         state.products = nextCartproducts;
         localStorage.setItem("cart", JSON.stringify(nextCartproducts));
         state.totalPrice = nextCartproducts.reduce(
            (accumulator, product) => accumulator + product.productId?.price * product.weight,
            0
         );
      },
      updateImgProductInCartLocal:(state,action)=>{
         const nextCartproducts = state.products.map((cartItem: any) => {
            if (cartItem.productId._id === action.payload.id) {
                  return {
                     ...cartItem,
                     productId: {
                        ...cartItem.productId,
                        images: [{url:action.payload.img}]
                      }
                  };
            }
            return cartItem;
         });
         state.products = nextCartproducts;
         localStorage.setItem("cart", JSON.stringify(nextCartproducts));
      },
      updateTotalPrice: (state, action) => {
        
         state.totalPrice= action.payload.totalPrice
      },
      updateOriginProductInCartLocal:(state,action)=>{
         const nextCartproducts = state.products.map((cartItem: any) => {
            if (cartItem.productId._id === action.payload.id) {
                  return {
                     ...cartItem,
                     productId: {
                        ...cartItem.productId,
                        originId: {_id:action.payload.origin_id,name:action.payload.name}
                      }
                  };
            }
            return cartItem;
         });
         state.products = nextCartproducts;
         localStorage.setItem("cart", JSON.stringify(nextCartproducts));
      },
   }
});
export const { addItem,updateTotalPrice,updateOriginProductInCartLocal,updateImgProductInCartLocal,updatePriceProductInCartLocal,updateNameProductInCartLocal, updatePrice, removeFromCart, updateItem, removeAllProductFromCart, setItem } =
   cartSlice.actions;
export default cartSlice;
