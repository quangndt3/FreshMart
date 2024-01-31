import { Button } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { baseUrl } from "../../../constants/baseUrl";
import Loading from "../../../components/Loading/Loading";

function VNPayIpn() {
    const [sucess, setSuccess] = useState<string | null>(null)
    const [responseVNPay, setResponseVNPay] = useState<Record<string, string | number>>({})
    const location = useLocation();
    const fetchApi = async (data: Record<string, string | number>) => {
        try {
            const url = new URL(baseUrl + '/api/vnpay_ipn');

            // Thêm các tham số vào URL
            Object.keys(data).forEach(key => {
                url.searchParams.append(key, data[key] as string);
            });

            const response = await fetch(url.toString());

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            setResponseVNPay({ ...data, ...result })
            if (result.Message == 'success') {
                setSuccess('success')
            } else {
                setSuccess('false')
            }
        } catch (error) {
            console.error('Error during API call:', error);
        }
    }
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const urlVariables: Record<string, string | number> = {};
        for (const [key, value] of searchParams) {
            urlVariables[key] = value;
        }
        if (Object.keys(urlVariables).length > 0) {
            fetchApi(urlVariables)
        }

        console.log('URL Variables:', urlVariables);

        // Sử dụng đối tượng urlVariables theo cách bạn muốn
    }, [location]);
    return (
        sucess != null ? sucess == 'success' ? (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-15">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full space-y-4">
                    <h1 className="text-2xl font-semibold text-gray-800">VNPAY Response</h1>

                    <div className="flex flex-col space-y-2">
                        <div>
                            <span className="font-semibold">Response Code:</span> {responseVNPay.RspCode}
                        </div>

                        <div>
                            <span className="font-bold ">Message:</span> <span className="text-green-500">{responseVNPay.Message}</span>
                        </div>

                        <div>
                            <span className="font-semibold">Thành tiền:</span> {typeof responseVNPay.vnp_Amount == 'string' && parseInt(responseVNPay.vnp_Amount.slice(0, -2)).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </div>

                        <div>
                            <span className="font-semibold">Nội dung thanh toán:</span> {responseVNPay.vnp_OrderInfo}
                        </div>

                        <div>
                            <span className="font-semibold">Ngân hàng thanh toán:</span> {responseVNPay.vnp_BankCode}
                        </div>

                        <div>
                            <span className="font-semibold">Mã giao dịch:</span> {responseVNPay.vnp_TransactionNo}
                        </div>

                        <div>
                            <span className="font-semibold">Trạng thái giao dịch:</span> Thanh toán thành công
                        </div>
                    </div>

                    <Link to="/orderComplete" className='p-2'>
                        <Button danger type="primary" className="bg-blue-500 my-2">Tiếp tục</Button>
                    </Link>
                </div>
            </div>
        ) : (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 py-15">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full space-y-4">
                    <h1 className="text-2xl font-semibold text-gray-800">VNPAY Response</h1>

                    <div className="flex flex-col space-y-2">
                        <div>
                            <span className="font-semibold">Response Code:</span> {responseVNPay.RspCode}
                        </div>

                        <div>
                            <span className="font-bold ">Message:</span> <span className="text-red-500">{responseVNPay.Message}</span>
                        </div>
                    </div>

                    <Link to="/" className='p-2'>
                        <Button danger type="primary" className="bg-blue-500 my-2">Trở về trang chủ</Button>
                    </Link>
                </div>
            </div>
        )
            :
            (
                <div className='h-screen flex items-center justify-center'>
                    <Loading sreenSize='lg' />
                </div>
            )
    );
}

export default VNPayIpn;