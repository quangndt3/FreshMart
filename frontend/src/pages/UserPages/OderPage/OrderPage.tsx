/* eslint-disable react-hooks/exhaustive-deps */
import { Link, useNavigate } from 'react-router-dom';
import { Button, Divider, Popconfirm, Select, Space, Table, Tag, message, notification } from 'antd';
import { useState, useCallback } from 'react';
import { IOrderFull } from '../../../interfaces/order';
import Loading from '../../../components/Loading/Loading';
import { getOrderForGuest } from '../../../api/order';
import { useDispatch, useSelector } from 'react-redux';
import { IAuth, deleteTokenAndUser } from '../../../slices/authSlice';
import FormQuery from './Component/FormQuery';
import { uppercaseFirstLetter } from '../../../helper';
import { formatStringToDate } from '../../../helper';
import {
   DONE_ORDER,
   FAIL_ORDER,
   ORDER_STATUS_FULL,
   PENDING_ORDER,
   SHIPPING_ORDER,
   SUCCESS_ORDER
} from '../../../constants/orderStatus';
import { clientSocket } from '../../../config/socket';
import { useCancelOrderMemberMutation, useGetOrderForMemberQuery } from '../../../services/order.service';
import { useClearTokenMutation } from '../../../services/auth.service';
import { setItem } from '../../../slices/cartSlice';

const { Column } = Table;

const OrderPage = () => {
   const { Option } = Select;
   const [loading, setLoading] = useState<boolean>(false);
   const [orders, setOrders] = useState<IOrderFull[]>([]);
   const [day, setDay] = useState<string | undefined>(undefined);
   const [status, setStatus] = useState<string | undefined>(undefined);
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   const { data, isLoading,error } = useGetOrderForMemberQuery(
      { status: status, day },
      { refetchOnMountOrArgChange: true, skip: !auth.accessToken }
   );
   const [clearToken] = useClearTokenMutation();
   const dispatch = useDispatch()
   const navigate = useNavigate()
 const onHandleLogout = () => {
      dispatch(deleteTokenAndUser());
      dispatch(setItem());
      clearToken();
      navigate('/login');
   };
   if (error && 'data' in error) {
      const errorData = error.data as { message?: string };
    
      if (
        errorData.message === 'Refresh Token is invalid' ||
        errorData.message === 'Refresh Token is expired ! Login again please !'
      ) {
        onHandleLogout();
      }
    }
   const [handleCancelOrder, { isLoading: loadingCancel }] = useCancelOrderMemberMutation();
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const canceledOrder = async (id: any) => {
      const dataCart = await handleCancelOrder(id);
      if ('data' in dataCart)
         if ('body' in dataCart.data) {
            if (dataCart.data.body.data) {
               clientSocket.emit('confirmOrder', JSON.stringify(dataCart.data.body.data));
               message.success('Hủy đơn hàng thành công !');
            }
         }
   };

   const handleSubmit = async (invoiceId: string) => {
      try {
         setLoading(true);
         const { data } = await getOrderForGuest(invoiceId);
         // eslint-disable-next-line no-extra-boolean-cast
         setOrders(data.body.data);
         setLoading(false);
      } catch (error) {
         setLoading(false);
         notification.error({
            message: 'Lỗi hệ thống'
         });
      }
   };

   const handleFindOrder = useCallback((invoiceId: string) => handleSubmit(invoiceId), []);
   if (loading || isLoading) return <Loading sreenSize='lg' />;
   return (
      <div className='main'>
         <section className='section-breadcrumb py-[15px] border-b-[1px] border-[#e2e2e2]'>
            <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start relative'>
               <span>
                  <Link to={'#'}>Trang chủ </Link> / Đơn hàng
               </span>
            </div>
         </section>

         <div className=' cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start pb-[50px]'>
            <div className='mt-10 w-full font-bold'>
               <FormQuery handleSubmit={handleFindOrder} />
               {auth.accessToken && (
                  <div className='flex justify-start items-center gap-3 mt-2'>
                     <Select style={{ width: 200 }} defaultValue={''} onChange={(value) => setDay(value)} value={day}>
                        <Option value=''>Chọn khoảng thời gian</Option>
                        <Option value='7'>7 ngày gần đây</Option>
                        <Option value='30'>1 tháng gần đây</Option>
                     </Select>
                     <Select
                        style={{ width: 200 }}
                        defaultValue={''}
                        onChange={(value) => setStatus(value)}
                        value={status}
                     >
                        <Option value=''>Trạng thái đơn hàng</Option>
                        {ORDER_STATUS_FULL.map((statusOrder, idx) => (
                           <Option key={idx} value={statusOrder.status.toLowerCase()}>
                              {statusOrder.status}
                           </Option>
                        ))}
                     </Select>
                  </div>
               )}
               <Divider></Divider>
               <div className='bg-slate-50'>
                  <Table
                     dataSource={orders.length > 0 ? orders : data ? data.body.data! : []}
                     pagination={{ pageSize: 7 }}
                     scroll={{ y: 800 }}
                  >
                     <Column
                        title='Ngày mua'
                        dataIndex='createdAt'
                        key='createdAt'
                        render={(date) => <p>{formatStringToDate(date)}</p>}
                     />
                     <Column title='Tên' dataIndex='customerName' key='customerName' />
                     <Column title='Số điện thoại' dataIndex='phoneNumber' key='phoneNumber' />
                     <Column
                        title='Trạng thái'
                        dataIndex='status'
                        key='status'
                        render={(_: IOrderFull, record: IOrderFull) => {
                           let color = '';
                           if (record.status == PENDING_ORDER.toLowerCase()) {
                              color = 'yellow';
                           }
                           if (record.status == SHIPPING_ORDER.toLowerCase()) {
                              color = 'orange';
                           }
                           if (record.status == SUCCESS_ORDER.toLowerCase()) {
                              color = 'green';
                           }
                           if (record.status == FAIL_ORDER.toLowerCase()) {
                              color = 'red';
                           }
                           if (record.status == DONE_ORDER.toLowerCase()) {
                              color = 'purple';
                           }
                           return <Tag color={color}>{uppercaseFirstLetter(record.status)}</Tag>;
                        }}
                     />
                     <Column
                        title='Hành động'
                        key='action'
                        render={(_: IOrderFull, record: IOrderFull) => (
                           <Space size='middle'>
                              {record.products.every((item) => item.isSale === false) &&
                                 record.status === 'chờ xác nhận' &&
                                 record.status !== FAIL_ORDER.toLowerCase() && (
                                    <Popconfirm
                                       className={``}
                                       description='Bạn chắc chắn muốn huỷ đơn hàng chứ?'
                                       okText='Đồng ý'
                                       cancelText='Hủy bỏ'
                                       title='Bạn có muốn xóa?'
                                       onConfirm={() => canceledOrder(record?._id)}
                                    >
                                       <Button
                                          disabled={loadingCancel}
                                          className='bg-red-500 text-white hover:!text-white hover:!border-none'
                                       >
                                          Huỷ đơn hàng
                                       </Button>
                                    </Popconfirm>
                                 )}
                              <Link to={'/my-order/' + record?._id}>
                                 <Button className='bg-greenPrimary text-white hover:!text-white hover:!border-none'>
                                    Chi tiết
                                 </Button>
                              </Link>
                           </Space>
                        )}
                     />
                  </Table>
               </div>
            </div>
         </div>
      </div>
   );
};

export default OrderPage;
