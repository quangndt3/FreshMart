import { useEffect, useState } from 'react';
import { Button, ConfigProvider, Form, Input, Modal, Rate, Space, message } from 'antd';
import TextQuill from '../../../../components/TextQuill/TextQuill';
import { IProductOrder } from '../../../../interfaces/order';
import { DONE_ORDER } from '../../../../constants/orderStatus';
import { useSelector } from 'react-redux';
import { IAuth } from '../../../../slices/authSlice';
import { useAddEvaluationMutation } from '../../../../services/evaluation.service';
import { IEvaluation } from '../../../../interfaces/evaluation';
import { Link } from 'react-router-dom';

type Props = {
   product: IProductOrder;
   statusOrder: string;
   oderId: string;
   refetch: () => void;
};

const ProductInOrder = ({ product, statusOrder, oderId, refetch }: Props) => {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const user = useSelector((state: { userReducer: IAuth }) => state.userReducer.user);
   const [create, { isLoading, error }] = useAddEvaluationMutation();
   const [form] = Form.useForm();
   useEffect(() => {
      if (error && 'data' in error) {
         const data = error.data as { message: string };
         if ('message' in data) message.error(data?.message);
      }
   }, [error]);
   const handleFinish = async (values: IEvaluation) => {
      values.userId = Object.keys(user).length > 0 ? user._id : null;
      values.productId = product.productId;
      values.orderId = oderId;
      await create(values);
      refetch();
      setIsOpen(false);
   };

   return (
      
    <div className='one-product flex justify-between gap-[5px] items-center w-full flex-wrap'>
       <Link to={"/products/"+ product.productId}>
       <div className='flex justify-start gap-2 md:items-center max-md:flex-col'>
       <img src={product.images} alt='product' className='max-w-[100px] aspect-square rounded-lg' />
       <span className='text-black font-semibold max-w-[300px]'>{product.productName+" "} </span>
    </div>
     </Link>

    <div className='flex justify-start gap-2 items-center max-md:text-[16px]'>
       <span>{product.weight} x</span>
       <span className='text-lg text-black max-md:text-[16px]'>{product.price.toLocaleString('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                         })}</span>
       {statusOrder === DONE_ORDER.toLowerCase() && !product?.evaluation ? (
          <button
             onClick={() => setIsOpen(true)}
             className='rounded-sm ml-3 hover:bg-[#5ac471] py-2 px-5 text-white bg-greenP500 duration-300'
          >
             Đánh giá
          </button>
       ) : (
          <> </>
       )}
    </div>

    <ConfigProvider
       theme={{
          components: {
             Modal: {
                colorPrimary: '#80b235',
                colorPrimaryBorder: '#80b235'
             }
          }
       }}
    >
       <Modal
          title='Đánh giá sản phẩm'
          open={isOpen}
          width={800}
          onCancel={() => setIsOpen(false)}
          footer={[
             <Button
                className='bg-white'
                onClick={() => {
                   setIsOpen(false);
                   form.resetFields();
                }}
             >
                Hủy
             </Button>,
             <Button
                type='default'
                loading={isLoading}
                className='bg-greenPrimary text-white hover:!text-white hover:!border-0'
                onClick={() => {
                   handleFinish(form.getFieldsValue(true));
                }}
             >
                Gửi
             </Button>
          ]}
       >
          <div className='one-product w-full'>
             <Form form={form} onFinish={handleFinish} layout='vertical' className='w-full'>
                <div className='flex justify-start gap-2 items-center'>
                   <img src={product.images} alt='product' className='max-w-[100px] aspect-square rounded-lg' />
                   <span className='text-black font-semibold '>{product.productName}</span>
                </div>
                {Object.keys(user).length == 0 && (
                   <Space className='w-full' size={'large'}>
                      <Form.Item
                         label='Tên quý khách'
                         rules={[{ required: true, message: 'Vui lòng điền thông tin' }]}
                         name='userName'
                      >
                         <Input type='text' />
                      </Form.Item>
                      <Form.Item
                         label='Số điện thoại'
                         rules={[
                            { required: true, message: 'Vui lòng điền thông tin' },
                            { len: 10, message: 'Vui lòng nhập đúng định dạng số điện thoại (10-11 số)' }
                         ]}
                         name='phoneNumber'
                      >
                         <Input type='text' />
                      </Form.Item>
                   </Space>
                )}

                <Form.Item
                   name='content'
                   label='Nội dung'
                   rules={[{ required: true, message: 'Vui lòng điền thông tin' }]}
                >
                   <TextQuill getValue={(value) => form.setFieldValue('content', value)} />
                </Form.Item>
                <Form.Item
                   name='rate'
                   label='Đánh giá'
                   rules={[{ required: true, message: 'Vui lòng đánh giá chất lượng' }]}
                >
                   <Rate />
                </Form.Item>
             </Form>
          </div>
       </Modal>
    </ConfigProvider>
 </div>
   );
};

export default ProductInOrder;
