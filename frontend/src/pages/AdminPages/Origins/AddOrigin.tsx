import { Divider, Form, Input, Layout, message } from 'antd'
import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import HeadForm from '../../../components/HeadForm/HeadForm'
import BlockForm from '../Product/BlockForm'
import { Link, useNavigate } from 'react-router-dom'
import { IOrigin } from '../../../interfaces/origin'
import { useAddOriginMutation } from '../../../services/origin.service'
import Loading from '../../../components/Loading/Loading'
import { useClearTokenMutation } from '../../../services/auth.service'
import { deleteTokenAndUser } from '../../../slices/authSlice'
import { setItem } from '../../../slices/cartSlice'
import { useDispatch } from 'react-redux'

const AddOrigin = () => {
   const [loading, setLoading] = useState<boolean>(false);
   const [form] = Form.useForm<IOrigin>();
   const navigate = useNavigate();
   const [OriginName, setOriginName] = useState<string>('');
   const [handleAddCategory] = useAddOriginMutation();
   const [clearToken] = useClearTokenMutation();
   const dispatch = useDispatch()
   const onHandleLogout = () => {
        dispatch(deleteTokenAndUser());
        dispatch(setItem());
        clearToken();
        navigate('/login');
     };
   const handleSubmit = async () => {
      try {
         setLoading(true);
         form.setFieldValue('name', OriginName);
         const newFormData = form.getFieldsValue(true);
         await handleAddCategory(newFormData).unwrap().then(() => {
            setLoading(false);
            message.success('Thêm thành công')
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
            <title>Thêm nguồn gốc</title>
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
                     placeHolder='Nguồn gốc '
                     linkBack='/manage/origin'
                     changeValue={(value) => setOriginName(value)}
                     initValue={OriginName}
                  />
               </div>

               <div className='w-full   flex justify-center   mt-10'>
                  <BlockForm title='Thông tin nguồn gốc' className='w-full'>
                     <>
                        <Form.Item name={'name'}>
                           <label className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'>
                              Nguồn gốc
                           </label>

                           <Input
                              placeholder='Thêm nguồn gốc'
                              value={OriginName}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOriginName(e.target.value)}
                           ></Input>
                        </Form.Item>


                     </>
                  </BlockForm>
               </div>
               <Divider />
               <div className='flex justify-end  gap-5 w-[90%]'>
                  <Link to={'/manage/origin'}>
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
   )
}

export default AddOrigin