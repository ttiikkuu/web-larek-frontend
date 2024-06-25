import { OrderStepTrackerService } from "../../services/order-step-tracker.service";
import { Product } from "../../types";
import { Cart } from "./cart";
import { OrderPaymentAndAddress } from "./cart-step-1.component";
import { Modal } from "./modal.component";
import { StateEmitter } from "./state-emitter";

export class ShoppingCartComponent {
	private _stateEmitter: StateEmitter;
	private _nodes = {
		headerBasketCounterNode: document.querySelector('.header__basket-counter'),
		headerBasketNode: document.querySelector('.header__basket'),
		cartPlaceOrderBtnNode: null as any,
		cartPriceNode: null as any,
		cartListNode: null as any
	};
	private _cart: Cart;
	private _orderStepTrackerService: OrderStepTrackerService;

	constructor(
		stateEmitter: StateEmitter,
		cart: Cart,
		orderStepTrackerService: OrderStepTrackerService
	) {
		this._stateEmitter = stateEmitter;
		this._cart = cart;
		this._orderStepTrackerService = orderStepTrackerService;
		this._initEventListeners();
	}

	private _createCartModalContentNode(): HTMLElement {
		const cartTemplate = document.querySelector<HTMLTemplateElement>('#basket').content;
		const cartNode = cartTemplate.querySelector('.basket').cloneNode(true) as HTMLElement;
		const cartListNode = cartNode.querySelector('.basket__list');
		const cartPlaceOrderBtnNode = cartNode.querySelector<HTMLButtonElement>('.basket__button');
		const cartPriceNode = cartNode.querySelector('.basket__price');

		cartPlaceOrderBtnNode.addEventListener('click', () => {
			setTimeout(() => this._clickCheckoutCartListener(this._cart), 0);
		});

		this._nodes.cartPlaceOrderBtnNode = cartPlaceOrderBtnNode;
		this._nodes.cartPriceNode = cartPriceNode;
		this._nodes.cartListNode = cartListNode;

		cartPlaceOrderBtnNode.disabled = this._cart.size() === 0;
		this._nodes.cartPlaceOrderBtnNode = cartPlaceOrderBtnNode;

		const cartModalContentItemNodes = this._cart.getProducts().map((product, index) => this._createCartModalContentItemNode(product, index + 1));

		cartListNode.textContent = '';
		cartListNode.append(...cartModalContentItemNodes);

		return cartNode;
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
		this._stateEmitter.subscribe('cart', (cartObj) => {
			
			setTimeout(() => {
				this._renderCartInfo();
			}, 0);
		});
	}

	private _clickHeaderBasketListener = (): void => {
		const cartModalContentNode = this._createCartModalContentNode();
		const modal = new Modal(cartModalContentNode, this._stateEmitter);
		
		modal.open();
		
		this._renderCartInfo();
	}

	private _clickCartItemDeleteBtnListener = (product: Product): void => {
		this._cart.deleteFromCart(product);
		this._nodes.cartPlaceOrderBtnNode.disabled = this._cart.size() === 0;
	}

	private _clickCheckoutCartListener = (cart: Cart): void => {
		const cartStep1 = new OrderPaymentAndAddress(this._stateEmitter, cart, this._orderStepTrackerService);
		const cartStep1Node = cartStep1.createModalContentNode();
		const modal = new Modal(cartStep1Node, this._stateEmitter);

		modal.open();
	}

	private _renderCartInfo(): void {
		this._nodes.headerBasketCounterNode.textContent = String(this._cart.getProducts().length);

		if (this._nodes.cartPriceNode === null) return;
		this._nodes.cartPriceNode.textContent = `${this._cart.totalPrice()} синапсов`;

		if (this._nodes.cartListNode === null) return;
		const cartModalContentItemNodes = this._cart.getProducts().map((product, index) => this._createCartModalContentItemNode(product, index + 1));

		this._nodes.cartListNode.textContent = '';
		this._nodes.cartListNode.append(...cartModalContentItemNodes);
	}

}