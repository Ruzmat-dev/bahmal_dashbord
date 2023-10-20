import mem from "mem";

import { axiosPublic } from "./axiosPublic";

const refreshTokenFn = async () => {
  const refreshToken = localStorage.getItem('refresh')
  try {
    const response = await axiosPublic('uz').post("/accounts/refresh/", {
      refresh: refreshToken,
    });
    const { access, refresh } = response.data;
    if (access && refresh) {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    }
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    return access && refresh; 
  } catch (error) {
    if (typeof window !== 'undefined') {
      window.location.href = '/'
    }
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
};
const maxAge = 10000;
export const memoizedRefreshToken = mem(refreshTokenFn, {
  maxAge,
});