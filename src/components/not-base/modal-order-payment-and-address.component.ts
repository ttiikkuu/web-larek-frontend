import { OrderStepTrackerService } from "../../services/order-step-tracker.service";
import { OrderPaymentAndAddressNodes, OrderPaymentAndAddressFormState, OrderPaymentAndAddressData } from "../../types";
import { Cart } from "./cart";
import { ModalOrderContactInformationComponent } from "./modal-order-contact-information.component";
import { Modal } from "./modal.component";
import { StateEmitter } from "./state-emitter";

export class ModalOrderPaymentAndAddressComponent extends Modal {
	private _nodes: OrderPaymentAndAddressNodes = {
		orderFormNode: null,
		orderCardButtonNode: null,
		orderCashButtonNode: null,
		orderInputAddressNode: null,
		orderNextBtnNode: null,
		orderFormErrorsNode: null
	};
	private _formState: OrderPaymentAndAddressFormState = {
		paymentMethod: null,
		address: null,
	};
	private _orderStepTrackerService: OrderStepTrackerService;
	private _modalOrderContactInformationComponent: ModalOrderContactInformationComponent;

	private get _validForm(): boolean {
		return (this._formState.address !== null && this._formState.address !== '' && this._formState.paymentMethod !== null);
	}

	constructor(
		orderStepTrackerService: OrderStepTrackerService,
		modalOrderContactInformationComponent: ModalOrderContactInformationComponent,
		content?: HTMLElement,
		nameModal: string = `${Math.random().toFixed(6)}-modal`
	) {
		super(content, nameModal);
		this._orderStepTrackerService = orderStepTrackerService;
		this._modalOrderContactInformationComponent = modalOrderContactInformationComponent;
		this._renderModalContent();
		this._initEventListeners();
	}

	public open() {
		this._renderModalContent();
		super.open();
	}

	private _renderModalContent(): void {
		if (this._nodes.orderFormNode === null) {
			this._renderContent(this._createModalContentNode());
			return;
		}

		this._renderContent(this._nodes.orderFormNode);
		this._renderResetInputs();
	}

	private _renderResetInputs(): void {
		this._formState = {
			paymentMethod: null,
			address: null
		};
		this._nodes.orderCardButtonNode.classList.remove('button_alt-active');
		this._nodes.orderCashButtonNode.classList.remove('button_alt-active');
		this._nodes.orderInputAddressNode.value = '';
		this._nodes.orderNextBtnNode.disabled = true;
	}

	private _createModalContentNode(): HTMLFormElement {
		const orderTemplate = document.querySelector<HTMLTemplateElement>('#order').content;
		const orderFormNode = orderTemplate.querySelector('.form').cloneNode(true) as HTMLFormElement;
		const orderCardButtonNode = orderFormNode.querySelector<HTMLButtonElement>('.order__buttons .button[name="card"]');
		const orderCashButtonNode = orderFormNode.querySelector<HTMLButtonElement>('.order__buttons .button[name="cash"]');
		const orderInputAddressNode = orderFormNode.querySelector<HTMLInputElement>('input[name="address"]');
		const orderNextBtnNode = orderFormNode.querySelector<HTMLButtonElement>('.modal__actions .order__button');
		const orderFormErrorsNode = orderFormNode.querySelector<HTMLElement>('.form__errors');

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

	private _initEventListeners(): void {
		this._nodes.orderCardButtonNode.addEventListener('click', this._clickBtnListener);
		this._nodes.orderCashButtonNode.addEventListener('click', this._clickBtnListener);
		this._nodes.orderInputAddressNode.addEventListener('input', this._inputAddressListener);
		this._nodes.orderNextBtnNode.addEventListener('click', this._clickNextBtnListener);
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
		this._modalOrderContactInformationComponent.open();
	}
}