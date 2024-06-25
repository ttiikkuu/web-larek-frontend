import { OrderStepTrackerService } from "../../services/order-step-tracker.service";
import { OrderPaymentAndAddressData } from "../../types";
import { Cart } from "./cart";
import { OrderContactInformation } from "./cart-step-2.component";
import { Modal } from "./modal.component";
import { StateEmitter } from "./state-emitter";

interface OrderPaymentAndAddressFormState {
	paymentMethod: 'cash' | 'card' | null;
	address: string | null;
}

interface OrderPaymentAndAddressNodes {
	orderFormNode: HTMLFormElement | null;
	orderCardButtonNode: HTMLButtonElement | null;
	orderCashButtonNode: HTMLButtonElement | null;
	orderInputAddressNode: HTMLInputElement | null;
	orderNextBtnNode: HTMLButtonElement | null;
	orderFormErrorsNode: HTMLElement | null;
}

export class OrderPaymentAndAddress {
	private _stateEmitter: StateEmitter;
	private _nodes: OrderPaymentAndAddressNodes = {
		orderFormNode: null,
		orderCardButtonNode: null,
		orderCashButtonNode: null,
		orderInputAddressNode: null,
		orderNextBtnNode: null,
		orderFormErrorsNode: null
	};
	private _cart: Cart;
	private _formState: OrderPaymentAndAddressFormState = {
		paymentMethod: null,
		address: null,
	};
	private _orderStepTrackerService: OrderStepTrackerService;

	private get _validForm(): boolean {
		return (this._formState.address !== null && this._formState.address !== '' && this._formState.paymentMethod !== null);
	}

	constructor(
		stateEmitter: StateEmitter,
		cart: Cart,
		orderStepTrackerService: OrderStepTrackerService
	) {
		this._stateEmitter = stateEmitter;
		this._cart = cart;
		this._orderStepTrackerService = orderStepTrackerService;
	}

	public createModalContentNode(): HTMLFormElement {
		const orderTemplate = document.querySelector<HTMLTemplateElement>('#order').content;
		const orderFormNode = orderTemplate.querySelector('.form').cloneNode(true) as HTMLFormElement;
		const orderCardButtonNode = orderFormNode.querySelector<HTMLButtonElement>('.order__buttons .button[name="card"]');
		const orderCashButtonNode = orderFormNode.querySelector<HTMLButtonElement>('.order__buttons .button[name="cash"]');
		const orderInputAddressNode = orderFormNode.querySelector<HTMLInputElement>('input[name="address"]');
		const orderNextBtnNode = orderFormNode.querySelector<HTMLButtonElement>('.modal__actions .order__button');
		const orderFormErrorsNode = orderFormNode.querySelector<HTMLElement>('.form__errors');

		orderCardButtonNode.addEventListener('click', this._clickBtnListener);
		orderCashButtonNode.addEventListener('click', this._clickBtnListener);
		orderInputAddressNode.addEventListener('input', this._inputAddressListener);
		orderNextBtnNode.addEventListener('click', this._clickNextBtnListener);

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

	private _clickBtnListener = (event: PointerEvent): void => {
		const targetNode = event.target as HTMLElement;

		if (targetNode === this._nodes.orderCashButtonNode) {
			this._formState.paymentMethod = 'cash';
			this._nodes.orderCashButtonNode.classList.add('button_alt-active');
			this._nodes.orderCardButtonNode.classList.remove('button_alt-active');
		}

		if (targetNode === this._nodes.orderCardButtonNode) {
			this._formState.paymentMethod = 'card';
			this._nodes.orderCardButtonNode.classList.add('button_alt-active');
			this._nodes.orderCashButtonNode.classList.remove('button_alt-active');
		}

		this._nodes.orderNextBtnNode.disabled = !this._validForm;
		this._renderFormErrors();
	}

	private _inputAddressListener = (): void => {
		this._formState.address = this._nodes.orderInputAddressNode.value;
		this._nodes.orderNextBtnNode.disabled = !this._validForm;
		this._renderFormErrors();
	}

	private _clickNextBtnListener = (event: PointerEvent): void => {
		event.preventDefault();
		
		if (this._validForm === false) return;
		setTimeout(() => this._goToStepTwo(), 0);
	}

	private _renderFormErrors = (): void => {
		if (this._formState.address === null || this._formState.address === '') {
			this._nodes.orderFormErrorsNode.textContent = 'Введите адрес';
		} else if (this._formState.paymentMethod === null) {
			this._nodes.orderFormErrorsNode.textContent = 'Выберите способ оплаты';
		} else {
			this._nodes.orderFormErrorsNode.textContent = '';
		}
	}

	private _goToStepTwo(): void {
		const firstStepOrderData: OrderPaymentAndAddressData = {
			paymentMethod: this._formState.paymentMethod,
			address: this._formState.address
		};
		
		this._orderStepTrackerService.saveStepOne(firstStepOrderData);
		
		const оrderContactInformation = new OrderContactInformation(this._stateEmitter, this._cart, this._orderStepTrackerService);
		const оrderContactInformationNode = оrderContactInformation.createModalContentNode();
		const modal = new Modal(оrderContactInformationNode, this._stateEmitter);

		modal.open();
	}
	
}