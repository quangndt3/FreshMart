import { createSlice } from '@reduxjs/toolkit';

export interface IAuth {
   reload: boolean;
}
const initState: IAuth = {
   reload: false,
};

const noticeReducer = createSlice({
   name: 'notice',
   initialState: initState,
   reducers: {
      setState: (state) => {
         state.reload = !state.reload;
      }
   }
});

export const { setState } = noticeReducer.actions;

export default noticeReducer.reducer;
