import { useState } from 'react';
import { Modal, Popconfirm, Tooltip, notification } from 'antd';
import { Link } from 'react-router-dom';
import PencilIcon from '../Icons/PencilIcon';
import EraserIcon from '../Icons/EraserIcon';
import { MdOutlineDiscount } from 'react-icons/md';
import FormCreateSaleProduct from '../../pages/AdminPages/components/FormCreateSaleProduct';
import { useCreateSaleProductMutation } from '../../services/product.service';
import { InputSaleProduct } from '../../interfaces/product';
import Loading from '../Loading/Loading';
type Props = {
   idProduct: string;
   linkToUpdate: string;
   getResultConfirm: (result: boolean, idProduct: string) => void;
   isSale: boolean;
   hasSale: boolean;
};

const ActionTable = ({ linkToUpdate, getResultConfirm, idProduct, isSale, hasSale }: Props) => {
   const [open, setOpen] = useState(false);
   const [openModal, setOpenModal] = useState(false);
   const [handleCreateSaleProduct, { isLoading: loadingForm }] = useCreateSaleProductMutation();
   const handleSubmit = async (value: InputSaleProduct) => {
      try {
         await handleCreateSaleProduct(value);
         notification.success({ message: 'Tạo sản phẩm thanh lý thành công' });
         setOpenModal(false);
      } catch (error) {
         notification.error({ message: 'Lỗi hệ thống!' });
         console.log(error);
      }
   };
   if (loadingForm) return <Loading sreenSize='md' />;
   return (
      <div className='flex justify-start items-center gap-3'>
         <Tooltip title='Sửa sản phẩm' placement='bottom'>
            <Link to={linkToUpdate}>
               <button className='p-2 rounded-full bg-white w-10 h-10 shadow-md hover:w-11 hover:h-11 duration-100 '>
                  <PencilIcon className='text-greenPrimary w-4' />
               </button>
            </Link>
         </Tooltip>
         <Tooltip title='Xóa sản phẩm' placement='bottom'>
            <Popconfirm
               open={open}
               title='Bạn có chắc chắn xóa không ?'
               onCancel={() => setOpen(false)}
               onConfirm={() => {
                  getResultConfirm(true, idProduct);
                  setOpen(false);
               }}
               okButtonProps={{ className: 'bg-blue-500' }}
            >
               <button
                  className='p-2 rounded-full bg-white w-10 h-10 shadow-md hover:w-11 hover:h-11 duration-100 '
                  onClick={() => setOpen(true)}
               >
                  <EraserIcon className='text-greenPrimary w-4' />
               </button>
            </Popconfirm>
         </Tooltip>

         {!hasSale && isSale && (
            <>
               <Tooltip title='Thanh lý sản phẩm'>
                  <button
                     onClick={() => setOpenModal(true)}
                     className='p-2 rounded-full bg-white w-10 h-10 shadow-md hover:w-11 hover:h-11 duration-100 flex justify-center items-center'
                  >
                     <MdOutlineDiscount className='text-greenPrimary ' />
                  </button>
               </Tooltip>
               <Modal
                  title='Tạo sản phẩm thanh lý'
                  open={openModal}
                  width={1000}
                  onCancel={() => setOpenModal(false)}
                  footer={[]}
               >
                  <FormCreateSaleProduct productId={idProduct} onSubmitForm={(value) => handleSubmit(value)} />
               </Modal>
            </>
         )}
      </div>
   );
};

export default ActionTable;
