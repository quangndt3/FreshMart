/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useGetOneProductQuery } from '../../../services/product.service';
import { Descriptions, DescriptionsProps, Form, Input } from 'antd';
import Loading from '../../../components/Loading/Loading';
import { InputSaleProduct } from '../../../interfaces/product';

type Props = {
   productId: string;
   onSubmitForm: (value: InputSaleProduct) => Promise<void>;
};

const FormCreateSaleProduct = ({ productId, onSubmitForm }: Props) => {
   const { data, isLoading } = useGetOneProductQuery(productId);
   const [discount, setDiscount] = useState<number>(0);
   const items: DescriptionsProps['items'] = [
      {
         key: '1',
         label: 'Giá bán sản phẩm',
         children: (
            <span>{data && Number(data.body.data.price) - (Number(data.body.data.price) * discount) / 100} VND</span>
         )
      },

      {
         key: '4',
         label: 'Danh mục sản phẩm',
         children: <span>{data && data.body.data.categoryId.cateName}</span>
      },
      {
         key: '5',
         label: 'Nguồn gốc',
         children: <span>{data && data.body.data.originId.name}</span>
      },
      {
         key: '2',
         label: 'Ảnh sản phẩm',
         children: (
            <div className='flex justify-start items-center gap-2'>
               {data &&
                  data.body.data.images.map((img, index) => (
                     <img className='w-[20%] rounded-md aspect-square' src={img.url} key={index} alt='image-product' />
                  ))}
            </div>
         )
      },
      {
         key: '3',
         label: 'Mô tả sản phẩm',
         children: <span dangerouslySetInnerHTML={{ __html: data ? data.body.data.desc : '' }}></span>
      }
   ];
   const handleSubmitForm = async (value: any) => {
      console.log('submit');
      onSubmitForm({ ...value, productId: data?.body.data._id, shipmentId: data?.body.data.shipments[0].idShipment });
   };
   if (isLoading) return <Loading sreenSize='md' />;
   return (
      <Form layout='vertical' className='max-h-[600px] overflow-auto px-3' onFinish={handleSubmitForm}>
         <Form.Item
            name='productName'
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
            label='Tên sản phẩm'
         >
            <Input placeholder='Thêm tên sản phẩm' className='w-full p-2' />
         </Form.Item>
         <Form.Item
            name='discount'
            rules={[{ required: true, message: 'Vui lòng nhập chiết khấu sản phẩm' }]}
            label='Chiết khấu'
         >
            <Input
               placeholder='Thêm chiết khấu sản phẩm'
               className='w-full p-2'
               prefix='%'
               type='number'
               onChange={(e) => setDiscount(Number(e.target.value))}
               value={discount}
            />
         </Form.Item>
         <Descriptions title='Thông tin từ sản phẩm gốc :' items={items} layout='vertical' />
         <Form.Item>
            <button
               type='submit'
               className='bg-greenPrimary text-white border-none hover:!text-white py-2 px-3 rounded-md'
            >
               Tạo sản phẩm
            </button>
         </Form.Item>
      </Form>
   );
};

export default FormCreateSaleProduct;
