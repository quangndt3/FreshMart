import { Badge, DescriptionsProps, Tag } from 'antd';
import { IShipmentOfProduct } from '../interfaces/shipment';
import { formatStringToDate } from '../helper';

export const getShipmentData = (data: IShipmentOfProduct, index: number): DescriptionsProps['items'] => {
   const checkExpire = () => {
      if (data.willExpire === 2) return <Tag color='red'>Sản phẩm hết hạn</Tag>;
      if (data.willExpire === 1) return <Tag color='orange'>Sản phẩm sắp hết hạn</Tag>;
      if (data.willExpire === 0) return <Tag color='green'>Sản phẩm tốt</Tag>;
      return <></>;
   };
   return [
      {
         key: '1',
         label: 'Giá nhập',
         children: data.originPrice + ' VND',
         span: 5
      },
      {
         key: '2',
         label: 'Số lượng',
         children: data.weight + 'kg',
         span: 5
      },
      {
         key: '3',
         label: 'Hạn sử dụng',
         children: formatStringToDate(data.date),
         span: 5
      },
      {
         key: '4',
         label: 'Trạng thái sản phẩm',
         children: checkExpire(),
         span: 5
      },

      {
         key: '4',
         label: 'Trạng thái',
         children: <Badge status={index != 0 ? 'error' : 'success'} text={index != 0 ? 'Trong kho ' : 'Sử dụng'} />,
         span: 5
      }
   ];
};
