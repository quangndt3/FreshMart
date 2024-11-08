import '../../../css/productdetailpage.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetOneProductQuery, useGetRelatedProductsQuery } from '../../../services/product.service';
import ProductDescriptionTab from './components/ProductDescriptionTab';
import SlideBestProduct from '../HomePage/components/SlideBestProduct';
import ProductInfo from './components/Productinfo';
import { useEffect } from 'react';

const ProductDetail = () => {
   const { id } = useParams();
   const { data: oneProductData,error } = useGetOneProductQuery(id!, { skip: !id });
   const navigate =useNavigate()
   useEffect(()=>{
      if(error){
         navigate("/notFound");
      }
   },[error])
   const objId = {
      idCategory: oneProductData?.body.data.categoryId._id,
      idProduct: id
   };
   const { data: relatedProductsData } = useGetRelatedProductsQuery(objId!, {
      skip: !objId.idCategory || !objId.idProduct
   });
   return (
      <>
         <div className='main'>
            <section className='section-breadcrumb py-[15px] bg-[#f7f7f7] border-b-[1px] border-[#e2e2e2] '>
               <div className='cont mx-auto px-[15px] 3xl:w-[1380px] 2xl:w-[1320px] xl:w-[1170px]   lg:w-[970px]  md:w-[750px] flex max-lg:flex-wrap items-start relative'>
                  <span>
                     <Link to='/'>Trang chủ / {oneProductData?.body.data.productName}</Link>
                  </span>
               </div>
            </section>
            <section className='section-product-detail-page lg:relative lg:py-[100px] md:py-[80px] max-md:py-[60px] border-b-[1px] border-[#e2e2e2]'>
               <ProductInfo product_info={oneProductData?.body.data}></ProductInfo>
            </section>
            <section className='section-description  lg:py-[100px] md:py-[80px] max-md:py-[60px]'>
               {oneProductData && (
                  <ProductDescriptionTab
                     productId={oneProductData?.body.data._id}
                     desc={oneProductData?.body.data.desc}
                     originName={oneProductData?.body.data ? oneProductData?.body.data.originId?.name : ''}
                  ></ProductDescriptionTab>
               )}
            </section>
            {!relatedProductsData?.body?.data?.length||relatedProductsData?.body?.data?.length > 0 &&    <section className='section-related-product bg-[#f8f8f8]  max-lg:py-[60px] border-b'>
               <div className='related-product-header text-center xl:mb-[70px] lg:mb-[40px] max-lg:mb-[30px]'>
                  <p className=' text-[#333333] font-bold  lg:text-[28px] md:text-[23px]  max-md:text-[20px]'>
                     Sản phẩm liên quan
                  </p>
               </div>
               <div className='related-product-content'>
                  <div className='slide-related-product  mt-[40px]'>
                     <SlideBestProduct products={relatedProductsData?.body.data}></SlideBestProduct>
                  </div>
               </div>
            </section>}
         
         </div>
      </>
   );
};
export default ProductDetail;
