export interface OrderContactInformationFormState {
	email: string | null;
	phone: string | null;
}

export interface OrderContactInformationNodes {
	orderFormNode: HTMLFormElement | null;
	orderInputEmailNode: HTMLInputElement | null;
	orderInputPhoneNode: HTMLInputElement | null;
	orderPayBtnNode: HTMLButtonElement | null;
	orderFormErrorsNode: HTMLElement | null;
}

export interface OrderPaymentAndAddressFormState {
	paymentMethod: 'cash' | 'card' | null;
	address: string | null;
}

export interface OrderPaymentAndAddressNodes {
	orderFormNode: HTMLFormElement | null;
	orderCardButtonNode: HTMLButtonElement | null;
	orderCashButtonNode: HTMLButtonElement | null;
	orderInputAddressNode: HTMLInputElement | null;
	orderNextBtnNode: HTMLButtonElement | null;
	orderFormErrorsNode: HTMLElement | null;
}

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

export interface OrderPaymentAndAddressData {
	paymentMethod: 'cash'	| 'card';
	address: string;
}

export interface OrderContactData {
	email: string;
	phone: string;
}

export interface OrderData {
	paymentMethod: 'cash'	| 'card';
	email: string;
	address: string;
	phone: string;
	products: Product[];
}

export interface OrderResponse {
	id: string;
	total: number;
}