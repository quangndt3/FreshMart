import { Form, Input, Divider, Layout, message } from 'antd';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';

import UploadButton from '../../../components/UploadButton/UploadButton';
import React, { useState } from 'react';
import { uploadImages } from '../../../api/upload';
import BlockForm from '../Product/BlockForm';

import { useAddCategoryMutation } from '../../../services/cate.service';

import HeadForm from '../../../components/HeadForm/HeadForm';
import { ICategories } from '../../../interfaces/category';

import Loading from '../../../components/Loading/Loading';
import { useClearTokenMutation } from '../../../services/auth.service';
import { deleteTokenAndUser } from '../../../slices/authSlice';
import { setItem } from '../../../slices/cartSlice';
import { useDispatch } from 'react-redux';

const AddCategory = () => {
   const [loading, setLoading] = useState<boolean>(false);
   const [files, setFiles] = useState<File[]>([]);
   const [categoryName, setCategoryName] = useState<string>('');
   const [form] = Form.useForm<ICategories>();
   const navigate = useNavigate();
   const [clearToken] = useClearTokenMutation();
   const dispatch = useDispatch()
 const onHandleLogout = () => {
      dispatch(deleteTokenAndUser());
      dispatch(setItem());
      clearToken();
      navigate('/login');
   };
   const handleGetFiles = (files: File[]) => {
      form.setFieldValue('image', files);
      setFiles(files);
   };
   const [handleAddCategory, { error }] = useAddCategoryMutation();

   const handleSubmit = async () => {
      try {
         setLoading(true);
         const {
            data: { body }
         } = await uploadImages(files);
         if (!body.data) {
            message.error('Tải ảnh lỗi');
            return;
         }
         form.setFieldValue('image', body.data[0]);
         form.setFieldValue('cateName', categoryName);
         const newFormData = form.getFieldsValue(true);
         await handleAddCategory(newFormData).unwrap().then(()=>{
            navigate('/manage/categories');
         }).catch((err) => {
            if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
               onHandleLogout()
            } 
         });
         if (error) {
            console.log(error);
            return;
         }
         setLoading(false);

      } catch (error) {
         setLoading(false);
         console.log(error);
      }
   };

   if (loading) return <Loading sreenSize='lg' />;
   return (
      <>
         <Helmet>
            <title>Thêm danh mục</title>
         </Helmet>

         <Layout style={{ minHeight: '100vh', display: 'flex', position: 'relative', width: '100%' }}>
            {/* <div className='flex-1 flex justify-center items-center flex-col mt-10 w-[100%] '> */}

            <Form
               form={form}
               onFinish={handleSubmit}
               className='mt-10 flex justify-center items-center flex-col w-[100%] '
            >
               <div className='w-[100%]'>
                  <HeadForm
                     placeHolder='Danh mục không tên'
                     linkBack='/manage/categories'
                     changeValue={(value) => setCategoryName(value)}
                     initValue={categoryName}
                  />
               </div>

               <div className='w-full   flex justify-center   mt-10'>
                  <BlockForm title='Thông tin danh mục' className='w-full'>
                     <>
                        <Form.Item name={'cateName'}>
                           <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                              Tên danh mục
                           </label>

                           <Input
                              placeholder='Thêm tên danh mục'
                              value={categoryName}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategoryName(e.target.value)}
                           ></Input>
                        </Form.Item>

                        <Form.Item
                           name='image'
                           hasFeedback
                           rules={[{ required: true, message: 'Vui lòng tải ảnh lên !' }]}
                        >
                           <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                              Hình ảnh
                           </label>
                           <UploadButton maxCount={1} multiple listStyle='picture-card' getListFiles={handleGetFiles} />
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

export default AddCategory;
