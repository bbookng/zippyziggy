import axios from 'axios';
import { setupInterceptorsTo, tokenInterceptor } from '@/utils/interceptors';

const serverUrl =
  process.env.NODE_ENV !== 'development'
    ? process.env.NEXT_PUBLIC_APP_SERVER_URL
    : process.env.NEXT_PUBLIC_APP_CLIENT_URL;

const httpApi = () => {
  const instance = axios.create({
    baseURL: `${serverUrl}/api`,

    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*',
    },

    withCredentials: true,
  });

  return setupInterceptorsTo(instance);
};

const httpAuthApi = () => {
  const instance = axios.create({
    baseURL: `${serverUrl}/`,

    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Expose-Headers': '*',
    },

    withCredentials: true,
  });
  return tokenInterceptor(instance);
};

const httpFormApi = () => {
  console.log('폼데이터 요청');
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
export const httpForm = httpFormApi();
