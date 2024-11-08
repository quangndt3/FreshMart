import DescTicket from '../../../../components/DescTicket/DescTicket';
import { formatStringToDate } from '../../../../helper';
import { IShipmentFull } from '../../../../interfaces/shipment';
import { Collapse, CollapseProps, Tag } from 'antd';

type Props = {
   shipment: IShipmentFull;
};

const ShipmentItem = ({ shipment }: Props) => {
   const items: CollapseProps['items'] = shipment?.products.map((product) => ({
      key: product?.idProduct?._id,
      label: (
         <p className='flex justify-start items-center gap-2 '>
            {product?.idProduct.productName}
            {product.weight === 0 && (
               <Tag color='red' className='w-[50%] text-center'>
                  Hết hàng
               </Tag>
            )}
         </p>
      ),
      children: (
         <div className={`flex flex-col gap-3`}>
            <p>
               <strong className='underline mr-3'>Ngày hết hạn: </strong> {formatStringToDate(product.date)}
            </p>
            <p>
               <strong className='underline mr-3'>Giá nhập: </strong>
               {product.originPrice.toLocaleString("vi-VN")}₫/kg
            </p>
            <p>
               <strong className='underline mr-3'>Số lượng còn lại: </strong>
               {product.weight} kg
            </p>
            <p>
               <strong className='underline mr-3'>Khối lượng nhập: </strong>
               {product.originWeight} kg
            </p>
         </div>
      )
   }));
   return (
      <div className='w-full max-h-[300px] overflow-auto '>
         <Collapse items={items} bordered={false} className='mb-14' />
         <div className=' absolute bottom-2 '>
            <DescTicket
               type={shipment.isDisable ? 'error' : 'success'}
               label={shipment.isDisable ? 'Dừng sử dụng' : 'Đang sử dụng'}
            />
         </div>
      </div>
   );
};

export default ShipmentItem;
