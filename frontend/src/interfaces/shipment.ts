import { Dayjs } from 'dayjs';
import { IProduct } from './product';

export interface IShipmentOfProduct {
   idShipment: string ;
   weight: number;
   date: string;
   originPrice: string;
   isDisable: boolean;
   price: number;
   willExpire: 0 | 1 | 2;
}

export type ProductInShipmentExpand = {
   idProduct: IProduct;
   date: string;
   weight: number;
   productName: string;
   originPrice: number;
   originWeight: number;
};
export interface IShipmentFull {
   _id: string;
   weight: number;
   createdAt: string;
   products: ProductInShipmentExpand[];
   isDisable: boolean;
   totalMoney: number;
}

export type ProductInput = {
   idProduct: string;
   date: string | Dayjs;
   weight: number | string;
   productName: string;
   originPrice: number | string;
};

export type InputShipment = {
   products: ProductInput[];
   totalMoney: number;
   isDisable?: boolean;
};
