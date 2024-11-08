import { createSlice } from '@reduxjs/toolkit';
import {  IProductExpanded } from '../interfaces/product';

const initState = {
    products:[],
} as {products:IProductExpanded[]}

const productSlice = createSlice({
   name: 'products',
   initialState: initState,
   reducers: {
      saveProduct: (state, action) => {
         state.products = [action.payload];
      },
   }
});

export const { saveProduct  } = productSlice.actions;

export default productSlice.reducer;