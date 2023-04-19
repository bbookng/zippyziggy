import axios from 'axios';

const serverUrl =
  process.env.NODE_ENV === 'development'
    ? process.env.NEXT_PUBLIC_APP_SERVER_URL
    : 'http://localhost:3000';

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

export default instance;
