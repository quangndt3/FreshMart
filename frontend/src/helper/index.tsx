/* eslint-disable react-refresh/only-export-components */
import { ORDER_STATUS_FULL } from '../constants/orderStatus';

export const formatStringToDate = (isoString: string) => {
   const date = new Date(isoString);
   //cai getMonth tra ve thang tu 0-11 (cdcm :))
   const RETURN_MONTH_FROM_0_TO_11 = 1;
   return `${date.getDate()}/${date.getMonth() + RETURN_MONTH_FROM_0_TO_11}/${date.getFullYear()}`;
};

export const uppercaseFirstLetter = (string: string) => {
   return string.charAt(0).toUpperCase() + string.slice(1);
};

export const transformCurrency = (value: string | number) => {
   const vndLocale = Intl.NumberFormat('vn', { style: 'currency', currency: 'vnd' });
   return vndLocale.format(Number(value));
};

export const transformStatusOrder = (status: string) => {
   let returnValue = { status: '', color: '' };
   ORDER_STATUS_FULL.forEach((rawStatus) => {
      if (rawStatus.status.toLowerCase() === status) {
         returnValue = rawStatus;
      }
   });
   return returnValue;
};

export const formatCharacterWithoutUTF8 = (string: string) => {
   const dau = 'àảãáạăằẳẵắặâầẩẫấậèẻẽéẹêềểễếệìỉĩíịòỏõóọôồổỗốộơờởỡớợùủũúụưừửữứựỳỷỹýỵđ';
   const khongDau = 'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooouuuuuuuuuuuyyyyyd';
   return string.replace(/[\u00C0-\u1EEF]/g, function (match) {
      const index = dau.indexOf(match);
      return khongDau.charAt(index) || match;
   });
};

export const formatMstoDate = (ms: number) => {
   const epoch = new Date(0);

   // Tính thời gian
   const resultDate = new Date(epoch.getTime() + ms);

   // Mảng các tên thứ trong tuần
   const daysOfWeek = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];

   // Lấy thông tin thứ, ngày và tháng
   const dayOfWeek = daysOfWeek[resultDate.getUTCDay()];
   const day = resultDate.getUTCDate();
   const month = resultDate.getUTCMonth() + 1; // Tháng bắt đầu từ 0, cộng thêm 1
   const year = resultDate.getUTCFullYear();
   const hours = resultDate.getUTCHours();
   const minutes = resultDate.getUTCMinutes();

   return { dayOfWeek, day, month, year, hours, minutes };
};

export const CountExpirationDate = (value: string) => {
   const expired: Date = new Date(value);
   const now: Date = new Date();
   const remainingTime: number = expired.getTime() - now.getTime();
   const day: number = 24 * 60 * 60 * 1000;
   const formatDay: number = Math.floor(remainingTime / day);
   return formatDay;
};
