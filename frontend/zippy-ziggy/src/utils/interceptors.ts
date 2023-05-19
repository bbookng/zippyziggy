import { http, serverUrl, httpToken, httpForm, httpAuthForm } from '@/lib/http';
import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import logOnDev from './logging';
// import URLS from '@/constants/url';

const tokenInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const axiosConfig = config;
      // 토큰을 얻어오는 함수
      const token = localStorage.getItem('accessToken');
      if (token) {
        axiosConfig.headers.Authorization = `Bearer ${token}`;
      }

      return axiosConfig;
    },
    (error: AxiosError) => Promise.reject(error.response)
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },

    async (error) => {
      const { config } = error;
      // console.log(error);
      const originalRequest = config;
      if (error.response.status === 401) {
        // console.log('토큰 재발급 요청');
        const res = await httpToken.post(`${serverUrl}/api/members/refresh/token`);
        if (res.status) {
          localStorage.setItem('accessToken', res?.headers?.authorization);
          originalRequest.headers.Authorization = `Bearer ${res?.headers?.authorization}`;
          return http(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

const tokenFormInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const axiosConfig = config;
      // 토큰을 얻어오는 함수
      const token = localStorage.getItem('accessToken');
      axiosConfig.headers.Authorization = `Bearer ${token}`;
      return axiosConfig;
    },
    (error: AxiosError) => Promise.reject(error.response)
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },

    async (error) => {
      const { config } = error;
      // console.log(error);
      const originalRequest = config;
      if (error.response.status === 401) {
        // console.log('토큰 재발급 요청');
        const res = await httpToken.post(`${serverUrl}/api/members/refresh/token`);
        if (res.status) {
          localStorage.setItem('accessToken', res?.headers?.authorization);
          originalRequest.headers.Authorization = `Bearer ${res?.headers?.authorization}`;
          return httpForm(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  logOnDev.info(
    `🙏 %c[API] ${config.method?.toUpperCase()} ${config.url} | [::request::]`,
    'color: #229910'
  );
  logOnDev.dir(config);
  logOnDev.log('', '');
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  logOnDev.error(
    `💥 [API] ${error.config?.method?.toUpperCase()} ${error.config?.url} | [::request error::]`
  );
  logOnDev.dir(error);
  logOnDev.log('', '');
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  logOnDev.info(
    `👌 %c [API] ${response.config.method?.toUpperCase()} ${response.config.url} | [::response::] ${
      response.status
    }`,
    'color: #13ce29'
  );
  logOnDev.dir(response);
  logOnDev.log('', '');
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  logOnDev.error(
    `💥 [API] ${error.config?.method?.toUpperCase()} ${error.config?.url} | [::response error::]`
  );
  logOnDev.dir(error);
  logOnDev.log('', '');
  return Promise.reject(error);
};

const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

export { setupInterceptorsTo, tokenInterceptor, tokenFormInterceptor };
