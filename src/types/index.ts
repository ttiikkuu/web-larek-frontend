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

export interface FirstStepOrderData {
	paymentMethod: 'cash'	| 'card';
	address: string;
	cart: Product[];
}

export interface SecondStepOrderData {
	paymentMethod: 'cash'	| 'card';
	address: string;
	email: string;
	phone: string;
	cart: Product[];
}