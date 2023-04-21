import { HYDRATE } from 'next-redux-wrapper';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Type for our state
export interface AuthState {
  authState: boolean;
}
// Initial state
const initialState: AuthState = {
  authState: false,
};
// Actual Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action to set the authentication status
    setAuthState(state, action) {
      state.authState = action.payload;
    },
  },

  /** 페이지 이동 시 상태 초기화가 필요한 경우 추가해야 함 */
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.auth,
      };
    },
  },
});

export const { setAuthState } = authSlice.actions;
export const selectAuthState = (state: RootState) => state.auth.authState;
export default authSlice.reducer;
