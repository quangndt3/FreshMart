import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IResponse } from '../interfaces/base';
import { IOrigin } from '../interfaces/origin';
import { baseUrl } from '../constants/baseUrl';

const origin = createApi({
   reducerPath: 'origin',
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      credentials: 'include'
   }),
   tagTypes: ['origin'],
   endpoints: (builder) => ({
      getAllOrigin: builder.query<IResponse<IOrigin[]>, void>({
         query: () => ({
            url: '/origin',
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['origin']
      }),
      getOneOriginById: builder.query<IResponse<IOrigin>,string>({
         query: (id) => ({
            url: '/origin/' + id,
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['origin']
      }),
      removeOriginById: builder.mutation({
         query: (id) => ({
            url: '/origin/' + id,
            method: 'DELETE'
         }),
         invalidatesTags: ['origin'],
      }),
      addOrigin: builder.mutation({
         query: (item) => ({
            url: '/origin/',
            method: 'POST',
            body: item,
         }),
         invalidatesTags: ['origin'],
      }),
      updateOrigin: builder.mutation<IResponse<IOrigin>,{id:string}>({
         query: ({ id, ...body }) => ({
            url: '/origin/' + id,
            method: 'PATCH',
            body: body,
         }),
         invalidatesTags: ['origin'],
      })
   })
});

export const { useGetAllOriginQuery, useGetOneOriginByIdQuery, useRemoveOriginByIdMutation, useAddOriginMutation, useUpdateOriginMutation } = origin;
export default origin;
