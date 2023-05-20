import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
/* eslint-disable no-useless-concat */
import { CHROME_USERINFO_KEY, ZIPPY_API_URL } from '@pages/constants';
import logOnDev from '@pages/content/utils/@shared/logging';
import { api } from './axios-instance';

export const getAccessToken = () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('accessToken', (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.accessToken);
      }
    });
  });
};

const tokenInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    async (config) => {
      const axiosConfig = config;
      // 토큰을 얻어오는 함수
      // const token = localStorage.getItem('accessToken');
      const token = await getAccessToken();
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
      const {
        config,
        response: { status },
      } = error;

      if (status === 401) {
        const originalRequest = config;

        try {
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
          return await api(originalRequest);
        } catch (err) {
          if (err.config.url === `${ZIPPY_API_URL}/users/refresh`) {
            localStorage.removeItem('accessToken');
            await chrome.storage.sync.remove(CHROME_USERINFO_KEY);
          }
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
      response?.status
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

export { setupInterceptorsTo, tokenInterceptor };
