import 'server-only';

import axios from 'axios';

export default async function getAxiosInstance() {
  const instance = axios.create({
    baseURL: process.env.API_URL,

    timeout: 5000,
    timeoutErrorMessage: 'Request timed out',

    headers: {
      Cache: 'no-store',
      'Content-Type': 'application/json; charset=utf-8',
    },

    responseType: 'json',
  });

  return instance;
}
