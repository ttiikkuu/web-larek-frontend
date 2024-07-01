import { ApiOrderService } from "../../services/api-order.service";
import { OrderStepTrackerService } from "../../services/order-step-tracker.service";
import { OrderContactInformationNodes, OrderContactInformationFormState, OrderContactData } from "../../types";
import { Cart } from "./cart";
import { ModalOrderSuccessfullyPlacedComponent } from "./modal-order-successfully-placed.component";
import { Modal } from "./modal.component";
import { StateEmitter } from "./state-emitter";

export class ModalOrderContactInformationComponent extends Modal {
	private _nodes: OrderContactInformationNodes = {
		orderFormNode: null,
		orderInputEmailNode: null,
		orderInputPhoneNode: null,
		orderPayBtnNode: null,
		orderFormErrorsNode: null
	};
	private _formState: OrderContactInformationFormState = {
		email: null,
		phone: null,
	};
	private _orderStepTrackerService: OrderStepTrackerService;
	private _modalOrderSuccessfullyPlacedComponent: ModalOrderSuccessfullyPlacedComponent;
	private _apiOrderService: ApiOrderService;

	private get _validForm(): boolean {
		return (this._formState.email !== null && this._formState.email !== '' && this._formState.phone !== null && this._formState.phone !== '');
	}

	constructor(
		stateEmitter: StateEmitter,
		orderStepTrackerService: OrderStepTrackerService,
		modalOrderSuccessfullyPlacedComponent: ModalOrderSuccessfullyPlacedComponent,
		apiOrderService: ApiOrderService,
		content?: HTMLElement,
		nameModal: string = `${Math.random().toFixed(6)}-modal`
	) {
		super(content, nameModal);
		this._stateEmitter = stateEmitter;
		this._orderStepTrackerService = orderStepTrackerService;
		this._modalOrderSuccessfullyPlacedComponent = modalOrderSuccessfullyPlacedComponent;
		this._apiOrderService = apiOrderService;
		this._renderModalContent();
	}

	public open() {
		this._renderModalContent();
		super.open();
	}

	private _createModalContentNode(): HTMLFormElement {
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
			email: null,
			phone: null
		};

		this._nodes.orderInputEmailNode.value = '';
		this._nodes.orderInputPhoneNode.value = '';
		this._nodes.orderPayBtnNode.disabled = true;
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
		const step2Data: OrderContactData = {
			email: this._formState.email,
			phone: this._formState.phone
		};

		this._orderStepTrackerService.saveStepTwo(step2Data);
		const orderData = this._orderStepTrackerService.getOrderData();

		this._apiOrderService.createOrder(orderData).then(() => {
			this._orderStepTrackerService.saveServerPostOrderInfo({ success: true });
			this._openNextStepModal();
		}).catch(() => {
			this._orderStepTrackerService.saveServerPostOrderInfo({ success: false });
			console.error('Заказ не получился создать');
		});
	}

	private _openNextStepModal(): void {
		this._modalOrderSuccessfullyPlacedComponent.open();
	}
}