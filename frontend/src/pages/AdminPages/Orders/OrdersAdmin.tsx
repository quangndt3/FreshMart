/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Layout, Modal, Radio, Space, Table, Tag, theme } from 'antd';
import { useState, useEffect } from 'react';
import Loading from '../../../components/Loading/Loading';
import { IOrderFull } from '../../../interfaces/order';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import FilterIcon from '../../../components/Icons/FilterIcon';
import { Helmet } from 'react-helmet';
import { formatStringToDate, transformStatusOrder } from '../../../helper';
import DetailOrder from './DetailOrder';
const { Column } = Table;
import '../../../css/admin-order.css';
import { useGetAllOrderQuery } from '../../../services/order.service';
import { ORDER_STATUS_FULL } from '../../../constants/orderStatus';
import { adminSocket } from '../../../config/socket';
import useDebounce from '../../../hooks/useDebounce';
import ReSizePage from '../../ReSizePage';

const OrdersAdmin = () => {
   const [isOpen, setIsOpen] = useState<boolean>(false);
   const [idOrder, setIdOrder] = useState<string>('');
   const [collapsed, setCollapsed] = useState(true);
   const [orders, setOrders] = useState<any>({});
   const [invoiceId, setInvoiceId] = useState<string>('');
   const finalInvoiceId = useDebounce(invoiceId, 800);
   const {
      token: { colorBgContainer }
   } = theme.useToken();
   const { data, isLoading, refetch } = useGetAllOrderQuery(
      { ...orders, order: 'desc', invoiceId: finalInvoiceId },
      { refetchOnMountOrArgChange: true }
   );
   useEffect(() => {
      adminSocket.on('purchaseNotification', () => refetch());
      adminSocket.on('adminStatusNotification', () => refetch());
      return () => {};
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   if (isLoading) return <Loading sreenSize='lg' />;

   return (
      <>
         <Helmet>
            <title>Đơn hàng</title>
         </Helmet>
         <div className='lg:hidden'>
            <ReSizePage />
         </div>
         <Layout style={{ minHeight: '100vh', display: 'flex', position: 'relative', width: '100%' }}>
            <div className='flex-1 flex justify-center items-center flex-col mt-10 w-[100%]'>
               <div className='flex justify-between items-center w-[90%]'>
                  <h1 className='text-3xl font-semibold text-[rgba(0,0,0,0.7)]'>Đơn hàng</h1>
               </div>
               <div className='w-[90%] min-h-[100vh] bg-white rounded-lg mt-5'>
                  <header className='flex justify-start gap-4 items-center px-5 py-5'>
                     <form className='flex justify-between items-center max-w-[50%] gap-2 rounded-[100px] border-[1px] border-[#80b235] p-2'>
                        <SearchOutlined style={{ fontSize: '1rem', color: '#80b235' }} />
                        <input
                           type='text'
                           className='text-sm outline-none border-none w-full flex-1'
                           placeholder='Tìm kiếm đơn hàng'
                           value={invoiceId}
                           onChange={(e) => setInvoiceId(e.target.value)}
                        />
                     </form>
                     <button
                        onClick={() => setCollapsed(false)}
                        className='border-[1px] border-[rgba(0,0,0,0.2)] rounded-xl p-2 text-greenPrimary flex items-center gap-1 hover:-translate-y-1 duration-100'
                     >
                        <FilterIcon className='text-greenPrimary' />
                        Lọc
                     </button>
                  </header>

                  <Table
                     dataSource={
                        data?.body.data
                           ? data?.body?.data?.map((order) => ({
                                ...order,
                                createdAt: formatStringToDate(order.createdAt)
                             }))
                           : []
                     }
                     pagination={{ pageSize: 10 }}
                     scroll={{ y: 500, x: 800 }}
                     onRow={(record) => {
                        return {
                           onClick: () => {
                              setIsOpen(true);
                              setIdOrder(record._id);
                           }
                        };
                     }}
                  >
                     <Column align='center' width={120} title='Ngày mua' dataIndex='createdAt' key='createdAt' />
                     <Column
                        align='center'
                        width={120}
                        title='Tổng tiền (VND)'
                        dataIndex='totalPayment'
                        key='totalPayment'
                        render={(price) => (
                           <p>
                              {price.toLocaleString('vi-VN', {
                                 style: 'currency',
                                 currency: 'VND'
                              })}
                           </p>
                        )}
                     />
                     <Column
                        align='center'
                        width={150}
                        title='Tên khách hàng'
                        dataIndex='customerName'
                        key='customerName'
                     />
                     <Column
                        align='center'
                        width={150}
                        title='Số điện thoại'
                        dataIndex='phoneNumber'
                        key='phoneNumber'
                     />
                     <Column
                        align='center'
                        width={150}
                        title='Lợi nhuận'
                        dataIndex='profit'
                        key='profit'
                        render={(_: IOrderFull, record: IOrderFull) => (
                           <Space size='middle'>
                              <span>
                                 {record?.products.reduce((cal: number, item: any,) => {
                                    const id_Product = item.productId;
                                    const weight = item.weight;
                                    const price = item.price;
                                    const voucher = record.voucher
                                    const sum = item.shipmentId.products.reduce((total: number, item: any) => {
                                       if (item.idProduct == id_Product) {
                                          
                                          let result = price * weight - item.originPrice * weight;
                                          if(weight==19){
                                             console.log(result);
                                             
                                          }
                                          if(weight==31){
                                             console.log(result);
                                             
                                          }
                                          if(voucher?.code != null){
                                             if(voucher.maxReduce){
                                                if(voucher.maxReduce < result  ){
                                                   result = result - (voucher.maxReduce/record.products.length)                                                   
                                                }
                                                else{
                                                   result = result - (result - voucher.percent/100)
                                                }
                                             }else{
                                                result = result - (result - voucher.percent/100)
                                             }
                                          }
                                          return total + Number(result);
                                       }
                                       return total
                                    },0);

                                    return sum + cal;
                                 }, 0).toLocaleString('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                 })}
                              </span>
                           </Space>
                        )}
                     />
                     <Column
                        align='center'
                        width={200}
                        title='Phương thức thanh toán'
                        dataIndex='paymentMethod'
                        key='paymentMethod'
                        render={(_: IOrderFull, record: IOrderFull) => (
                           <Space size='middle'>
                              <Tag
                                 className={` py-2 px-3 text-white border-none`}
                                 style={{
                                    background:
                                       record.paymentMethod === 'vnpay'
                                          ? 'linear-gradient(rgb(0, 161, 230), rgb(0, 82, 205))'
                                          : '#45bd62'
                                 }}
                              >
                                 {record.paymentMethod === 'vnpay' ? 'Thanh toán vnpay' : 'Thánh toán khi nhận hàng'}
                              </Tag>
                           </Space>
                        )}
                     />
                     <Column
                        align='center'
                        width={150}
                        title='Trạng thái thanh toán'
                        dataIndex='pay'
                        key='pay'
                        render={(_: IOrderFull, record: IOrderFull) => (
                           <Space size='middle'>
                              <Tag
                                 className={` py-2 px-3 text-white border-none`}
                                 style={{
                                    background: record.pay
                                       ? 'linear-gradient(rgb(0, 82, 205), rgb(0, 161, 230))'
                                       : '#f7b928'
                                 }}
                              >
                                 {record.pay ? 'Đã thanh toán' : 'Chưa thanh toán'}
                              </Tag>
                           </Space>
                        )}
                     />
                     <Column
                        fixed='right'
                        width={200}
                        title='Trạng thái'
                        key='status'
                        render={(_: IOrderFull, record: IOrderFull) => (
                           <Space size='middle'>
                              <Tag
                                 className={` py-2 px-3 text-white border-none`}
                                 style={{ background: transformStatusOrder(record.status).color }}
                              >
                                 {transformStatusOrder(record.status).status}
                              </Tag>
                           </Space>
                        )}
                     />
                  </Table>
                  <Modal
                     width={1000}
                     onCancel={() => setIsOpen(false)}
                     open={isOpen}
                     footer={[]}
                     style={{ top: 50, left: 50 }}
                  >
                     <DetailOrder idOrder={idOrder} />
                  </Modal>
               </div>
            </div>

            <Layout.Sider
               width='300'
               style={{
                  background: colorBgContainer,
                  position: 'fixed',
                  bottom: 0,
                  right: 0,
                  minHeight: '100vh',
                  boxShadow: '-10px 0px 10px -2px #d8d6d6',
                  zIndex: '100'
               }}
               collapsible
               collapsed={collapsed}
               onCollapse={(value) => setCollapsed(value)}
               trigger={null}
               collapsedWidth={0}
            >
               <div className=' relative px-4'>
                  <Button className='absolute top-3 left-60 border-none' onClick={() => setCollapsed(true)}>
                     <CloseOutlined className='text-red-500 ' />
                  </Button>
                  <p className='text-center items-center text-2xl py-10 font-semibold text-[rgba(0,0,0,0.5)]'>
                     Lọc đơn hàng
                  </p>

                  <h1 className='pb-3'>Trạng thái:</h1>
                  <Radio.Group
                     value={orders?.status || ''}
                     onChange={(e) => setOrders((prev: any) => ({ ...prev, status: e.target.value }))}
                  >
                     {ORDER_STATUS_FULL.map((statusOrder) => (
                        <Radio className='mt-5' value={statusOrder.status.toLowerCase()}>
                           {statusOrder.status}
                        </Radio>
                     ))}
                  </Radio.Group>
                  <h1 className='pt-5 pb-3'>Ngày:</h1>
                  <Radio.Group
                     value={orders?.day || ''}
                     onChange={(e) => setOrders((prev: any) => ({ ...prev, day: e.target.value }))}
                  >
                     <Radio value={'7'}>7 ngày</Radio>
                     <Radio value={'30'}>30 ngày</Radio>
                  </Radio.Group>
               </div>
               <Button className='text-center items-center mt-4 ml-4' onClick={() => setOrders({})}>
                  Đặt lại
               </Button>
            </Layout.Sider>
         </Layout>
      </>
   );
};

export default OrdersAdmin;
