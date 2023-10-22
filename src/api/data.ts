import {
  ProductResponse,
  SubCategory,
  TAchievement,
  TBlogs,
  TBlogsResults,
  TCategory,
  TGalleries,
  TStatistics,
  getSubCategoryById,
} from "../../types/data";
import { Response } from "../../types/v2data";
import { axiosPublic } from "./axiosPublic";

export const getCategories = async () => {
  try {
    const res = await axiosPublic("uz").get<TCategory[]>(`/categories/`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryById = async (id: string, lang: "ru" | "uz" | "en") => {
  try {
    const res = await axiosPublic(lang).get<TCategory>(`/categories/${id}/`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getSubCategory = async (id: string, lang: "ru" | "uz" | "en") => {
  try {
    const res = await axiosPublic(lang).get<SubCategory[]>(
      `/subcategories/?category=${id}`
    );
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getAchievements = async () => {
  try {
    const res = await axiosPublic("uz").get<TAchievement[]>(`/achievements/`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getBlogs = async () => {
  try {
    const res = await axiosPublic("uz").get<TBlogs>(`/blogs/`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getBlogById = async (id: string, lang: "ru" | "uz" | "en") => {
  try {
    const res = await axiosPublic(lang).get<TBlogsResults>(`/blogs/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getGalleries = async () => {
  try {
    const res = await axiosPublic("uz").get<TGalleries[]>(`/galleries/`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getNews = async () => {
  try {
    const res = await axiosPublic("uz").get<TBlogs>(`/news/`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getNewsById = async (id: string, lang: "ru" | "uz" | "en") => {
  try {
    const res = await axiosPublic(lang).get<TBlogsResults>(`/news/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getProducts = async () => {
  try {
    const res = await axiosPublic("uz").get<ProductResponse>(`/products/`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getStatistics = async () => {
  try {
    const res = await axiosPublic("uz").get<TStatistics[]>(`/statistics/`);
    return res;
  } catch (error) {
    console.log(error);
  }
};

export const getStatisticsById = async (id:number) => {
  try {
    const res = await axiosPublic("uz").get<TStatistics[]>(`/statistics/${id}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};



export const getProductsData = async (value: string) => {
  try {
    const res = await axiosPublic("uz").get<Response>(`/products/${value}`);
    return res;
  } catch (error) {
    console.log(error);
  }
};


export const getSubcategories = async(lang: "uz" | "ru" | "en") => {
  try {
    const res = await axiosPublic(lang).get<SubCategory[]>(`/subcategories/`);
    return res
  } catch (error) {
    console.log(error)
  }
}

export const getSubcategoriesById = async(id:string , lang: "uz" | "ru" | "en") => {
  try {
    const res = await axiosPublic(lang).get<getSubCategoryById>(`/subcategories/${id}`);
    return res
  } catch (error) {
    console.log(error)
  }
}

export const getCategoriesData = async(lang: "uz" | "ru" | "en") => {
  try {
    const res = await axiosPublic(lang).get<SubCategory[]>(`/categories/`);
    return res
  } catch (error) {
    console.log(error)
  }
}