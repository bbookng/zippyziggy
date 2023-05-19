import { HYDRATE } from 'next-redux-wrapper'; // next-redux-wrapper에서 HYDRATE를 불러옴
import { createSlice } from '@reduxjs/toolkit'; // reduxjs toolkit에서 createSlice를 불러옴

// 상태에 대한 타입을 정의
export interface PromptState {
  pageRef: number;
  categoryRef: string;
  sortRef: string;
  keywordRef: string;
}

// 초기 상태값 정의
const initialState: PromptState = {
  pageRef: 0,
  categoryRef: 'ALL',
  sortRef: 'likeCnt',
  keywordRef: '',
};

// 액션에 대한 slice 생성
export const promptSlice = createSlice({
  name: 'prompt', // slice 이름
  initialState, // 초기 상태값
  reducers: {
    setSearchParams(state, action) {
      return {
        ...state,
        categoryRef: action.payload.category,
        sortRef: action.payload.sort,
        keywordRef: action.payload.keyword,
        pageRef: action.payload.page,
      };
    },
    setPageRef(state, action) {
      return { ...state, pageRef: action.payload };
    },
    setPageReset() {
      return { ...initialState };
    },
  },

  /** 페이지 이동 시 상태 초기화가 필요한 경우 추가해야 함 */
  extraReducers: {
    // HYDRATE 액션이 실행되면 prompt 슬라이스에 대한 데이터만 가져와서 state를 업데이트함
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.prompt,
      };
    },
  },
});

export const { setPageReset, setPageRef, setSearchParams } = promptSlice.actions; // 액션 생성자 함수와 셀렉터를 export함
export default promptSlice.reducer; // slice를 리듀서로 변환하여 export함
