
import { Layout, Popconfirm, Rate, Table, message } from 'antd';
import Column from 'antd/es/table/Column';

import { Helmet } from 'react-helmet';

import { IEvaluationFull } from '../../../interfaces/evaluation'
import { useGetAllEvaluationQuery, useUpdateEvaluationMutation } from '../../../services/evaluation.service';
import { formatStringToDate } from '../../../helper';
import Loading from '../../../components/Loading/Loading';
import { useClearTokenMutation } from '../../../services/auth.service';
import { deleteTokenAndUser } from '../../../slices/authSlice';
import { setItem } from '../../../slices/cartSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';





const Evaluation = () => {
    // const [evaluation, setEvaluation] = useState<any>({});
    const { data, isLoading, refetch } = useGetAllEvaluationQuery()
    const [updateEvaluationMutation] = useUpdateEvaluationMutation()
    const [clearToken] = useClearTokenMutation();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onHandleLogout = () => {
         dispatch(deleteTokenAndUser());
         dispatch(setItem());
         clearToken();
         navigate('/login');
      };
    const handleUPdateEvaluationMutation = (item:{_id:string,isReviewVisible:boolean}) => {

        updateEvaluationMutation(item).unwrap().then(res=>{
            res
            if(item.isReviewVisible==false) {
                message.success("Hiện đánh giá thành công")
            }
            else{

                message.success("Ẩn đánh giá thành công")
            }
        }).catch(error=>{
            error
            if(error.data.message=="Refresh Token is invalid" || error.data.message== "Refresh Token is expired ! Login again please !"){
                onHandleLogout()
             } 
            message.success("Hành động thất bại")
        })
        refetch()
    };

    if (isLoading) return <Loading sreenSize='lg' />;
    return (
        <>
            <Helmet>
                <title>Đánh giá</title>
            </Helmet>

            <Layout style={{ minHeight: '100vh', display: 'flex', position: 'relative', width: '100%' }}>
                <div className='flex-1 flex justify-center items-center flex-col mt-10 w-[100%]'>
                    <div className='flex justify-between items-center w-[90%]'>
                        <h1 className='text-3xl font-semibold text-[rgba(0,0,0,0.7)]'>Đánh giá của khách hàng  </h1>


                    </div>

                    <div className='w-[90%] min-h-[100vh] bg-white rounded-lg mt-5'>

                        <div className='flex gap-7 flex-wrap justify-center' style={{ margin: 30 }}>
                            <Table
                                dataSource={data?.body?.data?.map((evaluation) => ({
                                    ...evaluation,
                                    createdAt: formatStringToDate(evaluation.createdAt)
                                }))}
                                pagination={{ pageSize: 5 }}
                                scroll={{ y: 800, x: 2000 }}
                            // loading={isLoading}

                            >

                                <Column
                                    fixed='left'
                                    title='Sản phẩm'
                                    dataIndex='productId'
                                    key='productId'
                                    width={20}
                                    render={(_: IEvaluationFull, record: IEvaluationFull) => {
                                        console.log(record.productId?.images[0].url);

                                        return <img src={record.productId != null ? record.productId?.images[0].url : ''} className='w-[3rem] h-[3rem]' />
                                    }}


                                />
                                <Column
                                    title='Số sao '
                                    dataIndex='rate'
                                    width={40}
                                    render={(_: IEvaluationFull, record: IEvaluationFull) => {
                                        return <Rate allowHalf disabled defaultValue={record.rate != null ? record.rate : record.userId?.rate} />
                                    }}
                                />

                                <Column
                                    title='Nội dung đánh giá'
                                    dataIndex='content'
                                    key='content'

                                    render={(_: IEvaluationFull, record: IEvaluationFull) => (
                                        <p style={{ WebkitLineClamp: '4', wordBreak: 'break-word', overflowWrap: 'break-word', textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical' }} dangerouslySetInnerHTML={{ __html: record.content }}></p>
                                    )
                                    }
                                    width={80}
                                />

                                <Column
                                    title='Tên người đánh giá'
                                    dataIndex='userName'
                                    key='userName'
                                    width={40}
                                    render={(_: IEvaluationFull, record: IEvaluationFull) => {


                                        return <p >{record.userName != null ?
                                            record.userName : record.userId?.userName}</p>
                                    }}

                                />
                                <Column
                                    title='SĐT'
                                    dataIndex='phoneNumber'
                                    key='phoneNumber'
                                    width={40}
                                    render={(_: IEvaluationFull, record: IEvaluationFull) => {
                                        return <p >{record.phoneNumber != null ?
                                            record.phoneNumber : record.userId?.phoneNumber}</p>
                                    }}

                                />
                                <Column
                                    title='Ngày đánh giá'
                                    dataIndex='createdAt'
                                    key=' '
                                    width={40}

                                />

                                <Column
                                    fixed='right'
                                    width={30}
                                    title='Chức năng '
                                    key='_id'
                                    dataIndex={'_id'}
                                    render={(_: IEvaluationFull, record: IEvaluationFull) => {

                                        if (record.isReviewVisible==true) {
                                            const item={
                                                _id: record._id,
                                                isReviewVisible:false
                                            }
                                            return <Popconfirm
                                                description='Bạn chắc chắn muốn ẩn đánh giá này chứ?'
                                                okText='Đồng ý'
                                                cancelText='Hủy bỏ'
                                                title='Bạn có muốn ẩn?'
                                                onConfirm={() => handleUPdateEvaluationMutation(item)}
                                            >
                                                <button type='button'
                                                    className='bg-red-400 focus:outline-none text-black  focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Ẩn bài đánh giá </button>
                                            </Popconfirm>
                                        }
                                        else{
                                            const item={
                                                _id: record._id,
                                                isReviewVisible:true
                                            }
                                            return<>
                                            <button onClick={() => handleUPdateEvaluationMutation(item)} type='button'
                                            className='bg-blue-500 focus:outline-none text-white  focus:ring-4 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'>Hiện bài đánh giá </button>
                                            </>
                                        }
                                    }}
                                />
                            </Table>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Evaluation