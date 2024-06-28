import { Product } from "../../types";
import { Cart } from "./cart";
import { ModalOrderPaymentAndAddressComponent } from "./modal-order-payment-and-address.component";
import { Modal } from "./modal.component";

export class ModalCartComponent extends Modal {
	private _nodes = {
		headerBasketCounterNode: document.querySelector('.header__basket-counter'),
		headerBasketNode: document.querySelector('.header__basket'),
		cartModalContentNode: null as any,
		cartPlaceOrderBtnNode: null as any,
		cartPriceNode: null as any,
		cartListNode: null as any
	};
	private _cart: Cart;
	private _modalOrderPaymentAndAddressComponent: ModalOrderPaymentAndAddressComponent;

	constructor(
		cart: Cart,
		modalOrderPaymentAndAddressComponent: ModalOrderPaymentAndAddressComponent,
		content?: HTMLElement,
		nameModal: string = `${Math.random().toFixed(6)}-modal`
	) {
		super(content, nameModal);
		this._cart = cart;
		this._modalOrderPaymentAndAddressComponent = modalOrderPaymentAndAddressComponent;
		this._renderModalContent();
		this._initEventListeners();
	}

	private _createModalContentNode(): HTMLElement {
		const cartTemplate = document.querySelector<HTMLTemplateElement>('#basket').content;
		const cartNode = cartTemplate.querySelector('.basket').cloneNode(true) as HTMLElement;
		const cartListNode = cartNode.querySelector('.basket__list');
		const cartPlaceOrderBtnNode = cartNode.querySelector<HTMLButtonElement>('.basket__button');
		const cartPriceNode = cartNode.querySelector('.basket__price');

		this._nodes.cartModalContentNode = cartNode;
		this._nodes.cartPlaceOrderBtnNode = cartPlaceOrderBtnNode;
		this._nodes.cartPriceNode = cartPriceNode;
		this._nodes.cartListNode = cartListNode;
		this._nodes.cartPlaceOrderBtnNode = cartPlaceOrderBtnNode;

		const cartModalContentItemNodes = this._cart.getProducts().map((product, index) => this._createCartModalContentItemNode(product, index + 1));

		cartListNode.textContent = '';
		cartListNode.append(...cartModalContentItemNodes);

		return cartNode;
	}

	private _renderModalContent(): void {
		if (this._nodes.cartModalContentNode === null) {
			this._renderContent(this._createModalContentNode());
			return;
		}

		this._renderContent(this._nodes.cartModalContentNode);
	}

	private _createCartModalContentItemNode(product: Product, index: number): HTMLElement {
		const cartItemTemplate = document.querySelector<HTMLTemplateElement>('#card-basket').content;
		const cartItemNode = cartItemTemplate.querySelector('.basket__item').cloneNode(true) as HTMLElement;
		const cartItemIndexNode = cartItemNode.querySelector('.basket__item-index');
		const cartItemTitleNode = cartItemNode.querySelector('.card__title');
		const cartItemPriceNode = cartItemNode.querySelector('.card__price');
		const cartItemDeleteBtnNode = cartItemNode.querySelector('.basket__item-delete');
		const priceText = product.price === null ? 'Бесценно' : `${product.price} синапсов`;

		cartItemDeleteBtnNode.addEventListener('click', () => this._clickCartItemDeleteBtnListener(product));

		cartItemIndexNode.textContent = String(index);
		cartItemTitleNode.textContent = product.title;
		cartItemPriceNode.textContent = priceText;

		return cartItemNode;
	}

	private _initEventListeners(): void {
		this._nodes.headerBasketNode.addEventListener('click', this._clickHeaderBasketListener);
		this._nodes.cartPlaceOrderBtnNode.addEventListener('click', () => {
			setTimeout(() => this._clickCheckoutCartListener(this._cart), 0);
		});

		this.onOpen(() => this._cart.subscribeCart(this._cartStateListener));
		this.onClose(() => this._cart.unsubscribeCart(this._cartStateListener));
	}

	private _cartStateListener = (cartObj: Record<string, Product>) => {			
		setTimeout(() => {
			this._renderCartInfo();
		}, 0);
	};

	private _clickHeaderBasketListener = (): void => {
		this._renderCartInfo();
		this.open();
	}

	private _clickCartItemDeleteBtnListener = (product: Product): void => {
		this._cart.deleteFromCart(product);
		this._nodes.cartPlaceOrderBtnNode.disabled = this._cart.size() === 0;
	}

	private _clickCheckoutCartListener = (cart: Cart): void => {
		this._cart.unsubscribeCart(this._cartStateListener);
		this._modalOrderPaymentAndAddressComponent.open();
	}

	private _renderCartInfo(): void {
		this._renderModalContent();
		this._nodes.headerBasketCounterNode.textContent = String(this._cart.getProducts().length);

		if (this._nodes.cartPriceNode === null) return;
		this._nodes.cartPriceNode.textContent = `${this._cart.totalPrice()} синапсов`;

		if (this._nodes.cartListNode === null) return;
		const cartModalContentItemNodes = this._cart.getProducts().map((product, index) => this._createCartModalContentItemNode(product, index + 1));

		this._nodes.cartPlaceOrderBtnNode.disabled = this._cart.size() === 0;
		this._nodes.cartListNode.textContent = '';
		this._nodes.cartListNode.append(...cartModalContentItemNodes);
	}
}