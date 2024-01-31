import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { IQueryParam, IResponse, IResponseHasPaginate } from '../interfaces/base';
import { IShipmentFull, InputShipment } from '../interfaces/shipment';
import { paramTransformer } from '../utils/transformParams';
import { baseUrl } from '../constants/baseUrl';

const shipmentApi = createApi({
   baseQuery: fetchBaseQuery({
      baseUrl: baseUrl + '/api',
      prepareHeaders: (headers) => {
         headers.set('Access-Control-Allow-Origin', '*');
         headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH,PUT, DELETE');
         headers.set('Access-Control-Allow-Headers', 'Content-Type');
         return headers;
      },
      credentials: 'include'
   }),
   tagTypes: ['shipment'],
   endpoints: (builder) => ({
      getAllShipmentExpand: builder.query<IResponseHasPaginate<IShipmentFull>, Partial<Omit<IQueryParam, 'expand'>>>({
         query: (params) => {
            return {
               url: '/shipments',
               params: paramTransformer(params)
            };
         },
         providesTags: ['shipment']
      }),
      getOneShipment: builder.query<IResponse<IShipmentFull>, string>({
         query: (idShipment) => {
            return {
               url: '/shipments/' + idShipment
            };
         }
      }),
      addShipment: builder.mutation<IResponse<IShipmentFull>, InputShipment>({
         query: (body) => {
            return {
               url: '/shipments',
               method: 'post',
               body: body
            };
         },
         invalidatesTags: ['shipment']
      }),
      updateShipment: builder.mutation<IResponse<IShipmentFull>, { isDisable: boolean; idShipment: string }>({
         query: ({ idShipment, ...body }) => {
            return {
               url: '/shipments/' + idShipment,
               method: 'PATCH',
               body: body
            };
         },
         invalidatesTags: ['shipment']
      })
   })
});

export const {
   useGetOneShipmentQuery,
   useGetAllShipmentExpandQuery,
   useAddShipmentMutation,
   useUpdateShipmentMutation
} = shipmentApi;
export default shipmentApi;
