import { OrderPaymentAndAddressData, OrderContactInformationData, Product } from "../../types";
import { StateEmitter } from "./state-emitter";
import { Modal } from "./modal.component";
import { CartStepFinal } from "./cart-step-final.component";
import { Cart } from "./cart";

interface CartStep2FormState {
	email: string | null;
	phone: string | null;
}

interface CartStep2Nodes {
	orderFormNode: HTMLFormElement | null;
	orderInputEmailNode: HTMLInputElement | null;
	orderInputPhoneNode: HTMLInputElement | null;
	orderPayBtnNode: HTMLButtonElement | null;
	orderFormErrorsNode: HTMLElement | null;
}

export class OrderContactInformation {
	private _stateEmitter: StateEmitter;
	private _cart: Cart;
	private _paymentMethod: 'cash'	| 'card';
	private _address: string;

	private _nodes: CartStep2Nodes = {
		orderFormNode: null,
		orderInputEmailNode: null,
		orderInputPhoneNode: null,
		orderPayBtnNode: null,
		orderFormErrorsNode: null
	};

	private _formState: CartStep2FormState = {
		email: null,
		phone: null,
	};

	private get _validForm(): boolean {
		return (this._formState.email !== null && this._formState.email !== '' && this._formState.phone !== null && this._formState.phone !== '');
	}

	constructor(stateEmitter: StateEmitter, cart: Cart, { address, paymentMethod }: OrderPaymentAndAddressData) {
		this._stateEmitter = stateEmitter;
		this._address = address;
		this._paymentMethod = paymentMethod;
		this._cart = cart;
	}

	public createModalContentNode(): HTMLFormElement {
		const orderTemplate = document.querySelector<HTMLTemplateElement>('#contacts').content;
		const orderFormNode = orderTemplate.querySelector('.form').cloneNode(true) as HTMLFormElement;
		const orderInputEmailNode = orderFormNode.querySelector<HTMLInputElement>('input[name="email"]');
		const orderInputPhoneNode = orderFormNode.querySelector<HTMLInputElement>('input[name="phone"]');
		const orderPayBtnNode = orderFormNode.querySelector<HTMLButtonElement>('.modal__actions .button');
		const orderFormErrorsNode = orderFormNode.querySelector<HTMLElement>('.form__errors');

		orderInputEmailNode.addEventListener('input', this._inputInputEmailPhoneListener);
		orderInputPhoneNode.addEventListener('input', this._inputInputEmailPhoneListener);
		orderFormNode.addEventListener('submit', this._clickPayBtnListener);

		this._nodes = {
		 	orderFormNode,
		 	orderInputEmailNode,
		 	orderInputPhoneNode,
		 	orderPayBtnNode,
		 	orderFormErrorsNode
		};

		return orderFormNode;
	}

	private _inputInputEmailPhoneListener = (): void => {
		this._formState.email = this._nodes.orderInputEmailNode.value;
		this._formState.phone = this._nodes.orderInputPhoneNode.value;
		this._nodes.orderPayBtnNode.disabled = !this._validForm;
		this._renderFormErrors();

		
	}

	private _clickPayBtnListener = (event: PointerEvent): void => {
		event.preventDefault();
		
		if (this._validForm === false) return;
		setTimeout(() => this._goToStepFinal(), 0);
	}

	private _renderFormErrors = (): void => {
		if (this._formState.email === null || this._formState.email === '') {
			this._nodes.orderFormErrorsNode.textContent = 'Введите эл. почту';
		} else if (this._formState.phone === null || this._formState.phone === '') {
			this._nodes.orderFormErrorsNode.textContent = 'Введите телефон';
		} else {
			this._nodes.orderFormErrorsNode.textContent = '';
		}
	}

	private _goToStepFinal(): void {
		const secondStepOrderData: OrderContactInformationData = {
			email: this._formState.email,
			phone: this._formState.phone,
			paymentMethod: this._paymentMethod,
			address: this._address,
			products: this._cart.getProducts()
		};

		const cartStepFinal = new CartStepFinal(this._stateEmitter, this._cart, secondStepOrderData);
		const cartStepFinalNode = cartStepFinal.createModalContentNode();
		const modal = new Modal(cartStepFinalNode, this._stateEmitter, 'succesModal');

		modal.open();
	}

}