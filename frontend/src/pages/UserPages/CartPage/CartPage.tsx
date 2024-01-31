import { Link } from 'react-router-dom';
import CheckOut from './components/CheckOut';
import ProductsInCart from './components/ProductsInCart';

const CartPage = () => {
   return (
      <>
         <div className='main'>
            <section className='section-breadcrumb py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2]'>
               <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start relative'>
                  <span>
                     <Link to='/'>Trang chủ </Link> / Giỏ hàng
                  </span>
               </div>
            </section>
            <section className='section-cart lg:py-[100px] md:py-[80px] max-md:py-[60px] relative '>
               <div className='cont cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px]'>
                  <div className='cart-page-wrap mx-[-15px] flex max-lg:flex-wrap items-start  '>
                     <div className='cart-content  xl:w-[75%] lg:w-[66.67%] max-lg:w-full px-[15px]'>
                        <ProductsInCart />
                     </div>
                     <div className='cart-header lg:sticky xl:top-[110px] max-xl:top-[80px] px-[15px] xl:w-[25%] lg:w-[33.33%] max-lg:w-full max-lg:mt-[30px]'>
                        <div className='cart-total-wrap p-[20px] border-[1px] border-[#e2e2e2]'>
                           <CheckOut />
                        </div>
                     </div>
                  </div>
               </div>
            </section>
         </div>
      </>
   );
};
export default CartPage;
