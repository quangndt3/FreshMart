import { Divider, Form, Input, Layout, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import BlockForm from '../Product/BlockForm';
import HeadForm from '../../../components/HeadForm/HeadForm';
import { Helmet } from 'react-helmet';
import { useGetOneOriginByIdQuery, useUpdateOriginMutation } from '../../../services/origin.service';

import { IOrigin } from '../../../interfaces/origin';
import Loading from '../../../components/Loading/Loading';
import { useClearTokenMutation } from '../../../services/auth.service';
import { deleteTokenAndUser } from '../../../slices/authSlice';
import { setItem } from '../../../slices/cartSlice';
import { useDispatch } from 'react-redux';

const UpdateOrigin = () => {
   const [loading, setLoading] = useState<boolean>(false);
   const { id } = useParams();
   const [form] = Form.useForm<IOrigin>();
   const { data } = useGetOneOriginByIdQuery(id!);

   const navigate = useNavigate();
   const [OriginName, setOriginName] = useState<string>('');
   const [handleUpdateOrigin] = useUpdateOriginMutation();
   const [clearToken] = useClearTokenMutation();
   const dispatch = useDispatch()
 const onHandleLogout = () => {
      dispatch(deleteTokenAndUser());
      dispatch(setItem());
      clearToken();
      navigate('/login');
   };
   useEffect(
      () => {
         if (!data) {
            return;
         }
         setOriginName(data.body.data.name!);

         const newbody = {
            ...data?.body.data,
            _id: undefined,
            createdAt: undefined,
            updatedAt: undefined
         };
         form.setFieldsValue({ ...newbody });
      },

      // eslint-disable-next-line react-hooks/exhaustive-deps
      [id, data]
   );

   const handleSubmit = async () => {
      setLoading(true);
      try {
         const newFormData = form.getFieldsValue(true);

         await handleUpdateOrigin({ id: id!, ...newFormData, name: OriginName }).unwrap().then(() => {
            setLoading(false);
            message.success('Cập nhật thành công')
            navigate('/manage/origin');
         }).catch(error => {
            if(error.data.message=="Refresh Token is invalid" || error.data.message== "Refresh Token is expired ! Login again please !"){
               onHandleLogout()
            }
            message.error(error.data.message);
            setLoading(false)
         });
      } catch (error) {
         setLoading(false);
         console.log(error);
      }
   };

   if (loading) return <Loading sreenSize='lg' />;
   return (
      <>
         <Helmet>
            <title>Chỉnh sửa nguồn gốc</title>
         </Helmet>

         <Layout style={{ minHeight: '100vh', display: 'flex', position: 'relative', width: '100%' }}>
            {/* <div className='flex-1 flex justify-center items-center flex-col mt-10 w-[100%] '> */}

            <Form
               form={form}
               onFinish={handleSubmit}
               className='mt-10 flex justify-center items-center flex-col w-[100%] '
            >
               <div className=' flex justify-between  w-[90%] '>
                  <HeadForm
                     placeHolder='Danh mục không tên'
                     linkBack='/manage/origin'
                     changeValue={(value) => setOriginName(value)}
                     initValue={OriginName}
                  />
               </div>

               <div className='w-[90%]     mt-10'>
                  <BlockForm title='Thông tin danh mục'>
                     <>
                        <Form.Item name={'name'}>
                           <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                              Nguồn gốc
                           </label>

                           <Input
                              placeholder='Thêm tên danh mục'
                              value={OriginName}
                              //   disabled={categoryType === 'default' ? true : false}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOriginName(e.target.value)}
                           ></Input>
                        </Form.Item>
                     </>
                  </BlockForm>
               </div>

               <Divider />
               <div className='flex justify-end  gap-5 w-[90%]'>
                  <Link to={'/manage/categories'}>
                     <button
                        type='button'
                        className='border-[1px] border-[#80b235] text-greenPrimary py-2 px-5 rounded-xl font-semibold text-[1rem] hover:bg-greenPrimary duration-200 hover:text-white'
                     >
                        Hủy
                     </button>
                  </Link>
                  <Form.Item className='flex flex-col  !mb-0'>
                     <button
                        className='!bg-greenPrimary !text-white py-2 px-5 rounded-xl font-semibold text-[1rem]'
                        type='submit'
                     >
                        Lưu
                     </button>
                  </Form.Item>
               </div>
            </Form>
            {/* </div> */}
         </Layout>
      </>
   );
};

export default UpdateOrigin;
