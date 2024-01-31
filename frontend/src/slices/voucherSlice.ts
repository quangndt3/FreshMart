import { createSlice } from '@reduxjs/toolkit';

export interface IVoucher{
   _id:string;
    title: string,
    code: string,
    percent: number,
    quantity: number,
    dateEnd: string,
    dateStart: string,
    status: boolean,
    maxReduce?:number,
    miniMumOrder?:number,
    isValidDateEnd:boolean,
    isValidDateStart:boolean,
}
const initState:  IVoucher ={
      _id:"",
    title: "",
    code: "",
    percent: 0,
    quantity: 0,
    dateEnd: "",
    dateStart: "",
    status: false,
    isValidDateEnd:true,
    isValidDateStart:true,
 }

const voucherSlice = createSlice({
   name: 'vouchers',
   initialState: initState,
   reducers: {
      saveVoucher: (state, action) => {
         console.log(action.payload);
         
         state._id = action.payload._id;
         state.title = action.payload.title;
         state.code = action.payload.code;
         state.percent = action.payload.percent;
         state.quantity = action.payload.quantity;
         state.dateEnd = action.payload.dateEnd;
         state.dateStart = action.payload.dateStart;
         state.status = action.payload.status;
         action.payload.miniMumOrder?state.miniMumOrder = action.payload.miniMumOrder:""
         action.payload.maxReduce?state.maxReduce  = action.payload.maxReduce:""
      },
      remoteVoucher: () => {
         return initState;
      },
   }
});

export const { saveVoucher,remoteVoucher  } = voucherSlice.actions;

export default voucherSlice.reducer;