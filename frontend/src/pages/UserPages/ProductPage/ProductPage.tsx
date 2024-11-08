import { useState, useEffect, createContext } from 'react';
import { ConfigProvider, Pagination } from 'antd';
import FillterProducts from './components/FillterProducts';
import SorterProduct from './components/SorterProduct';
import ShowProducts from './components/ShowProducts';
import { useGetAllExpandQuery } from '../../../services/product.service';
import { IProductExpanded } from '../../../interfaces/product';
import { IResponseHasPaginate } from '../../../interfaces/base';
import { Link, useLocation } from 'react-router-dom';
export interface IFilterFieldProductPage {
   field: {
      page: number;
      minPrice?: number;
      maxPrice?: number;
      category: string | null;
      origin?: string;
      maxPriceOfAllProducts?: number;
      minPriceOfAllProducts?: number;
      sort?: string;
      order?: 'asc' | 'desc';
      isSale?: any;
   };
   setfield?: (value: IFilterFieldProductPage) => void;
}
export interface ISort {
   sort?: string;
   order?: 'asc' | 'desc';
}
export const FilterFieldContext = createContext<IFilterFieldProductPage>({
   field: { page: 1, category: '' }
});

const ProductPage = () => {
   const location = useLocation();
   const searchParams = new URLSearchParams(location.search);
   const cate_id = searchParams.get('cate_id') != null ? searchParams.get('cate_id') : '';
   const [filter, setFilter] = useState<IFilterFieldProductPage>({
      field: { page: 1, category: cate_id },
      setfield: (value: IFilterFieldProductPage) => {
         setFilter(value);
      }
   });
   const [products, setProduct] = useState<IResponseHasPaginate<IProductExpanded>>();
   const [SortState, setSortState] = useState<ISort | undefined>();
   const [isSaleState, setIsSaleState] = useState<any>(true);
   const { data } = useGetAllExpandQuery({
      expand: true,
      limit: 9,
      page: filter.field.page,
      minPrice: filter.field.minPrice,
      maxPrice: filter.field.maxPrice,
      categoryId: filter.field.category,
      originId: filter.field.origin,
      sort: filter.field.sort,
      order: filter.field.order,
      isSale: isSaleState == true ? filter.field.isSale : ''
   });

   useEffect(() => {
      if (filter.setfield) {
         filter.setfield({
            ...filter,
            field: {
               ...filter.field,
               category: cate_id
            }
         });
      }
   }, [cate_id]);
   useEffect(() => {
      setIsSaleState(false);
      if (filter.setfield) {
         filter.setfield({
            ...filter,
            field: {
               ...filter.field,
               sort: SortState?.sort,
               order: SortState?.order
            }
         });
      }
   }, [SortState]);
   useEffect(() => {
      if (filter.setfield) {
         filter.setfield({
            ...filter,
            field: {
               ...filter.field,
               isSale: isSaleState
            }
         });
      }
   }, [isSaleState]);
   useEffect(() => {
      if (data?.body.data.length == 0) {
         if (filter.setfield) {
            filter.setfield({
               ...filter,
               field: {
                  ...filter.field,
                  page: 1
               }
            });
         }
      }
      setProduct(data);
      setFilter((prevFilter) => ({
         ...prevFilter,
         field: {
            ...prevFilter.field,
            maxPriceOfAllProducts: data?.body.maxPrice,
            minPriceOfAllProducts: data?.body.minPrice
         }
      }));
   }, [data]);

   const handleChangeSortState = (sort?: string, order?: 'asc' | 'desc') => {
      setSortState({ sort: sort, order: order });
   };
   const handleChangeIsSaleState = (value: boolean) => {
      setIsSaleState(value);
   };
   const handlePageChange = (pageNumber: number) => {
      setFilter({
         ...filter,
         field: {
            ...filter.field,
            page: pageNumber
         }
      });
   };
   return (
      <FilterFieldContext.Provider value={filter}>
         <>
            <div className='main bg-[#f8f8f8]'>
               <section className='section-breadcrumb py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2]'>
                  <div className=' mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start relative'>
                     <span>
                        <Link to='/'>Trang chủ</Link> / Sản phẩm
                     </span>
                  </div>
               </section>
               <section className='section-main lg:pb-[100px] md:pb-[80px] max-md:pb-[60px] border-b-[1px] border-[#e2e2e2]'>
                  <div className=' mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start relative'>
                     <div className='main-header-overlay lg:!hidden fixed hidden z-[10] left-0 right-0 top-0 bottom-0 bg-[rgba(0,0,0,0.5)]'></div>

                     <FillterProducts />

                     <div className=' px-[20px] max-md:px-0 main-content max-border-l-2 border-[#cccccc]   w-[75%] max-lg:w-[100%] '>
                        <div className='product-item mb-[30px]'>
                           <SorterProduct setSortState={handleChangeSortState} setIsSale={handleChangeIsSaleState} />
                           {products?.body?.data?.length ? (
                              <ShowProducts data={products} />
                           ) : (
                              <div className='text-center text-red-500 text-[20px] font-bold'>
                                 Không có sản phẩm nào phù hợp
                              </div>
                           )}
                        </div>
                        {products?.body?.data?.length ? (
                           <div className='pagination flex justify-center max-sm:!mb-[10px] mb-[35px]'>
                              <ConfigProvider
                                 theme={{
                                    components: {
                                       Pagination: {
                                          itemBg: '#51A55C',
                                          itemSize: 40,

                                          itemActiveBg: '#51A55C',
                                          colorTextPlaceholder: 'rgb(255, 99, 71)',
                                          colorPrimary: '#FFFFFF',
                                          colorPrimaryHover: '#FFFFFF'
                                       }
                                    }
                                 }}
                              >
                                 <Pagination
                                    onChange={(current) => handlePageChange(current)}
                                    responsive={true}
                                    showSizeChanger={false}
                                    defaultCurrent={1}
                                    total={data?.body.pagination.totalItems}
                                 />
                              </ConfigProvider>
                           </div>
                        ) : (
                           ''
                        )}
                     </div>
                  </div>
               </section>
            </div>
         </>
      </FilterFieldContext.Provider>
   );
};
export default ProductPage;
