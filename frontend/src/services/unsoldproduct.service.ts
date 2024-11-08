import { IQueryParam } from './../interfaces/base';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../interfaces/base';
import { IunsoldProduct } from '../interfaces/unsoldproduct';
import { baseUrl } from '../constants/baseUrl';

const unsoldproduct = createApi({
   reducerPath: 'unsoldproduct',
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      credentials: 'include'
   }),
   tagTypes: ['unsoldproduct'],
   endpoints: (builder) => ({
      getAllunsoldproduct: builder.query<IResponse<IunsoldProduct[]>, Partial<IQueryParam>>({
         query: (params) => ({
            url: '/unsoldProducts',
            method: 'GET',
            credentials: 'include',
            params: params
         }),
         providesTags: ['unsoldproduct']
      }),
      getOneunsoldproductById: builder.query<IResponse<IunsoldProduct>, string>({
         query: (id) => ({
            url: '/unsoldProducts/' + id,
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['unsoldproduct']
      })
   })
});

export const { useGetAllunsoldproductQuery, useGetOneunsoldproductByIdQuery } = unsoldproduct;
export default unsoldproduct;
