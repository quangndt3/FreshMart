/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from 'axios';
import instance from './instance';
import { IOrigin } from '../interfaces/origin';
import { IResponse } from '../interfaces/base';

export const getOriginData = (): Promise<AxiosResponse<IResponse<IOrigin[]>, any>> => {
   return instance.get('/origin');
};
