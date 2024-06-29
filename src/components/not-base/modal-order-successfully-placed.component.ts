import { Cart } from "./cart";
import { Modal } from "./modal.component";

export class ModalOrderSuccessfullyPlacedComponent extends Modal {
	private _cart: Cart;
	private _nodes = {
		orderSuccessNode: null as any,
		orderSuccessDescriptionNode: null as any
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
		this._renderSuccessDescriptionInfo();
		super.open();
		this._cart.deleteAllFromCart();
	}



	private _createModalContentNode(): HTMLElement {
		const successTemplate = document.querySelector<HTMLTemplateElement>('#success').content;
		const orderSuccessNode = successTemplate.querySelector('.order-success').cloneNode(true) as HTMLElement;
		const orderSuccessDescriptionNode = orderSuccessNode.querySelector<HTMLElement>('.order-success__description');
		const orderSuccessCloseBtnNode = orderSuccessNode.querySelector<HTMLButtonElement>('.order-success__close');

		this._nodes.orderSuccessNode = orderSuccessNode;
		this._nodes.orderSuccessDescriptionNode = orderSuccessDescriptionNode;
		
		this._renderSuccessDescriptionInfo();

		orderSuccessCloseBtnNode.addEventListener('click', (e) => {
			this.close();
		});
		
		return orderSuccessNode;
	}

	private _renderSuccessDescriptionInfo(): void {
		this._nodes.orderSuccessDescriptionNode.textContent = `Списано ${this._cart.totalPrice()} синапсов`;
	}

	private _renderModalContent(): void {
		if (this._nodes.orderSuccessNode === null) {
			this._renderContent(this._createModalContentNode());
			return;
		}

		this._renderContent(this._nodes.orderSuccessNode);
	}
}