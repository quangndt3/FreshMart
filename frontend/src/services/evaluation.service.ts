import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IEvaluationFull, IEvaluation } from '../interfaces/evaluation'
import { IResponse } from '../interfaces/base';
import { baseUrl } from '../constants/baseUrl';

const evaluation = createApi({
   reducerPath: 'evaluation',
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      credentials: 'include'
   }),
   tagTypes: ['evaluation'],
   endpoints: (builder) => ({
      getAllEvaluation: builder.query<IResponse<IEvaluationFull[]>, void>({
         query: () => ({
            url: '/evaluation',
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['evaluation']
      }),
      getOneEvaluationById: builder.query<IResponse<IEvaluationFull>,string>({
         query: (id) => ({
            url: '/evaluation/' + id,
            method: 'GET',
            credentials: 'include'
         }),
         providesTags: ['evaluation']
      }),
      getEvaluationBestRateLimit: builder.query<IResponse<IEvaluationFull[]>,void>({
         query: () => ({
            url: '/evaluation/?_rate=5&_limit=10',
            method: 'GET',
            credentials: 'include'
         }),
      }),
      getEvaluationByProductId: builder.query<IResponse<IEvaluationFull[]>,string>({
        query: (id) => ({
           url: '/evaluationByProductId/' + id,
           method: 'GET',
           credentials: 'include'
        }),
        providesTags: ['evaluation']
     }),
      
      addEvaluation: builder.mutation<void, IEvaluation>({
         query: (item) => ({
            url: '/evaluation/',
            method: 'POST',
            body: item,
         }),
         invalidatesTags: ['evaluation'],
      }),
      updateEvaluation: builder.mutation<IResponse<IEvaluationFull>,{_id:string,isReviewVisible:boolean}>({
         query: (item) => ({
            url: '/evaluation/' + item._id,
            method: 'PATCH',
            body: item
         }),
         invalidatesTags: ['evaluation'],
      })
   })
});

export const { useGetAllEvaluationQuery,useGetEvaluationBestRateLimitQuery, useGetOneEvaluationByIdQuery, useGetEvaluationByProductIdQuery, useAddEvaluationMutation, useUpdateEvaluationMutation } = evaluation;
export default evaluation;
