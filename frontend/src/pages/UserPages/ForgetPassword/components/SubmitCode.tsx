import { ChangeEvent, useState } from "react"
import { IProps } from "./GetCode"
import { Button, message } from "antd"
import { useVerifyTokenChangePasswordMutation } from "../../../../services/user.service"

const SubmitCode = ({changeStep}:IProps)=>{
    const [code,setCode] = useState<string>("")
    const [checkcode] = useVerifyTokenChangePasswordMutation()
    const [loadingState, setLoadingState] = useState<boolean>(false);
    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        setLoadingState(true)
            const object={
                Verification: code
            }
           await checkcode(object).unwrap().then(res=>{
            res
            changeStep(3)
           }).catch(err => {
            if(err.data.message=="Reset token has expired!"){
                setLoadingState(false)
                message.error("Mã xác nhận Đã hết hạn")
                changeStep(1)
                return 
            }
            setLoadingState(false)
                message.error("Mã xác nhận không đúng")
           })
            
        
    }
    const changeCode=(e: ChangeEvent<HTMLInputElement>)=>{
        setCode(e.target.value)
    }
    return<>
        <section className='section-userinfo py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2]'>
               <div className=' mx-auto px-[15px]     lg:w-[970px]  md:w-[750px] relative'>
              <form action="" onSubmit={(e)=>handleSubmit(e)}>
              <div className='userinfo-content gap-y-[10px] shadow-lg flex flex-wrap p-[20px] rounded-[10px] bg-white w-full'>
                        <div className='input-wrap flex  max-sm:flex-wrap max-sm:gap-y-[10px] justify-between w-full'>
                           <div className='w-full max-sm:w-full'>
                              <label>
                                 <span className='input-name'>Mã xác nhận</span>
                                 <input
                                    type='text'
                                    onChange={changeCode}
                                    value={code}
                                    className='w-full mt-[10px] py-[10px] px-[15px] outline-none border border-[#e2e2e2] rounded-[10px]'
                                 />
                              </label>
                              
                           </div>
                          
                        </div>
                       
                       <div className="w-full">
                                <Button
                                    onClick={(e)=>handleSubmit(e)}
                                    className='bg-[#455CC6] max-sm:w-full text-white text-center rounded-[10px] '
                                    loading={loadingState}
                                >
                                            Xác nhận
                                </Button>
                        
                       </div>
                       <p className="text-red-500">Chúng tôi đã gửi mã xác nhận về email của bạn, mã xác nhận sẽ hết hạn sau 5 phút</p>
                     </div>
                     
              </form>
              
               </div>
            </section>
    </>
}
export default SubmitCode