import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
/* eslint-disable no-useless-concat */
import { ZIPPY_API_URL } from '@pages/constants';
import { api } from './axios-instance';

const tokenInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      const axiosConfig = config;
      // 토큰을 얻어오는 함수
      const token = localStorage.getItem('accessToken');
      axiosConfig.headers = new AxiosHeaders({
        Authorization: token,
      });
      return axiosConfig;
    },
    (error: AxiosError) => Promise.reject(error.response)
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },

    async (error) => {
      const {
        config,
        response: { status },
      } = error;

      if (status === 401) {
        const originalRequest = config;

        // 토큰 refresh 요청
        const data = await axios.get(`${ZIPPY_API_URL}/users/refresh`);

        // 요청 후 새롭게 받은 accToken을 저장
        const {
          data: {
            data: { accessToken },
          },
        } = data;

        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = accessToken;
        return api(originalRequest);
      }
      return Promise.reject(error);
    }
  );
  return instance;
};

const onRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
  console.info(
    `🙏 %c[API] ${config.method?.toUpperCase()} ${config.url} | [::request::]`,
    'color: #229910'
  );
  console.dir(config);
  console.log('', '');
  return config;
};

const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  console.error(
    `💥 [API] ${error.config?.method?.toUpperCase()} ${error.config?.url} | [::request error::]`
  );
  console.dir(error);
  console.log('', '');
  return Promise.reject(error);
};

const onResponse = (response: AxiosResponse): AxiosResponse => {
  console.info(
    `👌 %c [API] ${response.config.method?.toUpperCase()} ${response.config.url} | [::response::] ${
      response.status
    }`,
    'color: #13ce29'
  );
  console.dir(response);
  console.log('', '');
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  console.error(
    `💥 [API] ${error.config?.method?.toUpperCase()} ${error.config?.url} | [::response error::]`
  );
  console.dir(error);
  console.log('', '');
  return Promise.reject(error);
};

const setupInterceptorsTo = (axiosInstance: AxiosInstance): AxiosInstance => {
  axiosInstance.interceptors.request.use(onRequest, onRequestError);
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
};

export { setupInterceptorsTo, tokenInterceptor };
