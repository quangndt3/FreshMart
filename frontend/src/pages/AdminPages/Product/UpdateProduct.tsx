import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Space, Input, Radio, Divider, UploadFile, Descriptions } from 'antd';
import HeadForm from '../../../components/HeadForm/HeadForm';
import { InputProduct } from '../../../interfaces/product';
import UploadButton from '../../../components/UploadButton/UploadButton';
import BlockForm from './BlockForm';
import TextQuill from '../../../components/TextQuill/TextQuill';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetOneProductQuery, useUpdateProductMutation } from '../../../services/product.service';
import { useGetAllCateQuery } from '../../../services/cate.service';
import { getShipmentData } from '../../../constants/configDescriptionAntd';
import { IShipmentOfProduct } from '../../../interfaces/shipment';
import { uploadImages } from '../../../api/upload';
import Loading from '../../../components/Loading/Loading';
// import { IImage } from '../../../interfaces/image';
import { IOrigin } from '../../../interfaces/origin';
import { getOriginData } from '../../../api/origin';
import { useClearTokenMutation } from '../../../services/auth.service';
import { deleteTokenAndUser } from '../../../slices/authSlice';
import { setItem } from '../../../slices/cartSlice';
import { useDispatch } from 'react-redux';

const UpdateProduct = () => {
   const [form] = Form.useForm<InputProduct>();
   const { id } = useParams();
   const navigate = useNavigate();
   const [files, setFiles] = useState<File[]>([]);
   const [defaultImages, setDefaultImages] = useState<UploadFile[]>([]);
   const [defaultDesc, setDefaultDesc] = useState<string>('');
   const [categoryId, setCategoryId] = useState<string>();
   const [origins, setOrigins] = useState<IOrigin[]>([]);
   const [productName, setProductName] = useState<string>('');
   const [productPrice, setProductPrice] = useState<number>(0);
   const [productDiscount, setProductDiscount] = useState<number>(0);
   const [shipments, setShipments] = useState<IShipmentOfProduct[]>([]);
   // const [currentShipment, setCurrentShipment] = useState<IShipmentOfProduct>();
   const handleGetFiles = (files: File[], public_id: string | undefined) => {
      if (!public_id) {
         form.setFieldValue('images', files);
         setFiles(files);
      } else {
         setDefaultImages(() => defaultImages.filter((img) => img.uid !== public_id));
         form.setFieldValue('images', files);
         setFiles(files);
      }
   };
   const [handleUpdateProduct, { isLoading }] = useUpdateProductMutation();
   const { data } = useGetOneProductQuery(id!, { skip: !id, refetchOnMountOrArgChange: true });
   const { data: categories } = useGetAllCateQuery({}, { refetchOnMountOrArgChange: true });
   useEffect(() => {
      (async () => {
         try {
            const { data } = await getOriginData();
            setOrigins(data.body.data);
         } catch (error) {
            console.log(error);
         }
      })();
   }, []);
   const dispatch = useDispatch()
   const [clearToken] = useClearTokenMutation();
   const onHandleLogout = () => {
        dispatch(deleteTokenAndUser());
        dispatch(setItem());
        clearToken();
        navigate('/login');
     };
   useEffect(() => {
      const formatedFiles: UploadFile[] = [] as UploadFile[];
      data?.body.data.images.forEach((img) => {
         const file: UploadFile = { uid: img.public_id, url: img.url, name: 'images', status: 'done' };
         formatedFiles.push(file);
      });
      setDefaultImages(formatedFiles);
      const formatedCategories = data?.body.data.categoryId._id;
      setCategoryId(formatedCategories);
      setProductName(data?.body.data.productName as string);
      setDefaultDesc(data?.body.data.desc as string);
      setProductPrice(data ? data.body.data.price! : 0);
      // setCurrentShipment(data?.body.data.shipments[0]);
      setShipments(data ? data.body.data.shipments! : []);
      const newBody = {
         ...data?.body.data,
         _id: undefined,
         sold: undefined,
         originId: data?.body.data.originId?._id,
         comments: undefined,
         createdAt: undefined,
         updatedAt: undefined,
         categoryId: formatedCategories,
         images: data?.body.data.images.map((image: { url: string; public_id: string }) => ({
            url: image.url,
            public_id: image.public_id
         }))
      };
      form.setFieldsValue({
         ...newBody
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [categories, data, form]);
   const displayShipment = (currentShipment: IShipmentOfProduct, index: number) => {
      if (data?.body.data.shipments.length === 0 || !currentShipment) {
         return <h2>Chưa có lô hàng sử dụng</h2>;
      }
      const dataShipment = getShipmentData(currentShipment, index);
      return <Descriptions title={'Thông tin lô hàng ' + (index + 1)} items={dataShipment} bordered key={index} />;
   };
   const handleSubmit = async () => {
      try {
         const filesToUpload: File[] = files.filter((file) => file !== undefined);
         if (filesToUpload.length > 0) {
            const {
               data: { body }
            } = await uploadImages(filesToUpload);
            const newImages = defaultImages.map((image) => ({ url: image.url, public_id: image.uid }));
            form.setFieldValue('images', [...body.data, ...newImages]);
         }
         const newFormData = form.getFieldsValue(true);
         newFormData.shipments = undefined;
         await handleUpdateProduct({ idProduct: id!, ...{ ...newFormData, productName } }).unwrap().then(res=>{
            res
            navigate('/manage/products');
         })
         .catch((error) => {
            if(error.data.message=="Refresh Token is invalid" || error.data.message== "Refresh Token is expired ! Login again please !"){
                  onHandleLogout()
                  return
               } 
         });  
      } catch (error) {
         console.log(error);
      }
   };
   if (isLoading) return <Loading sreenSize='lg' />;
   return (
      <div className=''>
         <Helmet>
            <title>Cập nhật sản phẩm</title>
         </Helmet>
         <Form className='w-[100%] mt-20 pb-10' form={form} onFinish={handleSubmit} layout='vertical'>
            <HeadForm
               placeHolder='Sản phẩm không tên'
               linkBack='/manage/products'
               changeValue={(value) => setProductName(value)}
               initValue={productName}
            />
            <div className='w-full mt-5 flex flex-wrap gap-5'>
               <div className='xl:min-w-[800px] flex flex-col gap-5 w-full'>
                  <BlockForm title='Hình ảnh sản phẩm'>
                     <Form.Item<InputProduct>
                        name='images'
                        hasFeedback
                        rules={[{ required: true, message: 'Vui lòng tải ảnh lên !' }]}
                     >
                        <UploadButton
                           maxCount={4}
                           multiple
                           listStyle='picture-card'
                           getListFiles={handleGetFiles}
                           defaultFiles={defaultImages}
                        />
                     </Form.Item>
                  </BlockForm>
                  <BlockForm title='Thông tin sản phẩm'>
                     <Space size={'middle'} direction='vertical' className='w-full'>
                        <p className='text-xl font-thin tracking-wider'>Thông tin cơ bản</p>
                        <Space direction='horizontal' className='w-full'>
                           <Form.Item
                              className='w-[500px]'
                              name={'productName'}
                              label={<p className='text-lg font-semibold'>Tên sản phẩm</p>}
                              rules={[{ required: true, message: 'Vui lòng điền tên sản phẩm !' }]}
                              hasFeedback
                           >
                              <Input
                                 placeholder='Thêm tên sản phẩm'
                                 className='w-full p-2'
                                 value={productName}
                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.target.value)}
                              />
                           </Form.Item>
                        </Space>
                        <Form.Item
                           name={'desc'}
                           label={<p className='text-lg font-semibold'>Mô tả</p>}
                           rules={[{ required: true, message: 'Vui lòng điền mô tả sản phẩm !' }]}
                        >
                           <TextQuill
                              defaultValue={defaultDesc}
                              getValue={(value) => form.setFieldValue('desc', value)}
                           />
                        </Form.Item>
                     </Space>
                  </BlockForm>
                  <BlockForm title='Chính sách giá'>
                     <Space direction='vertical' className='w-full'>
                        <div className='w-full flex justify-start items-center gap-2'>
                           <Form.Item
                              className='w-full'
                              name={'price'}
                              label={<p className='text-lg font-semibold'>Giá bán</p>}
                              hasFeedback
                           >
                              <Input
                                 type='number'
                                 placeholder='Thêm giá bán sản phẩm'
                                 className='w-1/2 p-2'
                                 max={100000000}
                                 min={0}
                                 prefix={
                                    <span className='decoration-black underline absolute right-10 z-10'>vnd/kg</span>
                                 }
                                 onChange={(e) => setProductPrice(Number(e.target.value))}
                              />
                           </Form.Item>

                           <div className='w-full'>
                              <p className=''>Giá bán thực tế:</p>
                              <Input
                                 type='number'
                                 className='w-1/2 p-2'
                                 value={productPrice}
                                 disabled
                                 prefix={
                                    <span className='decoration-black underline absolute right-10 z-10'>vnd/kg</span>
                                 }
                              />
                           </div>
                        </div>
                        <Form.Item
                           name={'discount'}
                           label={<p className='text-lg font-semibold'>Khuyến mãi</p>}
                           hasFeedback
                        >
                           <Input
                              type='number'
                              placeholder='Thêm khuyến mãi sản phẩm'
                              className='w-1/2 p-2'
                              max={100}
                              min={0}
                              prefix={<span className='decoration-black underline absolute right-10 z-10'>%</span>}
                              value={productDiscount}
                              onChange={(e) => {
                                 setProductDiscount(Number(e.target.value));
                                 setProductPrice(
                                    Number(form.getFieldValue('price')) -
                                       (Number(form.getFieldValue('price')) * Number(e.target.value)) / 100
                                 );
                              }}
                           />
                        </Form.Item>
                     </Space>
                  </BlockForm>
               </div>
               <div className='flex flex-col w-full gap-5'>
                  <BlockForm title='Danh mục' className='min-w-[500px] w-full'>
                     <Form.Item<InputProduct>
                        name='categoryId'
                        hasFeedback
                        rules={[{ required: true, message: 'Hãy chọn danh mục !' }]}
                     >
                        <Radio.Group
                           onChange={(e) => {
                              setCategoryId(e.target.value);
                              form.setFieldValue('categoryId', e.target.value);
                           }}
                           value={categoryId}
                           className='flex flex-col gap-2 items-start'
                        >
                           {categories?.body.data.map((cate) => (
                              <Radio name='categoryId' value={cate._id} className='!text-lg' key={cate._id}>
                                 {cate.cateName}
                              </Radio>
                           ))}
                        </Radio.Group>
                     </Form.Item>
                  </BlockForm>
                  <BlockForm title='Nguồn gốc' className='min-w-[500px]'>
                     <Form.Item<InputProduct>
                        name='originId'
                        hasFeedback
                        rules={[{ required: true, message: 'Hãy chọn nguồn gốc sản phẩm !' }]}
                     >
                        <Radio.Group
                           onChange={(e) => {
                              setCategoryId(e.target.value);
                              form.setFieldValue('originId', e.target.value);
                           }}
                           className='flex flex-col gap-2 items-start'
                        >
                           {origins.map((or) => (
                              <Radio name='originId' value={or._id} className='!text-lg' key={or._id}>
                                 {or.name}
                              </Radio>
                           ))}
                        </Radio.Group>
                     </Form.Item>
                  </BlockForm>
                  <BlockForm title='Lô hàng' className='min-w-[500px]'>
                     <div className={shipments.length > 0 ? 'grid grid-cols-2 gap-5' : ' '}>
                        {shipments.length > 0 ? (
                           shipments.map((shipment, index: number) => displayShipment(shipment, index))
                        ) : (
                           <h1 className='text-center py-5 '> Chưa có lô hàng </h1>
                        )}
                     </div>
                  </BlockForm>
               </div>
            </div>
            <Divider />
            <div className='flex justify-end items-center gap-5 pb-[50px]'>
               <Link to={'/manage/products'}>
                  <button
                     type='button'
                     className='border-[1px] border-[#80b235] text-greenPrimary py-2 px-5 rounded-xl font-semibold text-[1rem] hover:bg-greenPrimary duration-200 hover:text-white'
                  >
                     Hủy
                  </button>
               </Link>
               <Form.Item className='flex flex-col items-center !mb-0'>
                  <button
                     className='!bg-greenPrimary !text-white py-2 px-5 rounded-xl font-semibold text-[1rem]'
                     type='submit'
                  >
                     Lưu
                  </button>
               </Form.Item>
            </div>
         </Form>
      </div>
   );
};

export default UpdateProduct;
