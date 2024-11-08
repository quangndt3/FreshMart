import { PlusCircleOutlined } from '@ant-design/icons';
import { Card, Layout, Popconfirm, Popover } from 'antd';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { useGetAllOriginQuery, useRemoveOriginByIdMutation } from '../../../services/origin.service';
import { useClearTokenMutation } from '../../../services/auth.service';
import { deleteTokenAndUser } from '../../../slices/authSlice';
import { setItem } from '../../../slices/cartSlice';
import { useDispatch } from 'react-redux';
const OriginAdmin = () => {
   const { data, isLoading } = useGetAllOriginQuery();
   const [removeCategory] = useRemoveOriginByIdMutation();
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const [clearToken] = useClearTokenMutation();
   const dispatch = useDispatch()
   const navigate  = useNavigate()
   const onHandleLogout = () => {
        dispatch(deleteTokenAndUser());
        dispatch(setItem());
        clearToken();
        navigate('/login');
     };
   const handleDelete = (id: any) => {
      removeCategory(id).unwrap().catch(err=>{
         if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
            onHandleLogout()
         } 
      });
   };
   return (
      <>
         <Helmet>
            <title>Nguồn gốc sản phẩm</title>
         </Helmet>

         <Layout style={{ minHeight: '100vh', display: 'flex', position: 'relative', width: '100%' }}>
            <div className='flex-1 flex justify-center items-center flex-col mt-10 w-[100%]'>
               <div className='flex justify-between items-center w-[90%]'>
                  <h1 className='text-3xl font-semibold text-[rgba(0,0,0,0.7)]'>Nguồn gốc</h1>

                  <Link to='/manage/add-origin'>
                     <button className='bg-greenPrimary duration-100 hover:bg-greenPri600 text-white text-lg p-2 font-semibold rounded-lg flex justify-start items-center gap-2'>
                        <PlusCircleOutlined style={{ color: 'white' }} />
                        Thêm nguồn gốc
                     </button>
                  </Link>
               </div>

               <div className='w-[90%] min-h-[100vh] bg-white rounded-lg mt-5'>
                  <div className='flex gap-7 flex-wrap justify-start' style={{ margin: 30 }}>
                     {isLoading
                        ? 'loading'
                        : data?.body.data.map((origin, index) => {
                             return (
                                <Card
                                   className={`w-[200px] h-[100px] lg:w-[250px] lg:h-[100px]  bg-cover max-w-sm bg-slate-50 text-black border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700`}
                                   key={index}
                                >
                                   <div className='flex justify-between '>
                                      <p
                                         style={{
                                            WebkitLineClamp: '1',
                                            wordBreak: 'break-word',
                                            overflowWrap: 'break-word',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical'
                                         }}
                                         className='text-lg font-medium max-w-[50%] dark:text-white mb-5'
                                      >
                                         {origin?.name}
                                      </p>
                                      <div className='relative '>
                                         <Popover
                                            content={() => (
                                               <div
                                                  id='dropdown'
                                                  className=' text-base list-none bg-white divide-y divide-gray-100 rounded-lg  w-44 dark:bg-gray-700'
                                               >
                                                  <ul className='py-2' aria-labelledby='dropdownButton'>
                                                     <li>
                                                        <Link to={'/manage/update-origin/' + origin._id}>
                                                           <button
                                                              type='button'
                                                              className='focus:outline-none text-black  focus:ring-4  font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'
                                                           >
                                                              Chỉnh sửa
                                                           </button>
                                                        </Link>
                                                     </li>
                                                     <li>
                                                        <Popconfirm
                                                           className={``}
                                                           description='Bạn chắc chắn muốn xóa danh mục chứ?'
                                                           okText='Đồng ý'
                                                           cancelText='Hủy bỏ'
                                                           title='Bạn có muốn xóa?'
                                                           onConfirm={() => handleDelete(origin._id)}
                                                        >
                                                           <button
                                                              type='button'
                                                              className='focus:outline-none text-black  focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                                                           >
                                                              Xóa
                                                           </button>
                                                        </Popconfirm>
                                                     </li>
                                                  </ul>
                                               </div>
                                            )}
                                            trigger='click'
                                         >
                                            <button
                                               id='dropdownButton'
                                               data-dropdown-toggle='dropdown'
                                               className='inline-block text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-1.5'
                                               type='button'
                                            >
                                               {/* <span className="sr-only">Open dropdown</span> */}
                                               <svg
                                                  className='w-5 h-5'
                                                  aria-hidden='true'
                                                  xmlns='http://www.w3.org/2000/svg'
                                                  fill='currentColor'
                                                  viewBox='0 0 16 3'
                                               >
                                                  <path d='M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z' />
                                               </svg>
                                            </button>
                                         </Popover>
                                      </div>
                                   </div>
                                </Card>
                             );
                          })}
                  </div>
               </div>
            </div>
         </Layout>
      </>
   );
};

export default OriginAdmin;
