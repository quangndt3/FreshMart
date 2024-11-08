import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AuthSignupInput, DataAuthResponse } from '../interfaces/auth';
import { AuthLoginInput } from '../interfaces/auth';
import { baseUrl } from '../constants/baseUrl';

const authApi = createApi({
   reducerPath: 'authApi',
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      credentials: 'include',
   }),
   tagTypes: ['auth'],
   endpoints: (builder) => ({
      login: builder.mutation<DataAuthResponse, AuthLoginInput>({
         query: (info) => {
            return {
               url: '/login',
               method: 'POST',
               body: info
            };
         },
         invalidatesTags: ['auth']
      }),
      signup: builder.mutation<DataAuthResponse, AuthSignupInput>({
         query: (info) => {
            return {
               url: '/signup',
               method: 'POST',
               body: info
            };
         },
         invalidatesTags: ['auth']
      }),
      getToken: builder.query<DataAuthResponse, void>({
         query: () => ({
            url: '/token',
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['auth']
      }),
      clearToken: builder.mutation<void, void>({
         query: () => ({
            url: '/token',
            method: 'DELETE',
            credentials: 'include'
         }),
         invalidatesTags: ['auth']
      })
   })
});

export const { useLoginMutation, useSignupMutation, useGetTokenQuery, useClearTokenMutation } = authApi;
export default authApi;