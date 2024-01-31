import { IShipmentOfProduct } from './shipment';

export interface IProduct {
   _id: string;
   productName: string;
   categoryId:
      | string
      | {
           cateName: string;
           _id: string;
        };
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   evaluated: any[];
   desc: string;
   discount: number;
   images: { url: string; public_id: string }[];
   createdAt: string;
   shipments: IShipmentOfProduct[];
   price: number;
   originId:
      | string
      | {
           name: string;
           _id: string;
        };
   isSale: any;
}

export type InputProduct = Omit<IProduct, '_id' | 'createAt' | 'commentId' | 'shipments'>;

export interface IProductExpanded extends IProduct {
   categoryId: {
      cateName: string;
      _id: string;
   };
   originId: {
      _id: string;
      name: string;
   };
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   evaluatedId: any[];
}

export interface IDescProp {
   desc: string | undefined;
   originName: string;
   productId: string;
}
export interface IProductInfoProp {
   product_info: IProductExpanded | undefined;
}
export interface IObjIdForGetRelatedProducts {
   idCategory: string | undefined;
   idProduct: string | undefined;
}

export interface InputSaleProduct {
   productId: string;
   shipmentId: string;
   productName: string;
   discount: number;
}
