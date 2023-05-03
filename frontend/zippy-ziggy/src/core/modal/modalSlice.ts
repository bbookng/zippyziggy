import { HYDRATE } from 'next-redux-wrapper'; // next-redux-wrapper에서 HYDRATE를 불러옴
import { createSlice } from '@reduxjs/toolkit'; // reduxjs toolkit에서 createSlice를 불러옴
import { RootState } from '../store';

// 상태에 대한 타입을 정의
export interface ModalState {
  isLoginModal: boolean;
  beforeUrl: string;
}

// 초기 상태값 정의
const initialState: ModalState = {
  isLoginModal: false,
  beforeUrl: '',
};

// 액션에 대한 slice 생성
export const modalSlice = createSlice({
  name: 'modal', // slice 이름
  initialState, // 초기 상태값
  reducers: {
    // 로그인 상태를 설정하는 액션
    setIsLoginModal(state, action) {
      return { ...state, isLoginModal: action.payload };
    },
    setBeforeUrl(state, action) {
      return { ...state, beforeUrl: action.payload };
    },
  },

  /** 페이지 이동 시 상태 초기화가 필요한 경우 추가해야 함 */
  extraReducers: {
    // HYDRATE 액션이 실행되면 modal 슬라이스에 대한 데이터만 가져와서 state를 업데이트함
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.modal,
      };
    },
  },
});

export const { setIsLoginModal, setBeforeUrl } = modalSlice.actions; // 액션 생성자 함수와 셀렉터를 export함
export default modalSlice.reducer; // slice를 리듀서로 변환하여 export함
