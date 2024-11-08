import instance from './instance';

export const getAllStatistics = () => {
   return instance.get('/statistic');
};
