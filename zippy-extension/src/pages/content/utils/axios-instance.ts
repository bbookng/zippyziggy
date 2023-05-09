import axios, { AxiosRequestConfig } from 'axios';
import { ZIPPY_API_URL } from '@pages/constants';
import { setupInterceptorsTo, tokenInterceptor } from '@pages/content/utils/interceptors';

// 토큰이 필요없는 axios
const axiosApi = (url: string, options: AxiosRequestConfig = {}) => {
  const instance = axios.create({ baseURL: url, ...options, withCredentials: true });
  instance.interceptors.response.use(
    (response) => {
      // 토큰이 있는 경우 저장
      if (response.headers.authorization) {
        const accessToken = response.headers.authorization;
        localStorage.setItem('accessToken', accessToken);
      }
      return response;
    },
    (error) => {
      // 에러 처리
      return Promise.reject(error);
    }
  );
  return setupInterceptorsTo(instance);
};

// 토큰이 필요한 axios
const axiosAuthApi = (url: string, options: AxiosRequestConfig = {}) => {
  const instance = axios.create({
    baseURL: url,
    withCredentials: true,
    ...options,
  });
  // 토큰 주입
  tokenInterceptor(instance);
  return setupInterceptorsTo(instance);
};

// 토큰이 필요없는 axios 요청
export const api = axiosApi(ZIPPY_API_URL);

// 토큰이 필요한 axios 요청
export const authApi = axiosAuthApi(ZIPPY_API_URL);
