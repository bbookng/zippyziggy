import { HYDRATE } from 'next-redux-wrapper';
import { createSlice } from '@reduxjs/toolkit';

// 상태에 대한 타입을 정의
interface CounterState {
  value: number;
}

// 초기 상태값 정의
const initialState: CounterState = {
  value: 10,
};

// 액션에 대한 slice 생성
const counterSlice = createSlice({
  name: 'counter', // slice 이름
  initialState, // 초기 상태값
  reducers: {
    // 숫자를 1 증가시키는 액션
    increment: (state) => {
      return {
        ...state,
        value: state.value + 1,
      };
    },
    // 숫자를 1 감소시키는 액션
    decrement: (state) => {
      return {
        ...state,
        value: state.value - 1,
      };
    },
  },

  /** 페이지 이동 시 상태 초기화가 필요한 경우 추가해야 함 */
  extraReducers: {
    // HYDRATE 액션이 실행되면 counter 슬라이스에 대한 데이터만 가져와서 state를 업데이트함
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.counter,
      };
    },
  },
});

const { actions, reducer: counterReducer } = counterSlice;
export const { increment, decrement } = actions; // 액션 생성자 함수와 리듀서를 export함
export default counterReducer; // slice를 리듀서로 변환하여 export함
