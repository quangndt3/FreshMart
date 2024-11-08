import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react';
import { IQueryParam, IResponse, IResponseHasPaginate } from '../interfaces/base';
import {
   IObjIdForGetRelatedProducts,
   IProduct,
   IProductExpanded,
   InputProduct,
   InputSaleProduct
} from '../interfaces/product';
import { paramTransformer } from '../utils/transformParams';
import { baseUrl } from '../constants/baseUrl';

const productApi = createApi({
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

   reducerPath: 'products',
   tagTypes: ['product'],
   endpoints: (builder) => ({
      getAllWithoutExpand: builder.query<IResponseHasPaginate<IProduct>, Partial<Omit<IQueryParam, '  '>>>({
         query: (params) => {
            return {
               url: '/products',
               params: paramTransformer(params)
            };
         },
         providesTags: ['product']
      }),
      getAllExpand: builder.query<
         IResponseHasPaginate<IProductExpanded>,
         Partial<IQueryParam> & Pick<IQueryParam, 'expand'>
      >({
         query: (params) => {
            return {
               url: '/products',
               params: paramTransformer(params)
            };
         },
         providesTags: ['product']
      }),
      getProductSoldDesc: builder.query<IResponse<IProductExpanded[]>, void>({
         query: () => {
            return {
               url: '/products-sold'
            };
         }
      }),
      getAllLiquidationProduct: builder.query<IResponse<IProductExpanded[]>, void>({
         query: () => {
            return {
               url: '/products/?_isSale=true'
            };
         }
      }),
      getProductSoldDescLimit: builder.query<IResponse<IProductExpanded[]>, void>({
         query: () => {
            return {
               url: '/products/?_sort=sold&_order=desc?_limit=9'
            };
         }
      }),
      getNewProductInStorage: builder.query<IResponse<IProductExpanded[]>, void>({
         query: () => {
            return {
               url: '/products/?_sort=createdAt&_order=desc?_limit=9'
            };
         }
      }),
      getOneProduct: builder.query<IResponse<IProductExpanded>, string>({
         query: (idProduct) => {
            return {
               url: '/products/' + idProduct
            };
         },
         providesTags: ['product']
      }),
      getRelatedProducts: builder.query<IResponse<IProductExpanded[]>, object>({
         query: ({ idCategory, idProduct }: IObjIdForGetRelatedProducts) => {
            return {
               url: '/products/related/' + idCategory + '/' + idProduct
            };
         }
      }),
      addProduct: builder.mutation<IProduct, InputProduct>({
         query: (body) => {
            return {
               url: '/products',
               method: 'post',
               body: body
            };
         },
         invalidatesTags: ['product']
      }),
      updateProduct: builder.mutation<IProduct, InputProduct & { idProduct: string }>({
         query: ({ idProduct, ...body }) => {
            return {
               url: '/products/' + idProduct,
               method: 'PATCH',
               body: body
            };
         },
         invalidatesTags: (result) => [{ type: 'product', id: result?._id }]
      }),
      removeProduct: builder.mutation<IProduct, string>({
         query: (id) => {
            return {
               url: '/products/' + id,
               method: 'delete'
            };
         },
         invalidatesTags: ['product']
      }),
      createSaleProduct: builder.mutation<IResponse<IProductExpanded>, InputSaleProduct>({
         query: (body) => {
            return {
               url: '/products-process',
               method: 'post',
               body
            };
         },
         invalidatesTags: ['product']
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      searchProduct: builder.mutation<any, string>({
         query: (search) => ({
            url: '/products?_q=' + search,
            method: 'GET'
         }),
         invalidatesTags: ['product']
      })
   })
});

export const {
   useGetAllLiquidationProductQuery,
   useGetNewProductInStorageQuery,
   useGetProductSoldDescLimitQuery,
   useGetProductSoldDescQuery,
   useUpdateProductMutation,
   useGetAllWithoutExpandQuery,
   useGetAllExpandQuery,
   useGetRelatedProductsQuery,
   useAddProductMutation,
   useGetOneProductQuery,
   useRemoveProductMutation,
   useCreateSaleProductMutation,
   useSearchProductMutation
} = productApi;

export default productApi;
