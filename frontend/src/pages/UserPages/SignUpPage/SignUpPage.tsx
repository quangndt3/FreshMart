import { message } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useSignupMutation } from '../../../services/auth.service';
import { saveTokenAndUser } from '../../../slices/authSlice';
import { setItem } from '../../../slices/cartSlice';
import { GoogleOutlined } from '@ant-design/icons';
import { baseUrl } from '../../../constants/baseUrl';

const SignUpPage = () => {
   const [userName, setuserName] = useState('');
   const [email, setemail] = useState('');
   const [password, setpassword] = useState('');
   const [confirmPassword, setconfirmPassword] = useState('');
   const [phoneNumber, setphoneNumber] = useState('');
   const [address, setaddress] = useState('');

   const navigate = useNavigate();
   const dispatch = useDispatch();
   const [signup, { data, isLoading, error }] = useSignupMutation();
   useEffect(() => {
      if (error && 'data' in error) {
         const data = error.data as { message: string };
         if ('message' in data) message.error(data?.message);
      }
   }, [error]);

   useEffect(() => {
      if (!isLoading && data) {
         dispatch(saveTokenAndUser({ accessToken: data.body.data.accessToken, user: data.body.data.data }));
         dispatch(setItem());
         navigate('/');
      }
   }, [data, isLoading, error, dispatch, navigate]);

   const signHandle = () => {
      signup({
         userName,
         email,
         password,
         confirmPassword,
         phoneNumber,
         address
      });
      return;
   };

   return (
      <>
         <div className='main'>
            <section className='section-breadcrumb py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2]'>
               <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start relative'>
                  <span>
                     <Link to={'#'}>Trang chủ </Link> / Đăng nhập
                  </span>
               </div>
            </section>
            <section className='section-login lg:py-[100px] md:py-[80px] max-md:py-[60px]'>
               <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] '>
                  <div className='login-header text-center md:mb-[50px] max-md:mb-[30px]'>
                     <span className='login-title text-[#333333] sm:text-[30px] max-sm:text-[24px] font-bold'>
                        Đăng ký tài khoản
                     </span>
                     <p className='login-sub-title mt-[18px]'>Vui lòng điền thông tin tài khoản</p>
                  </div>
                  <div className='login-content xl:w-[50%] lg:w-[60%] md:w-[70%] max-md:w-[100%] m-auto'>
                     <form action='' className='login-form'>
                        <div className='login-first-name mt-[25px]'>
                           <label htmlFor='first' className='block cursor-pointer mb-[10px]'>
                              Tên
                           </label>
                           <input
                              className='input-mail w-full outline-none bg-[#f7f7f7] rounded-[5px] px-[15px] py-[10px] border-[#e2e2e2] border-[1px] placeholder:text-[#6f6f6f]'
                              placeholder='Vui lòng nhập Tên'
                              id='userName'
                              type='text'
                              value={userName}
                              onChange={(e) => setuserName(e.target.value)}
                           />
                        </div>

                        <div className='login-mail mt-[25px]'>
                           <label htmlFor='mail' className='block cursor-pointer mb-[10px]'>
                              Email
                           </label>
                           <input
                              className='input-mail w-full outline-none bg-[#f7f7f7] rounded-[5px] px-[15px] py-[10px] border-[#e2e2e2] border-[1px] placeholder:text-[#6f6f6f]'
                              placeholder='Vui lòng nhập Email '
                              id='mail'
                              type='email'
                              value={email}
                              onChange={(e) => setemail(e.target.value)}
                           />
                        </div>

                        <div className='login-first-name mt-[25px]'>
                           <label htmlFor='first' className='block cursor-pointer mb-[10px]'>
                              Điện thoại
                           </label>
                           <input
                              className='input-mail w-full outline-none bg-[#f7f7f7] rounded-[5px] px-[15px] py-[10px] border-[#e2e2e2] border-[1px] placeholder:text-[#6f6f6f]'
                              placeholder='Vui lòng nhập Điện thoại'
                              id='phoneNumber'
                              type='text'
                              value={phoneNumber}
                              onChange={(e) => setphoneNumber(e.target.value)}
                           />
                        </div>

                        <div className='login-first-name mt-[25px]'>
                           <label htmlFor='first' className='block cursor-pointer mb-[10px]'>
                              Địa chỉ
                           </label>
                           <input
                              className='input-mail w-full outline-none bg-[#f7f7f7] rounded-[5px] px-[15px] py-[10px] border-[#e2e2e2] border-[1px] placeholder:text-[#6f6f6f]'
                              placeholder='Vui lòng nhập Địa chỉ'
                              id='address'
                              type='text'
                              value={address}
                              onChange={(e) => setaddress(e.target.value)}
                           />
                        </div>

                        <div className='login-password mt-[25px]'>
                           <label htmlFor='password' className='block cursor-pointer mb-[10px]'>
                              Mật khẩu
                           </label>
                           <input
                              className='input-password w-full outline-none bg-[#f7f7f7] rounded-[5px] px-[15px] py-[10px] border-[#e2e2e2] border-[1px]  placeholder:text-[#6f6f6f]'
                              placeholder='Vui lòng nhập Mật khẩu'
                              id='password'
                              type='password'
                              value={password}
                              onChange={(e) => setpassword(e.target.value.trim())}
                           />
                        </div>
                        <div className='login-password mt-[25px]'>
                           <label htmlFor='password' className='block cursor-pointer mb-[10px]'>
                              Nhập lại mật khẩu
                           </label>
                           <input
                              className='input-password w-full outline-none bg-[#f7f7f7] rounded-[5px] px-[15px] py-[10px] border-[#e2e2e2] border-[1px]  placeholder:text-[#6f6f6f]'
                              placeholder='Nhập lại mật khẩu'
                              id='confimpassword'
                              type='password'
                              value={confirmPassword}
                              onChange={(e) => setconfirmPassword(e.target.value.trim())}
                           />
                        </div>
                        <div className='action-btn flex items-center justify-between sm:mt-[30px] max-sm:mt-[20px] gap-2 gap-y-[20px]'>
                           <button
                              type='button'
                              onClick={signHandle}
                              className='w-full btn-sign-up text-white bg-[#333333] text-center px-[40px] py-[15px] rounded-[5px] font-bold transition-colors duration-300 hover:bg-[#51A55C] '
                           >
                              Đăng ký
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
                     </form>
                     <div className='link-to-log-in mt-[30px] py-[30px] px-[15px] bg-[#333333] text-white text-[18px] text-center rounded-[5px]'>
                        Bạn đã có tài khoản?{' '}
                        <Link
                           to={'/login'}
                           className='underline max-sm:block text-[rgba(255,255,255,0.5)] hover:text-[rgba(255,255,255,0.8)] ml-[5px]'
                        >
                           Đăng nhập
                        </Link>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
};
export default SignUpPage;
