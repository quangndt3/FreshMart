import { IProduct } from '../../../../interfaces/product';
import { Input, Select, Form, Space, DatePicker, Tooltip, Popconfirm, message, Tag } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { ProductInput } from '../../../../interfaces/shipment';
import ConfirmIcon from '../../../../components/Icons/ConfirmIcon';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { RangePickerProps } from 'antd/es/date-picker';
type Props = {
   products: IProduct[];
   submitProduct: (data: ProductInput) => void;
   removeProduct: (idProduct: string) => void;
   data: ProductInput;
   productData: ProductInput[];
};
dayjs.extend(customParseFormat);
const FormProduct = ({ products, submitProduct, data, removeProduct, productData }: Props) => {
   const { Option } = Select;
   const [isSave, setIsSave] = useState<boolean>(false);
   const [formProduct] = useForm<ProductInput>();
   const [productName, setProductName] = useState<string>('');
   const checkDuplicateItemInArray = (idProduct: string) => {
      return productData.filter((item) => item.idProduct === idProduct);
   };
   const handleAddProduct = (data: ProductInput, type: 'save' | 'autosave') => {
      const UNIQE_COUNT = 1;
      if (type === 'save') {
         if (checkDuplicateItemInArray(data.idProduct).length === UNIQE_COUNT) {
            message.warning('Đã tồn tại sản phẩm tương tự ');
            return;
         }
      }
      const newData = { ...data, date: data.date.toString(), productName };
      setIsSave(true);
      setProductName(productName);
      submitProduct(newData);
   };
   useEffect(() => {
      formProduct.setFieldsValue({ ...data, date: data.date !== '' ? dayjs(data.date) : '' });
      if (data.idProduct !== '') {
         setIsSave(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [data]);
   useEffect(() => {
      const currIdProduct = formProduct.getFieldValue('idProduct');
      setProductName(products.find((product) => product._id === currIdProduct)?.productName || '');
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [products, isSave]);
   useEffect(() => {
      if (isSave === true || data.idProduct === '') return;
      const timeId = setTimeout(() => {
         const newData = formProduct.getFieldsValue();
         handleAddProduct(newData, 'autosave');
         setIsSave(true);
      }, 800);
      return () => clearTimeout(timeId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isSave]);

   const handleConfirm = (id: string) => {
      removeProduct(id);
   };
   const disabledDate: RangePickerProps['disabledDate'] = (current) => {
      // Can not select days before today and today
      return current && current < dayjs().endOf('day');
   };
   return (
      <Form
         form={formProduct}
         onFinish={(value) => handleAddProduct(value, 'save')}
         className={` relative rounded-md border-[1px] ${
            isSave ? 'border-[rgba(0,0,0,0.1)]' : 'border-red-400'
         } border-[rgba(0,0,0,0.1)] p-3  w-full mb-[50px]`}
         layout='vertical'
      >
         <div className='flex justify-stretch items-center gap-3'>
            <Form.Item
               className='w-[50%]'
               label='Chọn sản phẩm'
               name='idProduct'
               hasFeedback
               rules={[{ required: true, message: 'Trường này là bắt buộc ' }]}
            >
               <Select
                  onChange={(value: string) => {
                     const productSelected = products.find((product) => product._id == (value as string));
                     if (!productSelected) {
                        message.error('Lỗi khi chọn sản phẩm !');
                        return;
                     }
                     setProductName(productSelected.productName!);
                     setIsSave(false);
                  }}
                  disabled={productName !== '' || isSave === true}
               >
                  {products.map((product) => (
                     <Option key={product._id} value={product._id}>
                        {product.productName}
                        {!product.shipments[0] && (
                           <Tag className='ml-2' color='red'>
                              Đã hết hàng
                           </Tag>
                        )}
                     </Option>
                  ))}
               </Select>
            </Form.Item>
            <Form.Item
               className='w-[50%]'
               label='Giá gốc'
               name='originPrice'
               hasFeedback
               rules={[
                  { required: true, message: 'Trường này là bắt buộc ' },
                  { min: 1, message: 'Nhập tối thiểu là 1 đơn vị' }
               ]}
            >
               <Input type='number' prefix='vnd/kg|' min={'1'} onChange={() => setIsSave(false)} />
            </Form.Item>
         </div>
         <div className='flex justify-stretch items-center gap-3'>
            <Form.Item
               className='w-[50%]'
               label='Cân nặng'
               name='weight'
               hasFeedback
               rules={[
                  { required: true, message: 'Trường này là bắt buộc ' },
                  { min: 1, message: 'Nhập tối thiểu là 1 đơn vị' }
               ]}
            >
               <Input type='number' prefix='kg|' min={'1'} onChange={() => setIsSave(false)} />
            </Form.Item>
            <Form.Item
               className='w-[50%]'
               label='Hạn sử dụng'
               name='date'
               hasFeedback
               rules={[{ required: true, message: 'Trường này là bắt buộc ' }]}
            >
               <DatePicker
                  showTime={false}
                  direction='ltr'
                  format={'DD/MM/YYYY'}
                  disabledDate={disabledDate}
                  onChange={() => setIsSave(false)}
               />
            </Form.Item>
         </div>
         <Space size={'large'} direction='horizontal' className='mb-[24px]'>
            <Popconfirm title='Bạn muốn xóa sản phẩm này ?' onConfirm={() => handleConfirm(data.idProduct)}>
               <Tooltip placement='top' title='Hủy'>
                  <button
                     type='button'
                     className='p-2 rounded-full bg-white w-10 h-10 shadow-md hover:w-11 hover:h-11 duration-100 '
                  >
                     <span className='text-greenPrimary w-4 font-bold'>x</span>
                  </button>
               </Tooltip>
            </Popconfirm>
            {!isSave && (
               <Form.Item className='mb-0'>
                  <Tooltip placement='top' title='Lưu'>
                     <button
                        type='submit'
                        className='flex justify-center items-center p-2 rounded-full bg-greenPrimary w-10 h-10 shadow-md hover:w-11 hover:h-11 duration-100 '
                     >
                        <ConfirmIcon className='text-greenPrimary w-4 fill-white' />
                     </button>
                  </Tooltip>
               </Form.Item>
            )}
         </Space>
      </Form>
   );
};

export default FormProduct;
