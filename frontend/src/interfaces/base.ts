/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @type T : type of documents array in body response
 */
export interface IResponseHasPaginate<T> {
   [x: string]: any;
   body: {
      data: T[];
      totalMoney?: number;
      pagination: {
         currentPage: number;
         totalPages: number;
         totalItems: number;
      };
      maxPrice?: number;
      minPrice?: number;
   };
   message: string;
   status: number;
}

export interface IResponse<T> {
   body: {
      data: T;
      totalMoney?: number;
   };
   message: string;
   status: number;
   errors: string;
}

export interface IQueryParam {
   sort: string;
   order: 'asc' | 'desc';
   limit: number;
   page: number;
   minPrice: number;
   maxPrice: number;
   expand: boolean;
   q: string;
   categoryId: string | null;
   originId: string;
   brand: string;
   subCate: string;
   day: string;
   status: string;
   productId: string;
   shipmentId: string;
   invoiceId: string;
   isSale: boolean;
   today: boolean;
}
