import { StateEmitter } from "./state-emitter";
import { Cart } from "./cart";

export class OrderSuccessfullyPlaced {
	private _stateEmitter: StateEmitter;
	private _cart: Cart;

	constructor(stateEmitter: StateEmitter, cart: Cart) {
		this._stateEmitter = stateEmitter;
		this._cart = cart;
	}

	public createModalContentNode(): HTMLElement {
		const successTemplate = document.querySelector<HTMLTemplateElement>('#success').content;
		const orderSuccess = successTemplate.querySelector('.order-success').cloneNode(true) as HTMLElement;
		const orderSuccessDescription = orderSuccess.querySelector<HTMLElement>('.order-success__description');
		const orderSuccessCloseBtnNode = orderSuccess.querySelector<HTMLButtonElement>('.order-success__close');
		
		orderSuccessDescription.textContent = `Списано ${this._cart.totalPrice()} синапсов`;

		orderSuccessCloseBtnNode.addEventListener('click', (e) => {
			e.preventDefault();

			this._stateEmitter.updateState('close succesModal', {});
		});

		this._cart.deleteAllFromCart();
		
		return orderSuccess;
	}


}