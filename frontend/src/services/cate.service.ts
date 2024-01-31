import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ICategories, InputCategories } from '../interfaces/category';
import { IQueryParam, IResponse } from '../interfaces/base';
import { paramTransformer } from '../utils/transformParams';
import { baseUrl } from '../constants/baseUrl';
const category = createApi({
   reducerPath: 'category',
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      credentials: 'include'
   }),
   tagTypes: ['category'],
   endpoints: (builder) => ({
      getAllCate: builder.query<IResponse<ICategories[]>, Partial<Omit<IQueryParam, '  '>>>({
         query: (params) => ({
            url: '/categories',
            method: 'GET',
            credentials: 'include',
            params: paramTransformer(params)
         }),
         providesTags: ['category']
      }),
      getOneCateById: builder.query<IResponse<ICategories>, string>({
         query: (id) => ({
            url: '/categories/' + id,
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['category']
      }),
      removeCategoryById: builder.mutation({
         query: (id) => ({
            url: '/categories/' + id,
            method: 'DELETE'
         }),
         invalidatesTags: ['category']
      }),
      addCategory: builder.mutation({
         query: (item) => ({
            url: '/categories/',
            method: 'POST',
            body: item
         }),
         invalidatesTags: ['category']
      }),
      updateCategory: builder.mutation<IResponse<ICategories>, InputCategories & { id: string }>({
         query: ({ id, ...body }) => ({
            url: '/categories/' + id,
            method: 'PATCH',
            body: body
         }),
         invalidatesTags: ['category']
      })
   })
});

export const {
   useGetOneCateByIdQuery,
   useGetAllCateQuery,
   useAddCategoryMutation,
   useUpdateCategoryMutation,
   useRemoveCategoryByIdMutation
} = category;
export default category;
