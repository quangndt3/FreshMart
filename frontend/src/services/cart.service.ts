/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/baseUrl';
const cartDB = createApi({
   reducerPath: 'cartDB',
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      credentials: 'include'
   }),
   tagTypes: ['cart'],
   endpoints: (builder) => ({
      getCart: builder.query<any, void>({
         query: () => ({
            url: '/cart',
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['cart']
      }),
      addCart: builder.mutation({
         query: (item) => ({
            url: '/cart',
            method: 'POST',
            body: item
         }),
         invalidatesTags: ['cart']
      }),
      updateCart: builder.mutation({
         query: (item) => ({
            url: '/cart',
            method: 'PATCH',
            body: item
         }),
         invalidatesTags: ['cart']
      }),
      deleteProductInCart: builder.mutation({
         query: (param) => ({
            url: '/cart/' + param,
            method: 'DELETE'
         }),
         invalidatesTags: ['cart']
      }),
      deleteAllProductInCart: builder.mutation({
         query: () => ({
            url: '/cart',
            method: 'DELETE'
         }),
         invalidatesTags: ['cart']
      }),
      checkCart: builder.mutation({
         query: (item) => ({
            url: '/cart-local/',
            method: 'POST',
            body: item
         })
      })
   })
});

export const {
   useGetCartQuery,
   useCheckCartMutation,
   useAddCartMutation,
   useUpdateCartMutation,
   useDeleteProductInCartMutation,
   useDeleteAllProductInCartMutation
} = cartDB;
export default cartDB;
