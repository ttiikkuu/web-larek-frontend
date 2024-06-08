import { Product } from "../../types";
import { StateEmitter } from "./state-emitter";

export class CartStep1 {
	private _stateEmitter: StateEmitter<object>;
	private _nodes = {
		orderFormNode: null as any,
		orderCardButtonNode: null as any,
		orderCashButtonNode: null as any,
		orderInputAddressNode: null as any,
		orderNextBtnNode: null as any,
		orderFormErrorsNode: null as any
	};
	private _cart: Product[] = [];

	constructor(stateEmitter: StateEmitter<object>, cart: Product[]) {
		this._stateEmitter = stateEmitter;
		this._cart = cart;
	}

	public createModalContentNode(): HTMLFormElement {
		const orderTemplate = document.querySelector<HTMLTemplateElement>('#order').content;
		const orderFormNode = orderTemplate.querySelector('.form').cloneNode(true) as HTMLFormElement;
		const orderCardButtonNode = orderFormNode.querySelector('.order__buttons .button[name="card"]');
		const orderCashButtonNode = orderFormNode.querySelector('.order__buttons .button[name="cash"]');
		const orderInputAddressNode = orderFormNode.querySelector('input[name="address"]');
		const orderNextBtnNode = orderFormNode.querySelector('.modal__actions .order__button');
		const orderFormErrorsNode = orderFormNode.querySelector('.form__errors');

		this._nodes = {
			orderFormNode,
			orderCardButtonNode,
			orderCashButtonNode,
			orderInputAddressNode,
			orderNextBtnNode,
			orderFormErrorsNode
		};

		return orderFormNode;
	}
}