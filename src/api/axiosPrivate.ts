//axiosPrivate.js
import axios, { AxiosError } from "axios";

import { memoizedRefreshToken } from "./refreshToken";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URLL;

axios.interceptors.request.use(
    async(config) => {
      const accessToken = localStorage.getItem('access');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;

      const result = await memoizedRefreshToken();

      if (result?.refresh) {
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${result?.refresh}`,
        };
      }

      return axios(config);
    }
    return Promise.reject(error);
  }
);

export const axiosPrivate = axios;