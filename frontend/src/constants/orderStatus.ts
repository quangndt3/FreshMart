export const SUCCESS_ORDER = 'Giao hàng thành công';
export const PENDING_ORDER = 'Chờ xác nhận';
export const SHIPPING_ORDER = 'Đang giao hàng';
export const FAIL_ORDER = 'Đã hủy';
export const DONE_ORDER = 'Đơn hàng hoàn thành';

//đừng động vào cái mảng này nhé :)
export const ORDER_OF_STATUS = [
   { status: PENDING_ORDER, color: '#e3dc1c' },
   { status: SHIPPING_ORDER, color: '#e77e18' },
   { status: SUCCESS_ORDER, color: '#80b235' }
];

export const ORDER_STATUS_FULL = [
   ...ORDER_OF_STATUS,
   {
      status: FAIL_ORDER,
      color: '#E31C1C'
   },
   {
      status: DONE_ORDER,
      color: '#ac53aa'
   }
];
