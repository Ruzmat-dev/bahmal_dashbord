export interface TCategory {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface TAchievement {
  id: number;
  image: string;
}
export interface IdCategory {
  id: number;
  title: string;
  description: string;
  image: string;
  parent: null ;
}

interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
  created_at: string; // You can use a Date type if you parse the date string
}

export interface TBlogs {
  count: number;
  next: string | null;
  previous: string | null;
  results: Post[];
}

export interface TBlogsResults{
  id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
}


export type  TChangeCategory = {
  id: number | null;
  title: string;
  description: string;
  image: null | File;
  parent: null | number;
}

export interface TGalleries  {
  id : number ;
  image :  string;
}

interface Product {
  id: number;
  created_at: string;
  product_code: number;
  title: string;
  description: string;
  category: {
    id: number;
    title: string;
    description: string;
    image: string;
    parent: {
      id: number;
      title: string;
      description: string;
      image: string;
      parent: null | {
        id: number;
        title: string;
        description: string;
        image: string;
        parent: null;
      };
    };
  };
  avg_rating: null | number;
  size: {
    id: number;
    height: number;
    width: number;
    size_type: string;
  };
  content: string;
  design: string;
  callus: string;
  made_in: string;
  new_product: boolean;
  bestseller: boolean;
  images: string[];
}

export interface ProductResponse {
  count: number;
  next: null | string;
  previous: null | string;
  results: Product[];
}

export interface TStatistics {
  id: number ;
  number: number ;
  body: string
}



export type TPostCategory = {
  title?: string
  title_uz?: string
  title_ru?: string
  title_en?: string
  description?: string
  description_ru?: string
  description_uz?: string
  description_en?: string
  image?: File | string
  parent?: null
}

export type TAchievements = {
  id: number;
  image: string;
}

interface Category {
  id: number;
  title: string;
  description: string;
  image: string;
}

export interface SubCategory {
  id: number;
  title: string;
  category: Category;
}
export interface SubCategory {
  id: number;
  title: string;
  category: Category;
}
export interface getSubCategoryById {
  id: number
  title: string
  category: number
}
