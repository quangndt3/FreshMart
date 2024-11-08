import { Button, message } from "antd"
import { ChangeEvent, useState } from "react";
import { useSendCodeToChangePasswordMutation } from "../../../../services/user.service";
export type  IProps={
    changeStep: (value:number)=>void
}
const GetCode = ({changeStep}:IProps)=>{
    const [email,setEmail] = useState<string>("")
    const [SendCode] = useSendCodeToChangePasswordMutation()
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoadingState(true)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            setLoadingState(false)
            message.error("Không đúng định dạng email")
        }
        else{
            const object={
                email: email
            }
           await SendCode(object).unwrap().then(res=>{
            res
            changeStep(2)
           }).catch(err => {
            console.log(err);
            setLoadingState(false)
                message.error("Email không tồn tại")
           })
            
        }
    }
    const changeEmail=(e: ChangeEvent<HTMLInputElement>)=>{
        setEmail(e.target.value)
    }
    return<>
           <section className='section-userinfo py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2]'>
               <div className=' mx-auto px-[15px]     lg:w-[970px]  md:w-[750px] relative'>
              <form action="" onSubmit={(e)=>handleSubmit(e)}>
              <div className='userinfo-content gap-y-[10px] shadow-lg flex flex-wrap p-[20px] rounded-[10px] bg-white w-full'>
                        <div className='input-wrap flex  max-sm:flex-wrap max-sm:gap-y-[10px] justify-between w-full'>
                           <div className='w-full max-sm:w-full'>
                              <label>
                                 <span className='input-name'>Email</span>
                                 <input
                                    type='text'
                                    onChange={changeEmail}
                                    value={email}
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
export default GetCode