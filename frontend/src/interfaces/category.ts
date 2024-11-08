import { SetStateAction } from 'react';
import { IProduct } from './product';

export interface ICategories {
   type: SetStateAction<string>;
   _id: string;
   cateName: string;
   image: {
      url: string;
      public_id: string;
   };
   products: Partial<IProduct>[];
}
export interface InputCategories {
   cateName: string;
   image: {
      url: string;
      public_id: string;
   };
}
