export interface ProductListResponse {
    total: number;
    items: Product[];
}

export interface Product {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface ApiListResponse<T> {
    total: number;
    items: T;
};

export type FunctionVoid = () => void;