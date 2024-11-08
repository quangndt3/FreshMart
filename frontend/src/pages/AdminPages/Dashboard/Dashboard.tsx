/* eslint-disable @typescript-eslint/no-explicit-any */
import { Helmet } from 'react-helmet';
import { useState, useEffect, useMemo } from 'react';
import Loading from '../../../components/Loading/Loading';
import { Divider, Rate, Statistic, message } from 'antd';
import CountUp from 'react-countup';
import { Formatter } from 'antd/es/statistic/utils';
import { CiUser } from 'react-icons/ci';
import ChartColumn from './components/ChartColumn';
import ChartLine from './components/ChartLine';
import ChartArea from './components/ChartArea';
import { getAllStatistics } from '../../../api/statistic';
import Title from 'antd/es/typography/Title';
const Dashboard = () => {
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const [statisticData, setStatisticData] = useState<any>({});
   console.log(statisticData);
   const [loading, setLoading] = useState<boolean>(false);
   useEffect(() => {
      const fetchData = async () => {
         try {
            const { data } = await getAllStatistics();
            setStatisticData(data?.body.data[data?.body.data.length - 1]);
         } catch (error) {
            message.error('Lỗi hệ thống!');
            console.log(error);
         }
      };
      (async () => {
         try {
            setLoading(true);
            await fetchData();
         } catch (error) {
            console.log(error);
         } finally {
            setLoading(false);
         }
      })();
   }, []);
   const top5ProductOptions = useMemo(() => {
      const rawData = statisticData?.topFiveProductsSold || [];
      return {
         title: '5 sản phẩm có số lượng bán cao nhất',
         categories: rawData.map((product: any) => product.productName),
         yTitle: 'kg',
         suffix: 'kg',
         series: [
            {
               name: 'Số lượng',
               data: rawData.map((product: any) => [product.productName, product.totalWeight]),
               color: '#6a8d92'
            }
         ]
      };
   }, [statisticData]);

   const top5CategoryRevenue = useMemo(() => {
      const rawData = statisticData?.topFiveCategoryByRevenue || [];
      return {
         title: '5 danh mục có doanh thu cao nhất',
         categories: rawData.map((cateogory: any) => cateogory.categoryName),
         yTitle: 'VND',
         suffix: 'VND',
         series: [
            {
               name: 'Doanh thu',
               data: rawData.map((cateogory: any) => [cateogory.categoryName, cateogory.totalPrice]),
               color: '#6a8d92'
            }
         ]
      };
   }, [statisticData]);

   const avgCustomerAndOrders = useMemo(() => {
      const rawData = statisticData?.totalCustomerAndTransactions || [];
      return {
         title: 'Tổng khách hàng & đơn hàng theo tháng',
         yTitle1: 'Người',
         yTitle2: 'Đơn hàng',
         year: rawData[0]?.year || 2023,
         series: [
            {
               name: 'Khách hàng',
               data: rawData.map((data: any) => data.customers),
               color: '#6a8d92'
            },
            {
               name: 'Đơn hàng',
               data: rawData.map((data: any) => data.transactions),
               color: '#57d6e7'
            }
         ]
      };
   }, [statisticData]);

   const avgPriceAndUnitPerOrders = useMemo(() => {
      const rawData = statisticData?.averagePriceAndUnitsPerTransaction || [];
      return {
         title: 'Trung bình giá và số sản phẩm mỗi đơn hàng',
         yTitle1: 'VND',
         yTitle2: 'Số lượng',
         year: rawData[0]?.year || 2023,
         series: [
            {
               name: 'Tổng tiền',
               data: rawData.map((data: any) => data.pricePerTransaction),
               color: '#6a8d92'
            },
            {
               name: 'Sản phẩm',
               data: rawData.map((data: any) => data.unitsPerTransaction),
               color: '#57d6e7'
            }
         ]
      };
   }, [statisticData]);
   const revenueByDay = useMemo(() => {
      const rawData = statisticData?.salesRevenueByDay || [];
      // console.log(rawData);

      return {
         title: 'Doanh thu theo ngày',
         data: [...rawData]
      };
   }, [statisticData]);
   const formatter = (value: number) => <CountUp end={value} separator=',' />;
   if (loading) return <Loading sreenSize='lg' />;
   return (
      <div className='w-full'>
         <Helmet>
            <title>Quản lý</title>
         </Helmet>
         <div className='single-statistic grid xl:grid-cols-4 py-4 px-5 bg-white text-center'>
            <div className='item p-2 flex justify-center items-center flex-col  xl:border-r-[2px] xl:border-[#e8e8e9]'>
               <Statistic
                  valueStyle={{ color: '#6a8d92', fontSize: '30px' }}
                  value={statisticData?.salesRevenueOfCurrentDay}
                  formatter={formatter as Formatter}
                  prefix={<span className='text-greenDashboard text-xl'>VND</span>}
               />
               <span className='text-[#666666] font-bold text-xl'>Doanh thu hôm nay</span>
            </div>
            <div className='item p-2 flex justify-center items-center flex-col  xl:border-r-[2px] xl:border-[#e8e8e9]'>
               <Statistic
                  valueStyle={{ color: '#6a8d92', fontSize: '30px' }}
                  value={statisticData?.customers}
                  formatter={formatter as Formatter}
                  prefix={<CiUser className='text-greenDashboard text-xl font-extrabold' />}
               />
               <span className='text-[#666666] font-bold text-xl'>Khách hàng</span>
            </div>
            <div className='item p-2 flex justify-center items-center flex-col  xl:border-r-[2px] xl:border-[#e8e8e9] ]'>
               <Statistic
                  valueStyle={{ color: '#6a8d92', fontSize: '30px' }}
                  value={statisticData?.averageTransactionPriceOfCurrentDay}
                  formatter={formatter as Formatter}
                  prefix={<span className='text-greenDashboard text-xl'>VND</span>}
               />
               <span className='text-[#666666] font-bold text-xl'>Trung bình giá một đơn hàng</span>
            </div>
            <div className='item p-2 flex justify-center items-center flex-col   ]'>
               <Statistic
                  valueStyle={{ color: '#6a8d92', fontSize: '30px' }}
                  value={statisticData?.profitOfCurrentDay}
                  formatter={formatter as Formatter}
                  prefix={<span className='text-greenDashboard text-xl'>VND</span>}
               />
               <span className='text-[#666666] font-bold text-xl'>Lợi nhuận</span>
            </div>
         </div>
         <div className='mt-4'>
            <ChartArea options={revenueByDay} />
         </div>
         <div className='w-full xl:flex justify-start gap-4 items-center'>
            <div className='top-product bg-white p-4 xl:w-[50%] mt-4'>
               <ChartColumn options={top5ProductOptions} />
            </div>
            <div className='top-product bg-white p-4 w-full mt-4'>
               <ChartLine options={avgCustomerAndOrders} />
            </div>
         </div>
         <div className='w-full xl:flex justify-start gap-4 items-center'>
            <div className='top-product bg-white p-4 xl:w-[50%] mt-4'>
               <ChartColumn options={top5CategoryRevenue} />
            </div>
            <div className='top-product bg-white p-4 w-full  mt-4'>
               <ChartLine options={avgPriceAndUnitPerOrders} />
            </div>
         </div>
         <div className='w-full xl:flex gap-5 mt-4 items-center bg-white'>
            <div className='flex-1'>
               <Title className=' text-center' level={4}>
                  Sản phẩm có đánh giá tốt nhất
               </Title>
               <div className='flex justify-start gap-3 p-3'>
                  <div className='rounded-lg  w-[150px] h-[150px]'>
                     <img
                        className=' rounded-lg object-cover'
                        src={statisticData?.favoriteProductAndLessFavoriteProduct?.favoriteProduct.image}
                        alt=''
                     />
                  </div>
                  <div>
                     <h1 className='text-black'>
                        {statisticData?.favoriteProductAndLessFavoriteProduct?.favoriteProduct.productName}
                     </h1>
                     <h1>Trung bình số sao</h1>
                     <Rate
                        allowHalf
                        disabled
                        defaultValue={statisticData?.favoriteProductAndLessFavoriteProduct?.favoriteProduct.starCount}
                     />
                     <span>{statisticData?.favoriteProductAndLessFavoriteProduct?.favoriteProduct.starCount}</span>
                  </div>
               </div>
            </div>
            <Divider type='vertical' className='h-[200px]' />
            <div className='flex-1'>
               <Title className=' text-center' level={4}>
                  Sản phẩm có đánh giá tệ nhất
               </Title>
               <div className='flex justify-start gap-3 p-3'>
                  <div className='rounded-lg  w-[150px] h-[150px]'>
                     <img
                        className='rounded-lg object-cover'
                        src={statisticData?.favoriteProductAndLessFavoriteProduct?.lessFavoriteProduct.image}
                        alt=''
                     />
                  </div>
                  <div>
                     <h1>{statisticData?.favoriteProductAndLessFavoriteProduct?.lessFavoriteProduct.productName}</h1>
                     <h2>Trung bình số sao</h2>
                     <Rate
                        allowHalf
                        disabled
                        defaultValue={
                           statisticData?.favoriteProductAndLessFavoriteProduct?.lessFavoriteProduct.starCount
                        }
                     />
                     <span>{statisticData?.favoriteProductAndLessFavoriteProduct?.lessFavoriteProduct.starCount}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Dashboard;
