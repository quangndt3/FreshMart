import { Link } from "react-router-dom"
import { BsCheckCircle } from "react-icons/bs";
const OrderCompletePage = () =>{
    return <>
        <div className="main h-[87vh] max-sm:h-[80vh] flex justify-center items-center">
        <section className="section-order-complete">
            <div className="cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px] lg:w-[970px]  md:w-[750px] text-center">
          <div className="order-complete-content ">
                       <BsCheckCircle className="text-[60px] m-auto text-[#51A55C]"></BsCheckCircle>
                <h1 className="text-[30px]  text-black font-bold my-[10px] max-sm:text-[20px]">Cảm ơn quý khách đã mua hàng!</h1>
                <p className="mb-[10px] text-[18px] max-sm:text-[16px]">Đơn hàng của bạn đã được xử lý. Bạn sẽ nhận được email về chi tiết đơn hàng</p>
                <Link className="text-[#ec826e] hover:border-b-[2px] border-[#ec826e]" to="/">Trở lại trang home</Link>
          </div>
            </div>
        </section>
        </div>
    </>
}
export default OrderCompletePage