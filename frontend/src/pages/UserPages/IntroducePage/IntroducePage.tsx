import Title from "antd/es/typography/Title"
import { Link } from "react-router-dom"


const IntroducePage = () => {
    return (
        <>
            <div className='main'>
                <section className='section-breadcrumb py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2]'>
                    <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start relative'>
                        <span>
                            <Link to='/'>Trang chủ </Link> / Giới thiệu
                        </span>
                    </div>
                </section>
                <section className=' lg:py-[100px] md:py-[80px] max-md:py-[60px] '>
                    <div className=' mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] '>
                        <div className=' xl:w-[90%] lg:w-[60%] md:w-[70%] max-md:w-[100%] m-auto  '>
                            <div className='text-center'>
                                <Title level={1}>Về chúng tôi</Title>
                                <h2>Mang đến cho khách hàng những sản phẩm trái cây an toàn, chất lượng cao, mà kèm theo đó là những dịch vụ tiện ích thân thiện </h2>
                            </div>
                            <div className="main-introduce flex justify-center max-sm:flex-col gap-10 mt-10  items-center">
                                <div className="content-introduce w-[90%]  ">
                                    <img src="https://spacingtech.com/html/tm/freozy/freezy-ltr/image/about-us/t-3.jpg" alt="" />

                                </div>
                                <div className="conten-introduce w-[90%] ">
                                    <Title className='text-center' level={2}>Cửa hàng của chúng tôi</Title>
                                    <h2>Chúng tôi hi vọng tất cả người tiêu dùng Việt Nam và Quốc Tế sẽ được sử dụng các loại
                                        hoa quả sạch tươi ngon, bổ dưỡng và an toàn nhất tại cửa hàng Fresh mart. Fresh mart cam kết đưa đến người tiêu dùng các mặt hàng nông sản tươi ngon nhất của các vùng miền trên Toàn Quốc với phương châm là “Mang thiên nhiên về với căn nhà của bạn”.</h2>
                                </div>
                            </div>

                            <div className="main-introduce flex justify-center max-sm:flex-col-reverse gap-10 mt-10  items-center ">
                                <div className="conten-introduce w-[90%]">
                                <Title className='text-center' level={2}>Nhiệm vụ của chúng tôi</Title>
                                <h2 className="mb-5">Chúng tôi cung cấp các mặt hàng hoa quả nội địa, hoa quả nhập khẩu tươi ngon, sạch sẽ nhất. Hoa quả Fresh mart cung cấp hoa quả đảm bảo tiêu chí:</h2>

                                <p>Có nguồn gốc xuất xứ rõ ràng, được trồng, thu hoạch, vận chuyển, bảo quản theo đúng quy chuẩn</p>
                                <p>Đạt tiêu chuẩn vệ sinh an toàn thực phẩm, không chứa chất hóa học, chất bảo quản,...</p>
                                <p>Luôn tươi ngon, đảm bảo cung cấp đầy đủ dinh dưỡng, năng lượng cần thiết cho cơ thể</p>
                                <p>Phù hợp với khẩu vị của từng đối tượng khách hàng</p>
                                </div>
                                <div className="conten-introduce w-[90%]">
                            <img src="https://spacingtech.com/html/tm/freozy/freezy-ltr/image/about-us/t-1.jpg" alt="" />
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}

export default IntroducePage