import { ChangeEvent, useState } from "react";
import { useChangePasswordMutation } from "../../../../services/user.service";

import { useNavigate } from "react-router-dom";
import { Button, message } from "antd";

const ChangePassword = ()=>{
    const [password,setPassword] = useState<string>("")
    const [confirmpassword,setConfirmPassword] = useState<string>("")
    const [userChangePassword] = useChangePasswordMutation()
    const [loadingState, setLoadingState] = useState<boolean>(false);

    const navigate = useNavigate();

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
       if(password.length<6){
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
                password: password,
                confirmPassword:confirmpassword
            }
           await userChangePassword(object).unwrap().then(res=>{
            res
            message.success("Đổi mật khẩu thành công")
            navigate('/login')
           }).catch(err => {
            setLoadingState(false)
            console.log(err);
                message.error("Mã xác nhận không đúng")
           })
            
        
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