import { useState, useEffect } from 'react';
import { Drawer, Input, Spin, Image, Tag } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { IProduct } from '../../../../interfaces/product';
import { AiOutlineClose } from 'react-icons/ai';
import { useSearchProductMutation } from '../../../../services/product.service';
import { Link } from 'react-router-dom';
import useDebounce from '../../../../hooks/useDebounce';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SearchFilter = ({ children }: any) => {
   const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
   const [searchValue, setSearchValue] = useState<string>('');
   const [search, { data, isLoading }] = useSearchProductMutation();
   const [items, setItems] = useState<IProduct[]>([]);
   const [searchHistory, setSearchHistory] = useState<string[]>([]);
   const searchDebounce = useDebounce(searchValue, 500);
   // console.log(data?.body?.data);

   useEffect(() => {
      const savedSearchHistory = localStorage.getItem('searchHistory');
      if (savedSearchHistory) {
         setSearchHistory(JSON.parse(savedSearchHistory));
      }
   }, []);

   useEffect(() => {
      if (!isLoading && data?.body?.data) {
         setItems(data?.body?.data);
      }
   }, [data, isLoading]);

   const showDrawer = () => {
      setIsDrawerOpen(true);
   };

   const onClose = () => {
      setItems([]);
      setSearchValue('');
      setIsDrawerOpen(false);
   };
   useEffect(() => {
      handleSearch(undefined);
   }, [searchDebounce]);
   const handleSearch = (e: any | undefined) => {
      if (!searchDebounce || searchDebounce.trim() === '') {
         setItems([]);
      } else {
         if (e && e.key === 'Enter') {
            const newSearchHistory = [searchDebounce, ...searchHistory];
            // Lọc các từ khóa trùng lặp
            const uniqueSearchHistory = newSearchHistory.filter((item, index) => {
               return newSearchHistory.indexOf(item) === index;
            });
            // Giới hạn lịch sử tìm kiếm tối đa 5 mục
            const histories = uniqueSearchHistory.filter((_, index) => index < 5);
            setSearchHistory(histories);
            localStorage.setItem('searchHistory', JSON.stringify(histories));
         }

         search(`${searchDebounce}`);
      }
   };

   const handleRemoveKeyword = (keyword: string) => {
      const newSearchHistory = searchHistory.filter((item) => item !== keyword);
      setSearchHistory(newSearchHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newSearchHistory));
   };

   const handleKeywordClick = (keyword: string) => {
      setSearchValue(keyword);
   };

   return (
      <>
         <span onClick={showDrawer}>{children}</span>
         <Drawer title='Tìm kiếm sản phẩm' placement='top' closable={true} onClose={onClose} visible={isDrawerOpen}>
            <div className='form-search relative'>
               <Input
                  onKeyDown={handleSearch}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder='Tìm kiếm sản phẩm...'
                  className='w-full outline-none border-b-[1px] border-[#e2e2e2] py-[10px] text-[#6f6f6f]'
               />
               <SearchOutlined className='border-none absolute right-10 translate-y-[50%] bottom-[50%] text-[20px] text-black'></SearchOutlined>
            </div>
            <div className='items-center flex flex-wrap my-5 gap-5'>
               <h2 className='text-xl text-black font-bold '>Lịch sử tìm kiếm:</h2>
               <div className='flex flex-wrap gap-5'>
                  {searchHistory.map((keyword, index) => (
                     <div key={index} className='search-history flex justify-center items-center cursor-pointer'>
                        <Tag color='green' className='px-5 py-1' onClick={() => handleKeywordClick(keyword)}>
                           <span className=' transition-all ease-in duration-75 rounded-md group-hover:bg-opacity-0'>
                              {keyword}
                           </span>
                        </Tag>
                        <span className='text-red-400' onClick={() => handleRemoveKeyword(keyword)}>
                           <AiOutlineClose />
                        </span>
                     </div>
                  ))}
               </div>
            </div>
            <div className='flex  flex-col '>
               {isLoading ? (
                  <div className='flex  w-full'>
                     <Spin />
                  </div>
               ) : (
                  items.map((item: IProduct, index: number) => (
                     <div
                        className='py-4 flex items-center gap-3 cursor-pointer '
                        key={index}
                        onClick={() => setIsDrawerOpen(false)}
                     >
                        <Image height={120} src={item.images[0].url} width={120} className='rounded-lg' />
                        <Link to={`/products/${item._id}`}>
                           <h2 className='font-bold text-black text-2xl text-greenP800 '>{item.productName}</h2>
                        </Link>
                        <h1 className='text-lg font-semibold'>
                           {item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                        </h1>
                     </div>
                  ))
               )}
            </div>
         </Drawer>
      </>
   );
};

export default SearchFilter;
