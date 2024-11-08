
import { Link } from "react-router-dom";
import { useGetProductSoldDescQuery } from "../../../../services/product.service";
import SlideBestProduct from "./SlideBestProduct";

const BestSellerProducts = () => {
   const {data} = useGetProductSoldDescQuery()
   return (
      <div>
         <section className='section-best-product bg-[#f8f8f8] xl:py-[100px] lg:py-[80px] max-lg:py-[60px]'>
            <div className='best-product-header text-center xl:mb-[70px] lg:mb-[40px] max-lg:mb-[30px]'>
               <p className='best-product-title text-[#51A55C] font-bold mb-[10px]'>BỘ SƯU TẬP TỐT NHẤT</p>
               <p className=' text-[#333333] font-bold  lg:text-[28px] md:text-[23px]  max-md:text-[20px]'>
                  Top sản phẩm bán chạy
               </p>
            </div>
            <div className='best-product-content'>
               <div id='slide-best-pr'>
               <SlideBestProduct products={data?.body.data}></SlideBestProduct>
               </div>
               <div className='link-to-product-page text-center mt-[40px] '>
                  <Link
                     className='text-white px-[40px] py-[18px] bg-[#51A55C] hover:bg-[#7aa32a] transition-colors duration-500 rounded-[50px] text-center'
                     to='/collections'
                  >
                     XEM TẤT CẢ SẢN PHẨM
                  </Link>
               </div>
            </div>
         </section>
      </div>
   );
};

export default BestSellerProducts;
