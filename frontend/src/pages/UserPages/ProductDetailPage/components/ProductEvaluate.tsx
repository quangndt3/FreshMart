import { ConfigProvider, Rate, Spin } from 'antd';
import { useGetEvaluationByProductIdQuery } from '../../../../services/evaluation.service';
import { IEvaluationFull } from '../../../../interfaces/evaluation';
import { formatStringToDate } from '../../../../helper';

interface IProps {
   productId: string;
}
const ProductEvaluate = ({ productId }: IProps) => {
   const { data, isLoading } = useGetEvaluationByProductIdQuery(productId);
   return (
      <div>
         {!isLoading && data ? (
            <>
               <div className='review-header mb-[25px]'>
                  <span className='review-title text-[20px] text-[#333333] font-bold'>Đánh giá của khách hàng</span>

                  <div className='product-rating mt-[25px] mb-[12px]'>
                     <div className='rate flex items-center'>
                        <ConfigProvider
                           theme={{
                              token: {
                                 controlHeightLG: 34
                              }
                           }}
                        >
                           <Rate
                              allowHalf
                              disabled
                              defaultValue={
                                 data.body.data.reduce((current, evaluation) => (current += evaluation.rate), 0) /
                                 data.body.data.length
                              }
                           />
                        </ConfigProvider>
                     </div>
                     <p className='review-summary mt-[8px] text-[18px]'>Dựa trên {data?.body.data.length} đánh giá</p>
                  </div>
               </div>
               <div className='list-review'>
                  {data.body.data.map((evaluation: IEvaluationFull, index: number) => {
                     return (
                        <div key={index} className='revite-item pt-[30px] pb-[30px] border-t-[1px]'>
                           <div className='rate flex items-center'>
                              <ConfigProvider
                                 theme={{
                                    token: {
                                       controlHeightLG: 34
                                    }
                                 }}
                              >
                                 <Rate allowHalf disabled defaultValue={evaluation.rate} />
                              </ConfigProvider>
                           </div>
                           <p className='username mt-[9px] font-bold text-[#333333]'>
                              {evaluation.userName != null ? evaluation.userName : evaluation.userId?.userName}
                           </p>
                           <p className='date mt-[5px] text-[#333333] '>{formatStringToDate(evaluation.createdAt)}</p>
                           <p
                              dangerouslySetInnerHTML={{
                                 __html: evaluation.isReviewVisible ? evaluation.content : 'Nội dung đã bị ẩn '
                              }}
                              className='review-text mt-[18px]'
                           ></p>
                        </div>
                     );
                  })}
               </div>
            </>
         ) : (
            <Spin> </Spin>
         )}
      </div>
   );
};

export default ProductEvaluate;
