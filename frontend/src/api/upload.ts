import { AxiosResponse } from 'axios';
import { IResponse } from '../interfaces/base';
import { IImage } from '../interfaces/image';
import instance from './instance';

export const uploadImages = (files: File[]): Promise<AxiosResponse<IResponse<IImage[]>>> => {
   const formData = new FormData();
   for (const file of files) {
      formData.append('images', file);
   }
   return instance.post('/images', formData, { headers: { 'Content-Type': ' multipart/form-data' } });
};
