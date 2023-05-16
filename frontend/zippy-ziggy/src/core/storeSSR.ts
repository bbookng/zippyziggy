// configureStore - 여러 store의 reducer를 묶어주기 위해서 필요
// ThunkAction - Typescript를 위한 redux-thunk typing
// Action - Typescript를 위한 action typing
import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { userSlice } from './user/userSlice';

// next-redux-wrapper

const makeStore = () =>
  configureStore({
    reducer: {
      [userSlice.name]: userSlice.reducer,
    },
    devTools: true,
  });

// const makeStore: () => EnhancedStore<{
//    auth: AuthState;
// }, AnyAction, [ThunkMiddleware<{
//     auth: AuthState;
// }, AnyAction, undefined>]>
// intellisense의 makeStore의 타입은 다음과 같다.
export type AppStore = ReturnType<typeof makeStore>;

// 아래 ThunkAction에서 사용하기 위한 store.getState를 부른 값.
export type AppState = ReturnType<AppStore['getState']>;

// ThunkAction은 4가지 인자를 사용하는데,
// 1. ReturnType thunk 함수 자체의 returntype. Thunk는 많은 경우 비동기를 위해 사용하고, 자기 자신은 리턴하는 경우가 잘 없으므로 void로 일반적으로 설정한다고 한다.
// 2. 해당 reducer의 state = AppState
// 3. 추가적인 인자 extraArg 현재 상태에서는 unknown
// 4. 그리고 위 slice reducer에서 정의한 Action이다.
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

// 끝으로, createWrapper를 통해 위 makeStore를 HOC로 덮어준다.

export const wrapper2 = createWrapper<AppStore>(makeStore);
