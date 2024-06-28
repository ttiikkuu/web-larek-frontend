import { Cart } from "./cart";
import { Modal } from "./modal.component";

export class ModalOrderSuccessfullyPlacedComponent extends Modal {
	private _cart: Cart;
	private _nodes = {
		orderSuccessNode: null as any
	};

	constructor(
		cart: Cart,
		content?: HTMLElement,
		nameModal: string = `${Math.random().toFixed(6)}-modal`
	) {
		super(content, nameModal);
		this._cart = cart;
	}

	public open() {
		this._renderModalContent();
		super.open();
	}

	private _createModalContentNode(): HTMLElement {
		const successTemplate = document.querySelector<HTMLTemplateElement>('#success').content;
		const orderSuccessNode = successTemplate.querySelector('.order-success').cloneNode(true) as HTMLElement;
		const orderSuccessDescriptionNode = orderSuccessNode.querySelector<HTMLElement>('.order-success__description');
		const orderSuccessCloseBtnNode = orderSuccessNode.querySelector<HTMLButtonElement>('.order-success__close');
		
		orderSuccessDescriptionNode.textContent = `Списано ${this._cart.totalPrice()} синапсов`;

		orderSuccessCloseBtnNode.addEventListener('click', (e) => {
			e.preventDefault();

			this._stateEmitter.updateState('close succesModal', {});
		});

		this._cart.deleteAllFromCart();

		this._nodes.orderSuccessNode = orderSuccessNode;
		
		return orderSuccessNode;
	}

	private _renderModalContent(): void {
		if (this._nodes.orderSuccessNode === null) {
			this._renderContent(this._createModalContentNode());
			return;
		}

		this._renderContent(this._nodes.orderSuccessNode);
	}
}