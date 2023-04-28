import axios, { AxiosRequestConfig } from 'axios';
import { setupInterceptorsTo, tokenFormInterceptor, tokenInterceptor } from '@/utils/interceptors';

export const serverUrl =
  process.env.NEXT_PUBLIC_LOCAL_TYPE === 'local'
    ? 'http://localhost:3000'
    : 'https://zippyziggy.kr';

const httpApi = () => {
  const instance = axios.create({
    baseURL: `${serverUrl}/api`,

    headers: {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Credentials': true,
      // 'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      // 'Access-Control-Allow-Headers': '*',
      // 'Access-Control-Expose-Headers': '*',
    },

    withCredentials: true,
  });

  return setupInterceptorsTo(instance);
};

const httpAuthApi = (options: AxiosRequestConfig = {}) => {
  const instance = axios.create({
    baseURL: `${serverUrl}/api`,

    headers: {
      // 'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': 'http://localhost:3000',
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Credentials': true,
      // 'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      // 'Access-Control-Allow-Headers': '*',
      // 'Access-Control-Expose-Headers': '*',
    },
    ...options,
    withCredentials: true,
  });
  return tokenInterceptor(instance);
};

const httpAuthFormApi = () => {
  const instance = axios.create({
    baseURL: `${serverUrl}/api`,

    headers: {
      'Content-Type': 'multipart/form-data',
    },

    withCredentials: true,
  });
  return tokenFormInterceptor(instance);
};

const httpFormApi = () => {
  const instance = axios.create({
    baseURL: `${serverUrl}/api`,

    headers: {
      'Content-Type': 'multipart/form-data',
    },

    withCredentials: true,
  });
  return setupInterceptorsTo(instance);
};

const httpTokenApi = (options: AxiosRequestConfig = {}) => {
  const instance = axios.create({
    baseURL: `${serverUrl}/api`,

    headers: {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Credentials': true,
      // 'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      // 'Access-Control-Allow-Headers': '*',
      // 'Access-Control-Expose-Headers': '*',
    },
    ...options,
    withCredentials: true,
  });
  return setupInterceptorsTo(instance);
};

export const http = httpApi();
export const httpAuth = httpAuthApi();
export const httpAuthForm = httpAuthFormApi();
export const httpForm = httpFormApi();
export const httpToken = httpTokenApi();
