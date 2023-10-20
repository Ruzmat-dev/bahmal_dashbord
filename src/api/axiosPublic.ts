import axios from "axios";

export const axiosPublic = (lang: "ru" | "uz" | "en") => axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}${lang}/api/v1`
})