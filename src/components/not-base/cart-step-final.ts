import { FirstStepOrderData, SecondStepOrderData, Product } from "../../types";
import { StateEmitter } from "./state-emitter";
import { Modal } from "./modal.component";

export class CartStepFinal {
	private _stateEmitter: StateEmitter<object>;
	private _cart: Product[] = [];
	private _email: string;
	private _phone: string;
	private _paymentMethod: 'cash' | 'card';
	private _address: string;

	constructor(stateEmitter: StateEmitter<object>, { email, phone, cart, address, paymentMethod }: SecondStepOrderData) {
		this._stateEmitter = stateEmitter;
		this._email = email;
		this._phone = phone;
		this._cart = cart;
		this._address = address;
		this._paymentMethod = paymentMethod;

		// здесь нужно обнулить данные в корзине
	}

	public createModalContentNode(): HTMLElement {
		const successTemplate = document.querySelector<HTMLTemplateElement>('#success').content;
		const orderSuccess = successTemplate.querySelector('.order-success').cloneNode(true) as HTMLElement;
		const orderSuccessDescription = orderSuccess.querySelector<HTMLElement>('.order-success__description');

		orderSuccessDescription.textContent = `Списано ${this._getTotalPriceCart()} синапсов`;
		
		return orderSuccess;
	}

	private _getTotalPriceCart(): number {		
		return this._cart.reduce((acc, curr) => {
			const price = curr.price === null ? 0 : curr.price;
			acc += price;
			return acc;
		}, 0);
	}


}