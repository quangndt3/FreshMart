import { IUser } from './../interfaces/auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IQueryParam, IResponse, IResponseHasPaginate } from '../interfaces/base';
import { paramTransformer } from '../utils/transformParams';
import { IUserInFo } from '../pages/UserPages/UserInfoPage/UserInforPage';
import { baseUrl } from '../constants/baseUrl';

const userApi = createApi({
   reducerPath: 'userApi',
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      credentials: 'include'
   }),
   tagTypes: ['user'],
   endpoints: (builder) => ({
      createAccount: builder.mutation<IResponse<IUser>, IUser>({
         query: (info) => {
            return {
               url: '/users',
               method: 'POST',
               body: info,
               credentials: 'include'
            };
         },
         invalidatesTags: ['user']
      }),
      getAll: builder.query<IResponseHasPaginate<IUser>&{body:{data:{docs:IUser[]}}}, Partial<IQueryParam>>({
         query: (params) => {
            return {
               url: '/users',
               method: 'GET',
               params: paramTransformer(params),
               credentials: 'include'
            };
         },
         providesTags: ['user']
      }),
      getOne: builder.query<IResponse<IUser>, string>({
         query: (id) => ({
            url: '/users/' + id,
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['user']
      }),
      updateUser: builder.mutation<IResponse<IUser>, { id: string; data: IUserInFo }>({
         query: ({ id, data }) => ({
            url: '/users/' + id,
            method: 'PATCH',
            body: data,
            credentials: 'include'
         }),
         invalidatesTags: ['user']
      }),
      removeUser: builder.mutation<IResponse<IUser>, string>({
         query: (id) => ({
            url: '/users/' + id,
            method: 'Delete',
            credentials: 'include'
         }),
         invalidatesTags: ['user']
      }),
      SendCodeToChangePassword: builder.mutation<IResponse<IUser>, object>({
         query: (item) => ({
            url: '/generateVerificationToken',
            method: 'POST',
            body: item,
            credentials: 'include'
         }),
      }),
      verifyTokenChangePassword: builder.mutation<IResponse<IUser>, object>({
         query: (item) => ({
            url: '/verifyToken',
            method: 'POST',
            body: item,
            credentials: 'include'
         }),
      }),
      ChangePassword: builder.mutation<IResponse<IUser>, object>({
         query: (item) => ({
            url: '/forgotPassword' ,
            method: 'PUT',
            body: item,
            credentials: 'include'
         }),
      }),
      ChangePasswordPage: builder.mutation<IResponse<IUser>, object>({
         query: (item) => ({
            url: '/changePassword' ,
            method: 'PATCH',
            body: item,
            credentials: 'include'
         }),
      }),
   })
});

export const {
   useCreateAccountMutation,
   useGetAllQuery,
   useGetOneQuery,
   useUpdateUserMutation,
   useChangePasswordPageMutation,
   useRemoveUserMutation,
   useSendCodeToChangePasswordMutation,
   useChangePasswordMutation,
   useVerifyTokenChangePasswordMutation,
} = userApi;
export default userApi;
