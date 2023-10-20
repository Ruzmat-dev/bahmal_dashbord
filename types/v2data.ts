export type Response = {
    count:    number;
    next:     null | string;
    previous: null | string;
    results:  Result[];
}

export type Result = {
    id:             number;
    created_at:     Date;
    subcategory:    Subcategory;
    title:          string;
    description:    string;
    product_type:   string;
    avg_rating:     null | number;
    size:           Size | null;
    density:        string;
    type_of_finish: string | null;
    package:        string | null;
    made_in:        string | null;
    yarn_number:    string | null;
    length:         string | null;
    weaving:        string | null;
    design_code:    string | null;
    new_product:    boolean;
    bestseller:     boolean;
    images:         string[];
    composition:    Composition[];
}

export type Composition = {
    id:         number;
    percentage: number;
    compound:   string;
    product:    number;
}

export type Size = {
    id:        number;
    height:    number;
    width:     number;
    size_type: string;
}

export type Subcategory = {
    id:       number;
    title:    string;
    category: Category;
}

export type Category = {
    id:          number;
    title:       string;
    description: string;
    image:       string;
}



export type TPostProduct = {
    title:             string;
    title_ru:          string;
    title_en:          string;
    title_uz:          string;
    description:       string;
    description_ru:    string;
    description_en:    string;
    description_uz:    string;
    product_type:      string;
    density:           string;
    type_of_finish:    string;
    type_of_finish_ru: string;
    type_of_finish_en: string;
    type_of_finish_uz: string;
    package:           string;
    package_ru:        string | null;
    package_en:        string | null;
    package_uz:        string | null;
    made_in:           string;
    made_in_ru:        string;
    made_in_en:        string;
    made_in_uz:        string;
    yarn_number:       string;
    length:            string;
    weaving:           string;
    design_code:       string;
    new_product:       boolean;
    bestseller:        boolean;
    subcategory:       string;
}



export type TProductType = "RMP" | "FFP" | "FP" | "DP" | "ABP"



export interface IProductData {
    id: number;
    title_uz: string;
    title_ru: string;
    title_en: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
    type_of_finish_uz: string;
    type_of_finish_en: string;
    type_of_finish_ru: string;
    package_uz: string;
    package_ru: string;
    package_en: string;
    made_in_uz: string;
    made_in_ru: string;
    made_in_en: string;
    size: number;
    subcategory: number;
    product_type: string;
    density: string | null;
    type_of_finish: string | null;
    package:        string | null;
    made_in:        string | null;
    yarn_number:    string | null;
    length:         string | null;
    weaving:        string | null;
    design_code:    string | null;
    new_product: boolean;
    bestseller: boolean;
  }
  