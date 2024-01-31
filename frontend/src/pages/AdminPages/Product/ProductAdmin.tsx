/* eslint-disable @typescript-eslint/no-explicit-any */
import { SearchOutlined, PlusCircleOutlined, CloseOutlined } from '@ant-design/icons';
import Table from 'antd/es/table';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { ProductDataType, productData } from '../../../constants/configTableAntd';
import { useGetAllExpandQuery, useRemoveProductMutation } from '../../../services/product.service';
import Column from 'antd/es/table/Column';
import ActionTable from '../../../components/ActionTable/ActionTable';
import FilterIcon from '../../../components/Icons/FilterIcon';
import { Button, Layout, Radio, Tag, Tooltip, theme } from 'antd';
import { adminSocket } from '../../../config/socket';
import { IProduct } from '../../../interfaces/product';
import { WILL_EXPIRE } from '../../../constants/statusExpireProduct';
import useDebounce from '../../../hooks/useDebounce';
import { useClearTokenMutation } from '../../../services/auth.service';
import { deleteTokenAndUser } from '../../../slices/authSlice';
import { setItem } from '../../../slices/cartSlice';
import { useDispatch } from 'react-redux';
const ProductAdmin = () => {
   const [valueSearch, setValueSearch] = useState<string>('');
   const [collapsed, setCollapsed] = useState(true);
   const [filterProducts, setFilterProducts] = useState<any>({});
   // console.log(filterProducts);
   const [clearToken] = useClearTokenMutation();
   const navigate = useNavigate()
   const dispatch = useDispatch()
 const onHandleLogout = () => {
      dispatch(deleteTokenAndUser());
      dispatch(setItem());
      clearToken();
      navigate('/login');
   };
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const [expiredProducts, setExpiredProducts] = useState<any>([]);
   const searchDebounce = useDebounce(valueSearch, 500);
   const { data, isLoading } = useGetAllExpandQuery(
      { ...filterProducts, expand: true, q: searchDebounce },
      { refetchOnMountOrArgChange: true }
   );
   const [handleRemoveProduct] = useRemoveProductMutation();
   const products = data && productData(data);
   const lastEventId = useRef<null | string>(null);
   const getConfirmResultToDelete = async (result: boolean, id: string) => {
      if (!result) {
         return;
      }
      try {
         await handleRemoveProduct(id).unwrap().catch(err=>{
            if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
               onHandleLogout()
            } 
         });
      } catch (error) {
         console.log(error);
      }
   };
   const {
      token: { colorBgContainer }
   } = theme.useToken();
   useEffect(() => {
      if (!data) return;
      const expireProductInDB = data.body.data.map((product) => {
         if (product?.shipments[0]?.willExpire === WILL_EXPIRE) return product;
      });
      const newExpireProducts: any[] = [];
      expireProductInDB.forEach((product) => {
         if (!expiredProducts.includes(product!)) {
            newExpireProducts.push({ ...product, productId: product?._id }!);
         }
      });
      setExpiredProducts((prev: any) => [...prev, ...newExpireProducts]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [data]);

   useEffect(() => {
      adminSocket.on('expireProduct', (data) => {
         if (data.eventId !== lastEventId.current) {
            setExpiredProducts((prev: IProduct[]) => [...prev, data.response]);
            lastEventId.current = data.eventId;
         } else {
            console.log('not run');
         }
      });
   }, [data]);

   const checkExpireProduct = useMemo(
      () => (idProduct: string) => {
         // return true;
         //đợi sắp đến ngày hết hạn hoặc là cái socket lâu quá nên comment lại lúc khác mở
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         return !!expiredProducts.find((product: any) => product?.productId === idProduct);
      },
      [expiredProducts]
   );
   return (
      <>
         <Helmet>
            <title>Sản phẩm</title>
         </Helmet>
         <Layout
            style={{ minHeight: '100vh', display: 'flex', position: 'relative', width: '100%' }}
            className='!hidden md:!flex'
         >
            <div className='flex-1 flex lg:justify-center items-center flex-col mt-10 lg:w-[90%] w-full'>
               <div className='flex justify-between items-center w-[90%]'>
                  <h1 className='text-3xl font-semibold text-[rgba(0,0,0,0.7)]'>Sản phẩm</h1>
                  <Link to='/manage/add-product'>
                     <button className='bg-greenPrimary duration-100 hover:bg-greenPri600 text-white text-lg p-2 font-semibold rounded-lg flex justify-start items-center gap-2'>
                        <PlusCircleOutlined style={{ color: 'white' }} />
                        Sản phẩm mới
                     </button>
                  </Link>
               </div>
               <div className='lg:w-[90%] min-h-[60vh] bg-white rounded-lg mt-5 w-[100%]'>
                  <header className='flex justify-start gap-4 items-center px-5 py-5'>
                     <div className='flex justify-between items-center max-w-[50%] gap-2 rounded-[100px] border-[1px] border-[#80b235] p-2'>
                        <SearchOutlined style={{ fontSize: '1rem', color: '#80b235' }} />
                        <input
                           type='text'
                           value={valueSearch}
                           onChange={(e) => setValueSearch(e.target.value)}
                           className='text-sm outline-none border-none w-full flex-1'
                           placeholder='Tìm kiếm sản phẩm'
                        />
                        {valueSearch !== '' && (
                           <button
                              className='flex justify-center items-center rounded-full text-greenPrimary bg-[#80b23552] w-4 h-4  pb-1'
                              onClick={() => setValueSearch('')}
                           >
                              x
                           </button>
                        )}
                     </div>
                     <button
                        onClick={() => setCollapsed(false)}
                        className='border-[1px] border-[rgba(0,0,0,0.2)] rounded-xl p-2 text-greenPrimary flex items-center gap-1 hover:-translate-y-1 duration-100'
                     >
                        <FilterIcon className='text-greenPrimary' />
                        Lọc
                     </button>
                  </header>
                  <Table
                     dataSource={products}
                     pagination={{ pageSize: 10 }}
                     scroll={{ y: 500, x: 1400 }}
                     loading={isLoading}
                     rowClassName={(record) => {
                        if (!record.stock || record.expDate.includes('NaN')) {
                           return 'bg-red-100';
                        }
                        return '';
                     }}
                  >
                     <Column
                        title='Ảnh sản phẩm'
                        dataIndex='image'
                        key='image'
                        width={20}
                        render={(image) => <img src={image} className='w-[3rem] h-[3rem]' />}
                     />
                     <Column
                        title='Trạng thái bán hàng'
                        dataIndex='isSale'
                        key='isSale'
                        width={30}
                        render={(isSale, record: IProduct) => {
                           if (record?.shipments?.length === 0) return <Tag color='red'>Hết hàng</Tag>;
                           if (isSale) return <Tag color='purple'>Thanh lý</Tag>;
                           return <Tag color='green'>Bình thường</Tag>;
                        }}
                     />
                     <Column
                        title='Tên'
                        dataIndex='productName'
                        key='productName'
                        width={30}
                        render={(name, product: IProduct & { stock: number, totalWeight: number }) => (
                           <div className='flex flex-col gap-2 items-start'>
                              <span>{name}</span>
                              <span className='flex flex-col gap-1 items-center'>
                                 {!product.isSale &&
                                    product.shipments.length > 0 &&
                                    checkExpireProduct(product?._id) && (
                                       <Tooltip title='Lô hàng sản phẩm hiện tại sắp hết hạn, bạn nên thanh lý sớm lô hàng này ->'>
                                          <Tag color='orange'>Sắp hết hạn</Tag>
                                       </Tooltip>
                                    )}
                                 {!product.isSale && product.totalWeight <= 30 && product.totalWeight > 0  && (
                                    <Tooltip title='Lô hàng sản phẩm hiện tại sắp hết hàng'>
                                       <Tag color='red'>Sắp hết hàng</Tag>
                                    </Tooltip>
                                 )}
                              </span>
                           </div>
                        )}
                     />
                     <Column title='Giá (VND)' dataIndex='price' key='price' width={20}
                      render={(price) => <span className='w-[3rem] h-[3rem]'>{price.toLocaleString("vi-VN")}₫</span>}
                     />
                     <Column title='Khuyến mãi (%)' dataIndex='discount' key='discount' width={20}
                      render={(discount) => <span className='w-[3rem] h-[3rem]'>{discount}%</span>}
                     />
                     <Column
                        title='Số lượng kho hàng (kg)'
                        dataIndex='stock'
                        key='stock'
                        width={30}
                        render={(stock) => <span className='w-[3rem] h-[3rem]'>{stock || 0}</span>}
                     />
                     <Column
                        title='Hạn sử dụng'
                        dataIndex='expDate'
                        key='expDate'
                        width={40}
                        render={(date) => {
                           return <span className='w-[3rem] h-[3rem]'>{date.includes('NaN') ? 'Hết hàng' : date}</span>;
                        }}
                     />
                     <Column title='Danh mục ' dataIndex='category' key='category' width={30} />
                     <Column
                        fixed='right'
                        width={30}
                        title='Chức năng '
                        key='_id'
                        dataIndex={'_id'}
                        render={(id, record: ProductDataType) => (
                           <ActionTable
                              hasSale={record?.isSale as boolean}
                              isSale={checkExpireProduct(id)}
                              idProduct={id}
                              linkToUpdate={`/manage/products/${id}`}
                              getResultConfirm={getConfirmResultToDelete}
                           />
                        )}
                     />
                  </Table>
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
                     Lọc sản phẩm
                  </p>

                  <h1 className='pb-3'>Trạng thái:</h1>
                  <Radio.Group
                     value={filterProducts?.willExpire == 0 ? 0 : filterProducts?.willExpire || ''}
                     onChange={(e) => setFilterProducts((prev: any) => ({ ...prev, willExpire: e.target.value }))}
                  >
                     <Radio value={0}>Còn hạn</Radio>
                     <Radio value={1}>Sắp hết hạn</Radio>
                     <Radio value={2}>Hết hạn</Radio>
                  </Radio.Group>
                  <h1 className='pt-5 pb-3'>Sale:</h1>
                  <Radio.Group
                     value={filterProducts?.isSale == false ? false : filterProducts?.isSale || ''}
                     onChange={(e) => setFilterProducts((prev: any) => ({ ...prev, isSale: e.target.value }))}
                  >
                     <Radio value={true}>Sale</Radio>
                     <Radio value={false}>Không sale</Radio>
                  </Radio.Group>
               </div>
               <Button className='text-center items-center mt-4 ml-4' onClick={() => setFilterProducts({})}>
                  Đặt lại
               </Button>
            </Layout.Sider>
         </Layout>
      </>
   );
};

export default ProductAdmin;
