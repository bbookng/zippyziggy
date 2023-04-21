import {
  combineReducers,
  configureStore,
  PayloadAction,
  ThunkAction,
  Action,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import { authSlice } from './auth/authSlice';
import counterReducer from './auth/counterSlice';

const persistConfig = { key: 'root', version: 1, storage }; //  whitelist: ['common']

const reducer = (state: any, action: PayloadAction<any>) => {
  return combineReducers({
    counter: counterReducer,
    [authSlice.name]: authSlice.reducer,
  })(state, action);
};
const persistedReducer = persistReducer(persistConfig, reducer);

export function makeStore() {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(logger),
  });
}

const store = makeStore();

export const wrapper = createWrapper<AppStore>(makeStore, {
  debug: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action>;
export default store;
