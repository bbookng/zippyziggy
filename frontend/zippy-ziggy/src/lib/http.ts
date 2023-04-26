import axios from 'axios';
import { setupInterceptorsTo, tokenInterceptor } from '@/utils/interceptors';

const serverUrl =
  process.env.NEXT_PUBLIC_LOCAL_TYPE === 'local'
    ? 'http://localhost:3000/api'
    : process.env.NEXT_PUBLIC_APP_SERVER_URL;

const httpApi = () => {
  const instance = axios.create({
    baseURL: `${serverUrl}`,

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

const httpAuthApi = () => {
  const instance = axios.create({
    baseURL: `${serverUrl}/`,

    headers: {
      // 'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': 'http://localhost:3000',
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Credentials': true,
      // 'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      // 'Access-Control-Allow-Headers': '*',
      // 'Access-Control-Expose-Headers': '*',
    },

    withCredentials: true,
  });
  return tokenInterceptor(instance);
};

const httpAuthFormApi = () => {
  const instance = axios.create({
    baseURL: `${serverUrl}/`,

    headers: {
      'Content-Type': 'multipart/form-data',
    },

    withCredentials: true,
  });
  return tokenInterceptor(instance);
};

const httpFormApi = () => {
  const instance = axios.create({
    baseURL: `${serverUrl}/`,

    headers: {
      'Content-Type': 'multipart/form-data',
    },

    withCredentials: true,
  });
  return setupInterceptorsTo(instance);
};

export const http = httpApi();
export const httpAuth = httpAuthApi();
export const httpAuthForm = httpAuthFormApi();
export const httpForm = httpFormApi();
