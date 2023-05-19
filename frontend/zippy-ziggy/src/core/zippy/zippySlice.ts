import { set } from 'react-hook-form';
import { HYDRATE } from 'next-redux-wrapper'; // next-redux-wrapper에서 HYDRATE를 불러옴
import { createSlice } from '@reduxjs/toolkit'; // reduxjs toolkit에서 createSlice를 불러옴
import { RootState } from '../store';

// 상태에 대한 타입을 정의
export interface ZippyState {
  isZippy: boolean;
}

// 초기 상태값 정의
const initialState: ZippyState = {
  isZippy: false,
};

// 액션에 대한 slice 생성
export const zippySlice = createSlice({
  name: 'zippy', // slice 이름
  initialState, // 초기 상태값
  reducers: {
    // 로그인 상태를 설정하는 액션
    setIsZippy(state, action) {
      return { ...state, isZippy: action.payload };
    },
  },
});

export const { setIsZippy } = zippySlice.actions; // 액션 생성자 함수와 셀렉터를 export함
export default zippySlice.reducer; // slice를 리듀서로 변환하여 export함
