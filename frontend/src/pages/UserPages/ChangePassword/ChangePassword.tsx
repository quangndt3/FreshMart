import { Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useChangePasswordPageMutation } from "../../../services/user.service";
import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IAuth, deleteTokenAndUser } from "../../../slices/authSlice";
import { setItem } from "../../../slices/cartSlice";
import { useClearTokenMutation } from "../../../services/auth.service";


const ChangePassword = ()=>{
    const [password,setPassword] = useState<string>("")
    const auth = useSelector((state: { userReducer: IAuth }) => state.userReducer);
    const [oldPassword,setOldPassword] = useState<string>("")
    const [confirmpassword,setConfirmPassword] = useState<string>("")
    const [userChangePassword] = useChangePasswordPageMutation()
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [clearToken] = useClearTokenMutation();
    useEffect(()=>{
        if(!auth.user._id){
            navigate('/');
        }
    },[])
    const onHandleLogout = () => {
         dispatch(deleteTokenAndUser());
         dispatch(setItem());
         clearToken();
         navigate('/login');
      };
    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        if(oldPassword.length<6){
            setLoadingState(false)
            message.error("Mật khẩu hiện tại phải lớn hơn 6 ký tự")
            return
           }
       else if(password.length<6){
        setLoadingState(false)
        message.error("Mật khẩu phải lớn hơn 6 ký tự")
        return
       }
       else if(password!==confirmpassword){
        setLoadingState(false)
        message.error("Xác nhận mật khẩu không trùng khớp với mật khẩu")
        return
       }
            const object={
                currentPassword:oldPassword,
                password: password,
                confirmPassword:confirmpassword
            }
           await userChangePassword(object).unwrap().then((res)  =>  {
            res
            dispatch(deleteTokenAndUser());
            dispatch(setItem());
            clearToken();
            navigate('/login');
            message.success("Đổi mật khẩu thành công")
           }).catch(err => {
            setLoadingState(false)
            if(err.data.message == 'Current password does not match'){
                message.error("Mật khẩu hiện tại không đúng")
            }
            else if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
               onHandleLogout()
            } 
           })
            
        
    }
    const changeOldPassword = (e: ChangeEvent<HTMLInputElement>)=>{
        setOldPassword(e.target.value)
    }
    const changePassword = (e: ChangeEvent<HTMLInputElement>)=>{
        setPassword(e.target.value)
    }
    const changeConfirmPassword=(e: ChangeEvent<HTMLInputElement>)=>{
        setConfirmPassword(e.target.value)
    }
    return<>
       <section className='section-userinfo py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2]'>
               <div className=' mx-auto px-[15px]     lg:w-[970px]  md:w-[750px] relative'>
              <form action="" onSubmit={(e)=>handleSubmit(e)}>
              <div className='userinfo-content gap-y-[10px] shadow-lg flex flex-wrap p-[20px] rounded-[10px] bg-white w-full'>
              <div className='input-wrap flex  max-sm:flex-wrap max-sm:gap-y-[10px] justify-between w-full'>
                           <div className='w-full'>
                              <label>
                                 <span className='input-name'> Mật khẩu hiện tại</span>
                                 <input
                                    type='password'
                                    onChange={changeOldPassword}
                                    value={oldPassword}
                                    className='w-full mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[10px]'
                                 />
                              </label>
                              
                           </div>
                        </div>
                        <div className='input-wrap flex  max-sm:flex-wrap max-sm:gap-y-[10px] justify-between w-full'>
                           <div className='w-[48%] max-sm:w-full'>
                              <label>
                                 <span className='input-name'>Mật khẩu</span>
                                 <input
                                    type='password'
                                    onChange={changePassword}
                                    value={password}
                                    className='w-full mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[10px]'
                                 />
                              </label>
                              
                           </div>
                           <div className='w-[48%] max-sm:w-full'>
                              <label>
                                 <span className='input-name'> Xác nhận mật khẩu</span>
                                 <input
                                    type='password'
                                    onChange={changeConfirmPassword}
                                    value={confirmpassword}
                                    className='w-full mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[10px]'
                                 />
                              </label>
                              
                           </div>
                        </div>
                       
                        <Button
                                    onClick={(e)=>handleSubmit(e)}
                                    className='bg-[#455CC6] max-sm:w-full text-white text-center rounded-[10px] '
                                    loading={loadingState}
                                >
                                            Xác nhận
                                </Button>
                     </div>
              </form>
               </div>
            </section>
</>
}
export default ChangePassword