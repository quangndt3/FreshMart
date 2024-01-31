import { Layout, Popconfirm, Table } from 'antd';
import { useGetAllQuery, useUpdateUserMutation } from '../../../services/user.service';
import { Helmet } from 'react-helmet';
import Column from 'antd/es/table/Column';
import { useClearTokenMutation } from '../../../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { deleteTokenAndUser } from '../../../slices/authSlice';
import { setItem } from '../../../slices/cartSlice';


const Account = () => {
    const { data, refetch, isLoading } = useGetAllQuery({});

    const [update] = useUpdateUserMutation();
    const [clearToken] = useClearTokenMutation();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onHandleLogout = () => {
         dispatch(deleteTokenAndUser());
         dispatch(setItem());
         clearToken();
         navigate('/login');
      };
    const onHandleUpdate = async (item: any) => {

        await update({ id: item._id, data: { userName: item.userName, email: item.email, state: !item.state } }).unwrap()
        .catch((err) => {
         if(err.data.message=="Refresh Token is invalid" || err.data.message== "Refresh Token is expired ! Login again please !"){
                  onHandleLogout()
               } 
        });
        refetch()
    };

    return (
        <>
            <Helmet>
                <title>Tài khoản</title>
            </Helmet>
            <Layout style={{ minHeight: '100vh', display: 'flex', position: 'relative', width: '100%' }}>
                <div className='flex-1 flex justify-center items-center flex-col mt-10 w-[100%]'>
                    <div className='flex justify-between items-center w-[90%]'>
                        <h1 className='text-3xl font-semibold text-[rgba(0,0,0,0.7)]'>Tài khoản</h1>
                    </div>
                    <div className='w-[90%] min-h-[100vh] bg-white rounded-lg mt-5'>
                        <div className='flex gap-7 flex-wrap justify-center' style={{ margin: 30 }}>
                            <Table
                                dataSource={data?.body?.data?.docs.map((item: any) => ({ ...item }))}
                                pagination={{ pageSize: 10 }}
                                scroll={{ y: 800, x: 1000 }}
                                loading={isLoading}
                            >
                                <Column
                                    title='Tên'
                                    dataIndex='userName'
                                    key='userName'
                                    width={150}
                                    render={(record) => (
                                        <span>
                                            {record}
                                        </span>
                                    )}
                                />
                                <Column
                                    title='Ảnh'
                                    dataIndex='avatar'
                                    key='avatar'
                                    width={70}
                                    render={(avatar) => <img src={avatar} className='w-[3rem] h-[3rem]' />}
                                />

                                <Column title='email' dataIndex='email' key='email' width={250} />

                                <Column
                                    title='Vai trò'
                                    dataIndex='role'
                                    key='role'
                                    width={100}

                                />
                                <Column
                                    title='Số điện thoại'
                                    dataIndex='phoneNumber'
                                    key='phoneNumber'
                                    width={150}

                                />
                                <Column
                                    title='Địa chỉ'
                                    dataIndex='address'
                                    key='address'
                                    width={280}

                                />

                                <Column
                                    title='Hành động'
                                    fixed='right'
                                    key='_id'
                                    dataIndex='_id'
                                    width={150}
                                    render={(_, record: any) => {

                                        if (record.role == "admin") {
                                            return <></>
                                        } else {
                                            if (record.state) {

                                                return (<Popconfirm
                                                    className={``}
                                                    description='Bạn chắc chắn muốn vô hiệu khóa tài khoản này?'
                                                    okText='Đồng ý'
                                                    cancelText='Hủy bỏ'
                                                    title='Vô hiệu hóa?'
                                                    onConfirm={() => onHandleUpdate(record)}
                                                >
                                                    <button
                                                        type="button"
                                                        className="inline-block rounded bg-red-500 px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#dc4c64] transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(220,76,100,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)]"
                                                    >
                                                        Vô hiệu hóa
                                                    </button>
                                                </Popconfirm>
                                                )
                                            } else {
                                                return (<Popconfirm
                                                    className={``}
                                                    description='Bạn chắc chắn muốn kích hoạt lại tài khoản này?'
                                                    okText='Đồng ý'
                                                    cancelText='Hủy bỏ'
                                                    title='Kích hoạt?'
                                                    onConfirm={() => onHandleUpdate(record)}
                                                >
                                                    <button
                                                        type="button"
                                                        className="inline-block rounded bg-green-500 px-3 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#dc4c64] transition duration-150 ease-in-out hover:bg-danger-600 hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:bg-danger-600 focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] focus:outline-none focus:ring-0 active:bg-danger-700 active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.3),0_4px_18px_0_rgba(220,76,100,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(220,76,100,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(220,76,100,0.2),0_4px_18px_0_rgba(220,76,100,0.1)]"
                                                    >
                                                        Kích hoạt
                                                    </button>
                                                </Popconfirm>
                                                )
                                            }
                                        }
                                    }}
                                />
                            </Table>
                        </div>
                    </div>
                </div>
            </Layout >
        </>
    );
}

export default Account