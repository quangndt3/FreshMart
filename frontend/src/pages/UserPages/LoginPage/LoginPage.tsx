import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setItem } from '../../../slices/cartSlice';
import { message } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../../../services/auth.service';
import { saveTokenAndUser } from '../../../slices/authSlice';
import Loading from '../../../components/Loading/Loading';
import { GoogleOutlined } from '@ant-design/icons';
import { baseUrl } from '../../../constants/baseUrl';

const LoginPage = () => {
   const [email, setEmail] = useState('');
   const [password, setpassword] = useState('');

   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [login, { isLoading }] = useLoginMutation();

   const onFinish = async () => {
      try {
         const data = await login({ email, password }).unwrap();
         dispatch(saveTokenAndUser({ accessToken: data?.body.data.accessToken, user: data?.body.data.data }));
         dispatch(setItem());
         if (data?.body.data.data.role !== 'admin') {
            navigate('/');
         } else {
            navigate('/manage');
         }
      } catch (error: any) {
         message.error(error.data.message);
      }
   };
   if (isLoading) return <Loading sreenSize='lg' />;
   return (
      <>
         <div className='main'>
            <section className='section-breadcrumb py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2]'>
               <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start relative'>
                  <span>
                     <Link to={'/'}>Trang chủ </Link> / Đăng nhập
                  </span>
               </div>
            </section>
            <section className='section-login lg:py-[100px] md:py-[80px] max-md:py-[60px]'>
               <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] '>
                  <div className='login-header text-center md:mb-[50px] max-md:mb-[30px]'>
                     <span className='login-title text-[#333333] sm:text-[30px] max-sm:text-[24px] font-bold'>
                        Đăng nhập tài khoản
                     </span>
                     <p className='login-sub-title mt-[18px]'>Vui lòng điền thông tin tài khoản</p>
                  </div>
                  <div className='login-content xl:w-[50%] lg:w-[60%] md:w-[70%] max-md:w-[100%] m-auto'>
                     <form action='' className='login-form'>
                        <div className='login-mail mt-[25px]'>
                           <label htmlFor='mail' className='block cursor-pointer mb-[10px]'>
                              Email
                           </label>
                           <input
                              className='input-mail w-full outline-none bg-[#f7f7f7] rounded-[5px] px-[15px] py-[10px] border-[#e2e2e2] border-[1px] placeholder:text-[#6f6f6f]'
                              placeholder='Vui lòng nhập Email'
                              value={email}
                              id='mail'
                              type='text'
                              onChange={(e) => {
                                 setEmail(e.target.value);
                              }}
                           />
                        </div>
                        <div className='login-password mt-[25px]'>
                           <label htmlFor='password' className='block cursor-pointer mb-[10px]'>
                              Mật khẩu
                           </label>
                           <input
                              className='input-password w-full outline-none bg-[#f7f7f7] rounded-[5px] px-[15px] py-[10px] border-[#e2e2e2] border-[1px]  placeholder:text-[#6f6f6f]'
                              placeholder='Vui lòng nhập Mật khẩu'
                              value={password}
                              id='password'
                              type='password'
                              onChange={(e) => {
                                 setpassword(e.target.value.trim());
                              }}
                           />
                        </div>
                        <div className='action-btn flex items-center justify-between sm:mt-[30px] max-sm:mt-[20px] gap-2 gap-y-[20px]'>
                           <button
                              type='button'
                              onClick={onFinish}
                              className='w-[100%] text-white bg-[#333333] text-center px-[40px] py-[15px] rounded-[5px] font-bold transition-colors duration-300 hover:bg-[#51A55C] '
                           >
                              Đăng nhập
                           </button>
                           <Link className='w-[100%]' to={baseUrl + '/api/auth/google/login'}>
                              <button
                                 type='button'
                                 className='w-full btn-sign-up text-white bg-[#333333] text-center px-[40px] py-[15px] rounded-[5px] font-bold transition-colors duration-300 hover:bg-[#51A55C] '
                              >
                                 <GoogleOutlined /> google
                              </button>
                           </Link>
                        </div>
                        <Link
                           to='/forgetPassword'
                           className='link-to-forget-password underline max=sm:text-[16px] sm:text-[18px] hover:text-[#333333] '
                        >
                           Quên mật khẩu ?
                        </Link>
                        <div className='link-to-sign-up mt-[30px] py-[30px] px-[15px] bg-[#333333] text-white text-[18px] text-center rounded-[5px]'>
                           Bạn không có tài khoản?{' '}
                           <Link
                              to={'/signup'}
                              className='underline max-sm:block text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.8)] ml-[5px]'
                           >
                              Tạo tài khoản
                           </Link>
                        </div>
                     </form>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
};
export default LoginPage;
