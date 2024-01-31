/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../constants/baseUrl';
const voucher = createApi({
   reducerPath: 'voucher',
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      credentials: 'include'
   }),
   tagTypes: ['voucher'],
   endpoints: (builder) => ({
      getAllVoucher: builder.query<any, void>({
         query: () => ({
            url: '/vouchers',
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['voucher']
      }),
      getOneVoucherById: builder.query({
         query: (id) => ({
            url: '/vouchers/' + id,
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['voucher']
      }),
      addVoucher: builder.mutation({
         query: (body) => {
            return {
               url: '/vouchers',
               method: 'post',
               body: body
            };
         },
         invalidatesTags: ['voucher']
      }),
      removeVoucher: builder.mutation<any, string>({
         query: (id) => {
            return {
               url: '/vouchers/' + id,
               method: 'delete'
            };
         },
         invalidatesTags: ['voucher']
      }),
      getOneVoucher: builder.query<any, string>({
         query: (idVoucher) => {
            return {
               url: '/vouchers/' + idVoucher
            };
         },
         providesTags: ['voucher']
      }),
      updateVoucher: builder.mutation<any, any>({
         query: ({ idVoucher, ...body }) => {
            return {
               url: '/vouchers/' + idVoucher,
               method: 'PATCH',
               body: body
            };
         },
         invalidatesTags: ['voucher']
      }),
      checkVoucher: builder.mutation({
         query: (item) => ({
            url: '/vouchers/',
            method: 'PUT',
            body: item
         })
      }),
      getVoucherUseful: builder.mutation({
         query: (item) => ({
            url: '/vouchers-user',
            method: 'POST',
            body: item
         })
      })
   })
});

export const {
   useGetAllVoucherQuery,
   useGetOneVoucherByIdQuery,
   useAddVoucherMutation,
   useRemoveVoucherMutation,
   useGetOneVoucherQuery,
   useUpdateVoucherMutation,
   useCheckVoucherMutation,
   useGetVoucherUsefulMutation
} = voucher;
export default voucher;
