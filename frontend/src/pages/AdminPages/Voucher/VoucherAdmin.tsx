import { PlusCircleOutlined } from '@ant-design/icons';
import { Layout, Popconfirm, Table, Tag, Tooltip } from 'antd';
import Column from 'antd/es/table/Column';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { useGetAllVoucherQuery, useRemoveVoucherMutation } from '../../../services/voucher.service';
import { voucherData } from '../../../constants/configTableAntd';
import EraserIcon from '../../../components/Icons/EraserIcon';
import PencilIcon from '../../../components/Icons/PencilIcon';
import { IVoucher } from '../../../slices/voucherSlice';
import { formatStringToDate } from '../../../helper';

const VoucherAdmin = () => {
   const { data, isLoading } = useGetAllVoucherQuery(undefined, { refetchOnMountOrArgChange: true });
   const vouchers = data && voucherData(data);

   const [handleRemoveVoucher] = useRemoveVoucherMutation();
   const getConfirmResultToDelete = async (result: boolean, _id: string) => {
      if (!result) {
         return;
      }
      try {
         await handleRemoveVoucher(_id);
      } catch (error) {
         console.log(error);
      }
   };
   return (
      <>
         <Helmet>
            <title>Mã khuyến mãi</title>
         </Helmet>

         <Layout style={{ minHeight: '100vh', display: 'flex', position: 'relative', width: '100%' }}>
            <div className='flex-1 flex justify-center items-center flex-col mt-10 w-[100%]'>
               <div className='flex justify-between items-center w-[90%]'>
                  <h1 className='text-3xl font-semibold text-[rgba(0,0,0,0.7)]'>Mã khuyến mãi</h1>

                  <Link to='/manage/add-voucher'>
                     <button className='bg-greenPrimary duration-100 hover:bg-greenPri600 text-white text-lg p-2 font-semibold rounded-lg flex justify-start items-center gap-2'>
                        <PlusCircleOutlined style={{ color: 'white' }} />
                        Mã khuyến mãi mới
                     </button>
                  </Link>
               </div>

               <div className='w-[90%] min-h-[100vh] bg-white rounded-lg mt-5'>
                  <div className='flex gap-7 flex-wrap justify-center' style={{ margin: 30 }}>
                     <Table
                        dataSource={vouchers}
                        pagination={{ pageSize: 5 }}
                        scroll={{ y: 800, x: 1000 }}
                        loading={isLoading}
                     >
                        <Column
                           title='Mã giảm giá'
                           dataIndex='code'
                           key='code'
                           width={200}
                           render={(value, record: IVoucher) => (
                              <>
                                 <span>
                                    {value} <br /> {!record.status && <Tag color='red'>Ngừng sử dụng</Tag>}
                                 </span>
                                 <span>
                                    {!record.isValidDateStart && <Tag color='orange'>Chưa bắt đầu</Tag>}
                                 </span>
                                 <span>
                                    {!record.isValidDateEnd && <Tag color='red'>Đã hết hạn</Tag>}
                                 </span>
                                 <span>
                                    {(record.isValidDateEnd && record.isValidDateStart && record.status) && <Tag color='green'>Đang hoạt động</Tag>}
                                 </span>
                              </>

                           )}
                        />

                        <Column title='Giảm bớt (%)' dataIndex='percent' key='percent' width={80} />
                        <Column title='Giảm tối đa (VNĐ)' dataIndex='maxReduce' key='maxReduce' width={80}
                         render={(maxReduce) => <span className='w-[3rem] h-[3rem]'>{maxReduce.toLocaleString("vi-VN")}₫</span>}
                        />

                        <Column
                           title='Số lượng'
                           dataIndex='quantity'
                           key='quantity'
                           width={80}
                           render={(stock) => <span className='w-[3rem] h-[3rem]'>{stock || 0}</span>}
                        />
                        <Column
                           title='Ngày bắt đầu'
                           dataIndex='dateStart'
                           key='dateStart'
                           width={80}
                           render={(date) => formatStringToDate(date)}
                        />
                        <Column
                           title='Ngày hết hạn'
                           dataIndex='dateEnd'
                           key='dateEnd'
                           width={80}
                           render={(date) => formatStringToDate(date)}
                        />
                        <Column title='Tiêu đề' dataIndex='title' key='title' width={80} />
                        <Column
                           fixed='right'
                           width={100}
                           title='Chức năng '
                           key='_id'
                           dataIndex='_id'
                           render={(_id) => (
                              <div>
                                 <Tooltip title='Sửa mã giảm giá' placement='bottom'>
                                    <Link to={'/manage/update-voucher/' + _id}>
                                       <button className='p-2 rounded-full bg-white w-10 h-10 shadow-md hover:w-11 hover:h-11 duration-100 '>
                                          <PencilIcon className='text-greenPrimary w-4' />
                                       </button>
                                    </Link>
                                 </Tooltip>{' '}
                                 {/* <button onClick={() => getConfirmResultToDelete(result,_id)}>Xóa</button> */}
                                 <Tooltip title='Xóa mã giảm giá' placement='bottom'>
                                    <Popconfirm
                                       title='Bạn có chắc chắn xóa không ?'
                                       onConfirm={() => {
                                          getConfirmResultToDelete(true, _id);
                                       }}
                                       okButtonProps={{ className: 'bg-blue-500' }}
                                    >
                                       <button className='p-2 rounded-full bg-white w-10 h-10 shadow-md hover:w-11 hover:h-11 duration-100 '>
                                          <EraserIcon className='text-greenPrimary w-4' />
                                       </button>
                                    </Popconfirm>
                                 </Tooltip>
                              </div>
                           )}
                        />
                     </Table>
                  </div>
               </div>
            </div>
         </Layout>
      </>
   );
};

export default VoucherAdmin;
