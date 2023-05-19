// Redux를 사용하여 상태 관리를 구현하는 코드입니다.
import {
  combineReducers,
  configureStore,
  PayloadAction,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit'; // 필요한 라이브러리를 불러옵니다.
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import storage from 'redux-persist/lib/storage'; // 로컬 스토리지를 이용하여 상태를 저장합니다.
import { persistReducer, persistStore } from 'redux-persist';
import { userSlice } from './user/userSlice'; // userSlice 모듈을 불러옵니다.
import { modalSlice } from './modal/modalSlice';
import { zippySlice } from './zippy/zippySlice';
import { promptSlice } from './prompt/promptSlice';
import counterReducer from './auth/counterSlice'; // counterSlice 모듈을 불러옵니다.

const persistConfig = { key: 'root', version: 1, storage }; // redux-persist 설정을 합니다.

const reducer = (state: any, action: PayloadAction<any>) => {
  // 리듀서를 합칩니다.
  return combineReducers({
    [userSlice.name]: userSlice.reducer, // userSlice 모듈을 사용하여 인증 정보를 관리합니다.
    [modalSlice.name]: modalSlice.reducer,
    [promptSlice.name]: promptSlice.reducer,
    [zippySlice.name]: zippySlice.reducer,
  })(state, action);
};

const persistedReducer = persistReducer(persistConfig, reducer); // 리듀서를 redux-persist로 감싸서 지속 가능한 상태로 만듭니다.

export function makeStore() {
  // 스토어를 생성합니다.
  return configureStore({
    reducer: persistedReducer, // redux-persist로 감싼 리듀서를 사용합니다.
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }), // 미들웨어로 로그 출력을 추가합니다.
  });
}

const store = makeStore(); // 스토어를 생성합니다.

// export const wrapper = createWrapper<AppStore>(makeStore, {
//   debug: process.env.NODE_ENV === 'development', // 개발환경에서만 디버깅 모드를 사용합니다.
// });

export const persistor = persistStore(store); // 스토어를 지속 가능한 상태로 만듭니다.
export type AppStore = ReturnType<typeof makeStore>; // 스토어 타입을 지정합니다.
export type RootState = ReturnType<typeof store.getState>; // RootState 타입을 지정합니다.
export type AppDispatch = typeof store.dispatch; // AppDispatch 타입을 지정합니다.
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>; // AppThunk 타입을 지정합니다.
export default store; // 스토어를 내보냅니다.
