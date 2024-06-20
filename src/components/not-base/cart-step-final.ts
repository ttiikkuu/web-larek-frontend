import { FirstStepOrderData, SecondStepOrderData, Product } from "../../types";
import { StateEmitter } from "./state-emitter";
import { Modal } from "./modal.component";
import { Cart } from "./cart";

export class CartStepFinal {
	private _stateEmitter: StateEmitter;
	private _cart: Cart;
	private _email: string;
	private _phone: string;
	private _paymentMethod: 'cash' | 'card';
	private _address: string;

	constructor(stateEmitter: StateEmitter, cart: Cart, { email, phone, address, paymentMethod }: SecondStepOrderData) {
		this._stateEmitter = stateEmitter;
		this._email = email;
		this._phone = phone;
		this._address = address;
		this._paymentMethod = paymentMethod;
		this._cart = cart;
	}

	public createModalContentNode(): HTMLElement {
		const successTemplate = document.querySelector<HTMLTemplateElement>('#success').content;
		const orderSuccess = successTemplate.querySelector('.order-success').cloneNode(true) as HTMLElement;
		const orderSuccessDescription = orderSuccess.querySelector<HTMLElement>('.order-success__description');
		const orderSuccessCloseBtnNode = orderSuccess.querySelector<HTMLButtonElement>('.order-success__close');
		
		orderSuccessDescription.textContent = `Списано ${this._cart.calcSumCart()} синапсов`;

		orderSuccessCloseBtnNode.addEventListener('click', (e) => {
			e.preventDefault();

			this._stateEmitter.updateState('close succesModal', {});
		});

		this._cart.deleteAllFromCart();
		
		return orderSuccess;
	}


}