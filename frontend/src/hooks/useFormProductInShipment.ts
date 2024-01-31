import { useState, useEffect } from 'react';
import { ProductInput } from '../interfaces/shipment';
import { message } from 'antd';

type Props = {
   defaultProductData?: ProductInput[];
};

const useFormProductInShipment = ({ defaultProductData }: Props) => {
   const [productDataSubmit, setProductData] = useState<ProductInput[]>([]);
   useEffect(() => {
      if (!defaultProductData) return;
      setProductData(defaultProductData!);
   }, [defaultProductData]);
   const checkDuplicateItemInArray = (idProduct: string) => {
      return productDataSubmit.filter((item) => item.idProduct === idProduct);
   };
   const dataSubmitFactory = (data: ProductInput) => {
      if (checkDuplicateItemInArray(data.idProduct).length === 1) {
         message.warning('Hãy hoàn thành sản phẩm hiện tại');
         setProductData((prev) => {
            prev.splice(
               productDataSubmit.indexOf(productDataSubmit.find((item) => item.idProduct === data.idProduct)!),
               1,
               data
            );
            return prev;
         });
         return;
      }
      if (data.idProduct === '' && productDataSubmit.filter((item) => item.idProduct === '').length === 1) {
         message.warning('Hãy hoàn thành sản phẩm hiện tại');
         return;
      }
      const notEmptyProduct = productDataSubmit.filter((item) => item.idProduct !== '');
      setProductData([...notEmptyProduct, data]);
   };

   const removeProduct = (idProduct: string) => {
      setProductData((prev) => [...prev.filter((item) => item.idProduct !== idProduct)]);
   };

   return { productDataSubmit, dataSubmitFactory, removeProduct };
};

export default useFormProductInShipment;
