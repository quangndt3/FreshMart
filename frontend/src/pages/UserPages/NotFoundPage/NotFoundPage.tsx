import { useSelector } from 'react-redux';
import { logoUrl } from '../../../constants/imageUrl';
import { Link } from 'react-router-dom';
import { IAuth } from '../../../slices/authSlice';
const NotFoundPage = () => {
   const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
   return (
      <div>
         <div className='text-center p-10'>
            <div>
               <img className='m-auto w-48 mt-[2%] mb-[5%]' src={logoUrl} alt='' />
            </div>

            <div className='text-5xl font-extrabold ...'>
               <span className='text-[#6BAA14] md:text-8xl text-5xl font-extrabold'>404</span>
            </div>

            <div className='flex flex-col gap-3 items-center mx-auto md:w-1/2 lg:w-3/5'>
               <div className='w-full md:w-4/5'>
                  <p className='md:text-5xl text-4xl font-extrabold'>Không tìm thấy nội dung</p>
               </div>
               <div className='w-full md:w-1/6  md:mt-0'>
                  <img
                     className='w-[100px] mx-auto'
                     src='https://img.freepik.com/premium-vector/cute-funny-crying-sad-carrot-character_464314-1975.jpg'
                     alt=''
                  />
               </div>
            </div>

            <div className='mt-3'>
               <p className='text-lg font-medium'>URL của nội dung này đã bị thay đổi hoặc không còn tồn tại.</p>
               <p className='text-lg font-medium'>
                  Nếu bạn đang lưu URL này, hãy thử truy cập lại từ trang chủ thay vì sử dụng URL đã lưu.
               </p>
            </div>

            <div className='mt-8'>
               <Link to={auth.user.role === 'member' ? '/' : '/manage/dashboard'} className='p-2'>
                  <button className='rounded-full bg-[#6BAA14] px-2 text-white lg:text-lg text-sm  font-medium  h-10 mx-auto md:mx-0'>
                     Quay về trang chủ
                  </button>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default NotFoundPage;
