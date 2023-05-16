import { set } from 'react-hook-form';
import { HYDRATE } from 'next-redux-wrapper'; // next-redux-wrapper에서 HYDRATE를 불러옴
import { createSlice } from '@reduxjs/toolkit'; // reduxjs toolkit에서 createSlice를 불러옴
import { RootState } from '../store';

// 상태에 대한 타입을 정의
export interface UserState {
  isLogin: boolean;
  nickname: string;
  profileImg: string;
  userUuid: string;
  noticeCount: number;
  accessToken: string;
}

// 초기 상태값 정의
const initialState: UserState = {
  isLogin: false,
  nickname: '',
  profileImg: '',
  userUuid: '',
  noticeCount: 0,
  accessToken: '',
};

// 액션에 대한 slice 생성
export const userSlice = createSlice({
  name: 'user', // slice 이름
  initialState, // 초기 상태값
  reducers: {
    // 로그인 상태를 설정하는 액션
    setIsLogin(state, action) {
      return { ...state, isLogin: action.payload };
    },
    setNickname(state, action) {
      return { ...state, nickname: action.payload };
    },
    setProfileImg(state, action) {
      return { ...state, profileImg: action.payload };
    },
    setUserUuid(state, action) {
      return { ...state, userUuid: action.payload };
    },
    setNoticeCount(state, action) {
      return { ...state, noticeCount: action.payload };
    },
    setAccessToken(state, action) {
      return { ...state, accessToken: action.payload };
    },
    setUserReset(state) {
      return { ...initialState };
    },
  },

  /** 페이지 이동 시 상태 초기화가 필요한 경우 추가해야 함 */
  extraReducers: {
    [HYDRATE]: (state: UserState, action: { payload: any; type: string }) => {
      return {
        ...state,
        ...action.payload.user,
      };
    },
  },
});

export const {
  setIsLogin,
  setNickname,
  setProfileImg,
  setUserUuid,
  setUserReset,
  setNoticeCount,
  setAccessToken,
} = userSlice.actions; // 액션 생성자 함수와 셀렉터를 export함
export const selectUserState = (state: RootState) => state.user;
export default userSlice.reducer; // slice를 리듀서로 변환하여 export함
