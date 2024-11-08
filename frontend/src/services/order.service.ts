import { IResponse } from './../interfaces/base';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';

import { IOrder, IOrderFull } from '../interfaces/order';
import { IQueryParam, IResponseHasPaginate } from '../interfaces/base';
import { paramTransformer } from '../utils/transformParams';
import { baseUrl } from '../constants/baseUrl';
const orderApi = createApi({
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      credentials: 'include',
      prepareHeaders: (headers) => {
         headers.set('Access-Control-Allow-Origin', '*');
         headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH,PUT, DELETE');
         headers.set('Access-Control-Allow-Headers', 'Content-Type');
         return headers;
      }
   }),
   tagTypes: ['orders', 'orders-member', 'detail-order'],
   reducerPath: 'orders',
   endpoints: (builder) => ({
      getAllOrder: builder.query<IResponseHasPaginate<IOrderFull>, Partial<Omit<IQueryParam, ' '>>>({
         query: (params) => {
            return {
               url: '/orders',
               params: paramTransformer(params)
            };
         },
         providesTags: ['orders']
      }),
      addOrder: builder.mutation<IResponse<IOrder & { _id: string; url: string }>, object>({
         query: (body) => {
            return {
               url: '/orders',
               method: 'post',
               body: body
            };
         }
      }),
      updateOrder: builder.mutation<IOrder, IOrder & { idOrder: string }>({
         query: ({ idOrder, ...body }) => {
            return {
               url: '/orders/' + idOrder,
               method: 'PATCH',
               body: body
            };
         },
         invalidatesTags: ['orders']
      }),
      filterOrders: builder.query<IResponseHasPaginate<IOrderFull>, { status?: string; day?: string }>({
         query: (params) => {
            return {
               url: `/orders-member-filter`,
               params: params
            };
         },
         providesTags: ['orders']
      }),
      filterAdminOrders: builder.query<IResponseHasPaginate<IOrderFull>, { status?: string; day?: string }>({
         query: (params) => {
            return {
               url: `/orders-admin-filter`,
               params: paramTransformer(params)
            };
         },
         providesTags: ['orders']
      }),
      getOrderForMember: builder.query<IResponse<IOrderFull[]>, Partial<IQueryParam>>({
         query: (params) => {
            return {
               url: '/orders-member',
               method: 'get',
               params: paramTransformer(params)
            };
         },
         providesTags: ['orders-member']
      }),
      confirmOrderMember: builder.mutation<IResponse<IOrderFull>, string>({
         query: (idOrder) => {
            return {
               url: '/orders-cofirm/' + idOrder,
               method: 'put'
            };
         },
         invalidatesTags: ['orders-member', 'detail-order']
      }),
      getOneOrderForMember: builder.query<IResponse<IOrderFull> & {body:{data:IOrderFull,voucher:any}}, string>({
         query: (idOrder) => {
            return {
               url: 'orders/' + idOrder,
               method: 'get'
            };
         },
         providesTags: ['detail-order']
      }),
      cancelOrderMember: builder.mutation<IResponse<IOrderFull>, string>({
         query: (idOrder) => {
            return {
               url: 'orders/' + idOrder,
               method: 'put'
            };
         },
         invalidatesTags: ['orders-member']
      })
   })
});

export const {
   useAddOrderMutation,
   useUpdateOrderMutation,
   useGetAllOrderQuery,
   useFilterOrdersQuery,
   useFilterAdminOrdersQuery,
   useCancelOrderMemberMutation,
   useConfirmOrderMemberMutation,
   useGetOneOrderForMemberQuery,
   useGetOrderForMemberQuery,
} = orderApi;

export default orderApi;
