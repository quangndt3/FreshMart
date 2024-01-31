import { Link, useParams } from 'react-router-dom';
import { BiChevronLeft } from 'react-icons/bi';
import { ConfigProvider, Divider, Steps, message, Button, Tag } from 'antd';
import style from './OrderDetail.module.css';
import { useEffect, useState } from 'react';
import Loading from '../../../components/Loading/Loading';
import { formatStringToDate, transformCurrency, uppercaseFirstLetter } from '../../../helper';
import {
   DONE_ORDER,
   FAIL_ORDER,
   ORDER_STATUS_FULL,
   PENDING_ORDER,
   SHIPPING_ORDER,
   SUCCESS_ORDER
} from '../../../constants/orderStatus';
import ProductInOrder from './Component/ProductInOrder';
import { IAuth } from '../../../slices/authSlice';
import { useSelector } from 'react-redux';
import { clientSocket } from '../../../config/socket';
import { useConfirmOrderMemberMutation, useGetOneOrderForMemberQuery } from '../../../services/order.service';
const OrderDetail = () => {
   const { id } = useParams();
   const { data, isLoading, refetch } = useGetOneOrderForMemberQuery(id!, { refetchOnMountOrArgChange: true });
   const [handleConfirmOrder, { isLoading: loadingConfirm }] = useConfirmOrderMemberMutation();
   const [isShowConfirm, setIsShowConfirm] = useState<boolean>(false);
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const [subtotal,setSubtotal] = useState<number>(0)
   const [discount,setDiscount] = useState<number>(0)
   useEffect(()=>{
      const temp = data?.body.data?.products?.reduce((cal, product) => {
         return cal + (product.weight * product.price);
     }, 0);
     if(temp!==undefined){
      setSubtotal(temp)
     }
   },[data])   
   useEffect(()=>{
      if(data?.body.data.voucher){
         if(data?.body.data.voucher?.maxReduce>0){
            if(data?.body.data.voucher.maxReduce<subtotal){
               console.log("1");
               setDiscount(data?.body.data.voucher.maxReduce)
            }else{
               setDiscount((subtotal*data?.body.data?.voucher?.percent/100))
            }
            
         }
         else{
            setDiscount((subtotal*data?.body.data?.voucher?.percent/100))
         }
      }
   },[data,subtotal])
   useEffect(() => {
      clientSocket.on('statusNotification', (data) => {
         if (data.status === SUCCESS_ORDER.toLowerCase()) {
            setIsShowConfirm(true);
         }
         refetch();
      });
      return () => {};
   }, [auth]);
   const getStatusOfOrder = () => {
      return ORDER_STATUS_FULL.indexOf(
         ORDER_STATUS_FULL.find(
            (status) =>
               status.status === uppercaseFirstLetter(data?.body.data ? data?.body.data.status : 'chờ xác nhận')
         )!
      );
   };
   const handleChangeStatusOrder = async () => {
      if (!data?.body.data) return;
      await handleConfirmOrder(data.body.data._id);
      const dataSubmit = {
         idOrder: data?.body.data?._id,
         customerName: data.body.data.customerName!,
         email: data.body.data.email!,
         note: data.body.data.note!,
         paymentMethod: data.body.data.paymentMethod!,
         userId: data.body.data.userId!,
         invoiceId: data.body.data.invoiceId,
         shippingAddress: data.body.data.shippingAddress!,
         products: data.body.data.products!,
         phoneNumber: data.body.data.phoneNumber!,
         totalPayment: data.body.data.totalPayment!,
         status: DONE_ORDER.toLowerCase()
      };
      try {
         clientSocket.emit('confirmOrder', JSON.stringify(dataSubmit));
         refetch();
         message.success('Xác nhận đơn hàng thành công!');
      } catch (error) {
         message.error('Lỗi hệ thống!');
         console.log(error);
      }
   };
   if (isLoading) return <Loading sreenSize='lg' />;   
   return (
      <div className=' flex flex-col items-start gap-[30px] max-w-[1520px] m-auto sm:p-10 max-sm:p-[10px]'>

         <Link to='/orders' className='flex justify-start items-center gap-[10px] text-black'>
            <BiChevronLeft className='text-[1.5rem]' />
            <span className='text-lg hover:font-semibold duration-200'>Tất cả đơn hàng</span>
         </Link>
         <div className='bg-[rgba(182,180,180,0.1)] w-full min-h-[300px] rounded-2xl max-sm:p-[20px] sm:p-10 relative'>
            <span className='text-xl font-semibold text-black max-sm:text-[16px]'>
               Cảm ơn quý khách, <span className='text-greenPrimary max-sm:text-[14px]'>{data?.body.data?.customerName}!</span>
            </span>
            <p className='mt-2 text-black font-bold text-lg max-sm:text-[16px]'>Đơn hàng (#) {data?.body.data?.invoiceId}</p>
            {isShowConfirm ||
               (data?.body.data?.status === SUCCESS_ORDER.toLowerCase() && (
                  <Button
                     loading={loadingConfirm}
                     disabled={loadingConfirm}
                     onClick={() => handleChangeStatusOrder()}
                     className='font-semibold hover:!text-[#d2401e] hover:!border-none  px-3 absolute right-10 rounded-lg hover:bg-orange-400 duration-300 bg-orange-300 text-[#d2401e] top-10'
                  >
                     Đã nhận được hàng
                  </Button>
               ))}
            {data?.body.data?.status === FAIL_ORDER.toLowerCase() && (
               <Tag className='py-2 px-5  absolute right-10 top-10' color='red'>
                  {FAIL_ORDER}
               </Tag>
            )}{' '}
            {data?.body.data?.status !== FAIL_ORDER.toLowerCase() && (
               <ConfigProvider
                  theme={{
                     components: {
                        Steps: {
                           colorPrimary: '#d2401e',
                           controlItemBgActive: '#ffc7ba'
                        }
                     }
                  }}
               >
                  <Steps
                     className={`mt-10 ${style['ant-steps-item-finish']} max-w-[80%] flex flex-wrap`}
                     current={getStatusOfOrder()}
                     items={[
                        {
                           title: PENDING_ORDER
                        },
                        {
                           title: SHIPPING_ORDER
                        },
                        {
                           title: SUCCESS_ORDER
                        },
                        {
                           title: DONE_ORDER
                        }
                     ]}
                  />
               </ConfigProvider>
            )}
            <Divider />
            <div className='w-full flex justify-start gap-5 flex-wrap'>
               <div className='w-[40%] max-md:w-full'>
                  <div className='flex justify-between w-[60%] max-md:w-full max-sm:flex-wrap'>
                     <div className='flex flex-col items-start max-sm:w-full max-sm:mb-[10px]'>
                        <span className='text-md'>Ngày đặt hàng</span>
                        <strong className='text-md text-black'>
                           {formatStringToDate(data?.body.data ? data?.body.data?.createdAt : '')}
                        </strong>
                     </div>
                     <div className='flex flex-col items-start  max-sm:w-full'>
                        <span className='text-md'>Phương thức thanh toán</span>
                        <strong className='text-md text-black'>
                           {data?.body.data
                              ? data?.body.data?.pay
                                 ? 'Đã thanh toán online'
                                 : 'Khi nhận hàng'
                              : 'Chưa thanh toán'}
                        </strong>
                     </div>
                  </div>
                  <div className='flex flex-col items-start mt-5'>
                     <span className='text-md'>Địa chỉ nhận hàng</span>
                     <strong className='text-md text-black'>{data?.body.data?.shippingAddress}</strong>
                  </div>
                  <div className='flex flex-col items-start mt-5'>
                     <span className='text-md'>Ghi chú</span>
                     <strong className='text-md text-black'>{data?.body.data?.note}</strong>
                  </div>
               </div>
               <Divider type='vertical' className='h-[200px] max-md:hidden' />
               <div className='w-[50%] max-md:w-full'>
                  <div className=' flex flex-col items-start gap-4 max-h-[350px]  px-10 max-md:px-[10px]'>
                     {data?.body.data &&
                        data?.body.data.products.map((product) => (
                           <ProductInOrder
                              refetch={refetch}
                              product={product}
                              oderId={data?.body.data._id}
                              statusOrder={data?.body.data.status}
                           />
                        ))}
                  </div>
                  <Divider />
            {data?.body?.data?.voucher?.code && <div className='flex justify-between items-center text-black px-10 max-sm:px-[10px]'>
                     <strong>Tính tạm</strong>
                     <span className='font-semibold'>
                        {subtotal.toLocaleString('vi-VN', {
                                 style: 'currency',
                                 currency: 'VND'
                              })}
                     </span>
                  </div>}
                {data?.body.data?.voucher?.code &&  <div className='mt-3 flex justify-between items-center text-black px-10 max-sm:px-[10px]'>
                     <strong>Khuyến mãi</strong>
                     <span className='font-semibold'>
                    - {discount.toLocaleString('vi-VN', {
                                 style: 'currency',
                                 currency: 'VND'
                              })}
                     
                     </span>
                  </div>}
                  <div className='mt-3 flex justify-between items-center text-black px-10 text-xl max-sm:px-[10px]'>
                     <strong className='font-bold'>Tổng tiền</strong>
                     <span className='font-bold'>
                        {transformCurrency(data?.body.data ? data?.body.data?.totalPayment : 0)}
                     </span>
                  </div>
               </div>
            </div>{' '}
         </div>
      </div>
   );
};

export default OrderDetail;
