import { AxiosResponse } from 'axios';
import instance from './instance';
import { IResponse } from '../interfaces/base';
import { IOrderFull } from '../interfaces/order';

export const getDetailOrder = (id: string): Promise<AxiosResponse<IResponse<IOrderFull>>> => {
   return instance.get('orders/' + id);
};



export const getOrder = (): Promise<AxiosResponse<IResponse<IOrderFull[]>>> => {
   return instance.get('orders');
};

export const getOrderForMember = (status?: string, day?: string): Promise<AxiosResponse<IResponse<IOrderFull[]>>> => {
   return instance.get('/orders-member', {
      withCredentials: true,
      params: {
         _status: status,
         _day: day
      }
   });
};

export const getOrderForGuest = (invoiceId: string): Promise<AxiosResponse<IResponse<IOrderFull[]>>> => {
   return instance.post('/orders-guest', { invoiceId });
};
