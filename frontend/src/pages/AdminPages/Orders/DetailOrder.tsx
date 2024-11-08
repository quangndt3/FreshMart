import { useState, useEffect } from 'react';
import { IOrderFull } from '../../../interfaces/order';
import { Button, Col, Row, message } from 'antd';
import { getDetailOrder } from '../../../api/order';
import { DONE_ORDER, FAIL_ORDER, ORDER_OF_STATUS, SUCCESS_ORDER } from '../../../constants/orderStatus';
import ButtonCheck from './components/ButtonCheck';
import { useUpdateOrderMutation } from '../../../services/order.service';
import { adminSocket } from '../../../config/socket';
import { useClearTokenMutation } from '../../../services/auth.service';
import { deleteTokenAndUser } from '../../../slices/authSlice';
import { setItem } from '../../../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

type Props = {
   idOrder: string;
};

const DetailOrder = ({ idOrder }: Props) => {
   const [order, setOrder] = useState<IOrderFull>();
   const [statusOrder, setStatusOrder] = useState<string>();
   const [handleUpdateOrder, { isLoading }] = useUpdateOrderMutation();
   const [subtotal, setSubtotal] = useState<number>(0);
   const [discount, setDiscount] = useState<number>(0);
   const [clearToken] = useClearTokenMutation();
   const navigate = useNavigate()
   const dispatch = useDispatch()
   const onHandleLogout = () => {
        dispatch(deleteTokenAndUser());
        dispatch(setItem());
        clearToken();
        navigate('/login');
     };
   useEffect(() => {
      (async () => {
         try {
            const { data } = await getDetailOrder(idOrder);
            setOrder(data.body.data);
            setStatusOrder(data.body.data.status);
         } catch (error) {
            message.error('Lỗi hệ thống!');
         }
      })();
   }, [idOrder]);
   useEffect(() => {
      const temp = order?.products?.reduce((cal, product) => {
         return cal + product.weight * product.price;
      }, 0);
      if (temp !== undefined) {
         setSubtotal(temp);
      }
   }, [order]);
   useEffect(() => {
      if (order?.voucher) {
         if (order?.voucher.maxReduce > 0) {
            if (order?.voucher.maxReduce < subtotal) {
               setDiscount(order.voucher.maxReduce);
            } else {
               setDiscount((subtotal * order?.voucher?.percent) / 100);
            }
         } else {
            setDiscount((subtotal * order?.voucher?.percent) / 100);
         }
      }
   }, [order, subtotal]);

   const handleChangeStatus = async (value: string): Promise<void> => {
      if (!order || isLoading) return;

      if (value !== 'đã hủy') {
         if (
            ORDER_OF_STATUS.indexOf(ORDER_OF_STATUS.find((status) => status.status.toLowerCase() === statusOrder)!) !==
            ORDER_OF_STATUS.indexOf(ORDER_OF_STATUS.find((status) => status.status.toLowerCase() === value)!) - 1
         ) {
            message.warning('Cần thay đổi trạng thái theo thứ tự');
            return Promise.reject();
         }
      }
      try {
         await handleUpdateOrder({
            idOrder,
            customerName: order.customerName!,
            email: order.email!,
            note: order.note!,
            paymentMethod: order.paymentMethod!,
            userId: order.userId!,
            shippingAddress: order.shippingAddress!,
            products: order.products!,
            phoneNumber: order.phoneNumber!,
            totalPayment: order.totalPayment!,
            status: value.toLowerCase()
         }).unwrap().catch((err) => {
            if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
               onHandleLogout()
            } 
         });
         // phai https thanh cong thi moi emot socket
         adminSocket.emit(
            'changeStatus',
            JSON.stringify({
               userId: order.userId!,
               orderId: idOrder,
               status: value.toLowerCase(),
               invoiceId: order.invoiceId
            })
         );
      } catch (error) {
         message.error('Lỗi hệ thống !');
         return Promise.reject();
      }
      const newStatus = value;
      setStatusOrder(newStatus);
   };
   return (
      <div className='p-3 max-h-[600px] overflow-auto'>
         <div className='flex justify-between items-end gap-2'>
            <div className='flex justify-start items-end gap-2'>
               <h2 className='text-xl'>{order?.customerName}</h2>
               <span className='text-greenP500'>(#) {order?.invoiceId}</span>
            </div>
            {statusOrder?.toLowerCase() != DONE_ORDER.toLowerCase() &&
            statusOrder?.toLowerCase() != FAIL_ORDER.toLowerCase() &&
            statusOrder?.toLowerCase() !== SUCCESS_ORDER.toLowerCase() &&
            order?.products.every((item) => item.isSale === false) ? (
               <Button
                  size='large'
                  type='text'
                  className='bg-red-500 text-white mx-2'
                  onClick={() => handleChangeStatus('đã hủy')}
               >
                  Hủy đơn hàng
               </Button>
            ) : (
               <></>
            )}
         </div>
         <div className='flex justify-start items-center gap-[100px]'>
            <div className='flex flex-col items-start gap-[5px] mt-5'>
               <span className='text-sm font-semibold text-greenP500'>EMAIL</span>
               <span className='text-sm'>{order?.email}</span>
            </div>
            <div className='flex flex-col items-start gap-[5px] mt-5'>
               <span className='text-sm font-semibold text-greenP500'>SỐ ĐIỆN THOẠI</span>
               <span className='text-sm'>{order?.phoneNumber}</span>
            </div>
            <div className='flex flex-col items-start gap-[5px] mt-5'>
               <span className='text-sm font-semibold text-greenP500'>ĐỊA CHỈ</span>
               <span className='text-sm max-w-[200px] text-wrap'>{order?.shippingAddress}</span>
            </div>
         </div>
         <Row className='py-3 border-t-[1px] border-[rgba(0,0,0,0.1)] mt-10 '>
            <Col span={6}>
               <span className='text-sm font-semibold text-greenP500'>SẢN PHẨM</span>
            </Col>
            <Col span={6}>
               <span className='text-sm font-semibold text-greenP500'>ĐƠN GIÁ</span>
            </Col>
            <Col span={6}>
               <span className='text-sm font-semibold text-greenP500'>SỐ LƯỢNG</span>
            </Col>

            <Col span={6}>
               <span className='text-sm font-semibold text-greenP500'>THÀNH TIỀN</span>
            </Col>
         </Row>
         {order?.products.map((product) => (
            <Row key={product._id}>
               <Col span={6}>
                  <span className='font-semibold'>
                     {product.productName} {product.isSale == true && '(Sản phẩm thanh lý)'}
                  </span>
               </Col>
               <Col span={6}>
                  <span className='font-semibold'>
                     {product.price.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                     })}
                     (vnd)
                  </span>
               </Col>
               <Col span={6}>
                  <span className='font-semibold'>{product.weight}(kg)</span>
               </Col>
               <Col span={6}>
                  <span className='font-semibold'>
                     {(Number(product.weight) * product.price).toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                     })}
                     (vnd)
                  </span>
               </Col>
            </Row>
         ))}
         <div className='flex flex-col items-start gap-[5px] mt-5'>
            <span className='text-sm font-semibold text-greenP500'>GHI CHÚ</span>
            <span className='text-sm max-w-[200px] text-wrap'>{order?.note}</span>
         </div>
         {order?.voucher?.code != null && (
            <div className='flex flex-col items-start gap-[5px] mt-5'>
               <span className='text-sm font-semibold text-greenP500'>Mã giảm giá</span>
               <span className='text-sm w-full text-wrap'>
                  {order?.voucher?.code}: Giảm {order?.voucher?.percent}% (
                  {order?.voucher?.miniMumOrder > 0
                     ? 'Giá trị đơn hàng tối thiểu trên ' +
                       order?.voucher?.miniMumOrder.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                       })
                     : ''}
                  ) (
                  {order?.voucher?.maxReduce > 0
                     ? 'Giảm tối đa: ' +
                       order?.voucher?.maxReduce.toLocaleString('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                       })
                     : ''}
                  )
               </span>
            </div>
         )}
         {order?.voucher?.code && (
            <Row className='py-3 border-t-[1px] border-[rgba(0,0,0,0.1)] mt-10' align={'middle'}>
               <Col span={4}>
                  <span className='text-sm  text-greenP800 font-bold'>Tính tạm:</span>
               </Col>
               <Col span={4}>
                  <span className='text-lg  text-greenP800 font-bold'>
                     {subtotal.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                     })}
                     (vnd)
                  </span>
               </Col>
            </Row>
         )}
         {order?.voucher?.code && (
            <Row className=' border-t-[1px] pt-[15px] border-[rgba(0,0,0,0.1)] ' align={'middle'}>
               <Col span={4}>
                  <span className='text-sm  text-greenP800 font-bold'>Giảm giá:</span>
               </Col>
               <Col span={4}>
                  <span className='text-lg  text-greenP800 '>
                     -{' '}
                     {discount.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                     })}
                     (vnd)
                  </span>
               </Col>
            </Row>
         )}
         <Row className='py-3 border-t-[1px] border-[rgba(0,0,0,0.1)] mt-5' align={'middle'}>
            <Col span={4}>
               <span className='text-sm  text-greenP800 font-bold'>TỔNG TIỀN:</span>
            </Col>
            <Col span={4}>
               <span className='text-lg  text-greenP800 font-bold'>
                  {order?.totalPayment.toLocaleString('vi-VN', {
                     style: 'currency',
                     currency: 'VND'
                  })}{' '}
                  (vnd)
               </span>
            </Col>
         </Row>
         <Row className='py-3 border-t-[1px] border-[rgba(0,0,0,0.1)] mt-5' align={'middle'}>
            {statusOrder !== FAIL_ORDER.toLowerCase() &&
               ORDER_OF_STATUS.map((status, index) => {
                  if (status.status.toLowerCase() != 'đã hủy') {
                     return (
                        <Col span={6} key={index}>
                           <ButtonCheck
                              colorPrimary={status.color}
                              value={status.status}
                              disable={
                                 ORDER_OF_STATUS.indexOf(
                                    ORDER_OF_STATUS.find((status) => status.status.toLowerCase() === statusOrder)!
                                 ) >= index || statusOrder === DONE_ORDER.toLowerCase()
                              }
                              onClick={(value) => handleChangeStatus(value)}
                           />
                        </Col>
                     );
                  }
               })}
         </Row>
      </div>
   );
};

export default DetailOrder;
