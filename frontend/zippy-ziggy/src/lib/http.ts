import axios from 'axios';

const serverUrl =
  process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_APP_SERVER_URL
    : 'http://localhost:8080';

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

export default instance;
