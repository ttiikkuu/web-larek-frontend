import { Product } from "../../types";
import { Cart } from "./cart";
import { CartStep1 } from "./cart-step-1";
import { Modal } from "./modal.component";
import { StateEmitter } from "./state-emitter";

export class ShoppingCart {
	private _stateEmitter: StateEmitter<object>;
	private _nodes = {
		headerBasketCounterNode: document.querySelector('.header__basket-counter'),
		headerBasketNode: document.querySelector('.header__basket'),
		cartPlaceOrderBtnNode: null as any,
		cartPriceNode: null as any,
		cartListNode: null as any
	};
	private _cart: Cart<object>
	private _modalCart: Modal | null = null;

	constructor(stateEmitter: StateEmitter<object>, cart: Cart<object>) {
		this._stateEmitter = stateEmitter;
		this._cart = cart;
		this._initEventListeners();
	}

	private _createCartModalContentNode(cart: Product[]): HTMLElement {
		const cartTemplate = document.querySelector<HTMLTemplateElement>('#basket').content;
		const cartNode = cartTemplate.querySelector('.basket').cloneNode(true) as HTMLElement;
		const cartListNode = cartNode.querySelector('.basket__list');
		const cartPlaceOrderBtnNode = cartNode.querySelector<HTMLButtonElement>('.basket__button');
		const cartPriceNode = cartNode.querySelector('.basket__price');

		cartPlaceOrderBtnNode.addEventListener('click', () => {
			setTimeout(() => this._clickCheckoutCartListener(cart), 0);
		});

		// this._nodes.cartNode = cartNode;
		this._nodes.cartPlaceOrderBtnNode = cartPlaceOrderBtnNode;
		this._nodes.cartPriceNode = cartPriceNode;
		this._nodes.cartListNode = cartListNode;

		cartPlaceOrderBtnNode.disabled = this._cart.getCart().length === 0;
		this._nodes.cartPlaceOrderBtnNode = cartPlaceOrderBtnNode;

		const cartModalContentItemNodes = cart.map((product, index) => this._createCartModalContentItemNode(product, index + 1));

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
			// слушаем данные в корзине
			
			setTimeout(() => {
				this._renderCartInfo();
			}, 0);
			// this._nodes.cartPriceNode.textContent = String(this._getTotalPriceCart());
			// TODO: Если открыта модалка, то заново рендерить информацию в списке корзины
			// TODO: Сохранять узлы для рендеринга продуктов в списке корзины
		});
	}

	private _clickHeaderBasketListener = (): void => {
		const cartModalContentNode = this._createCartModalContentNode(this._cart.getCart());
		const modal = new Modal(cartModalContentNode);
		
		this._modalCart = modal;
		modal.open();
		
		this._renderCartInfo();
	}

	private _clickCartItemDeleteBtnListener = (product: Product): void => {
		this._cart.deleteFromCart(product);
	}

	private _clickCheckoutCartListener = (cart: Product[]): void => {
		const cartStep1 = new CartStep1(this._stateEmitter, cart);
		const cartStep1Node = cartStep1.createModalContentNode();
		const modal = new Modal(cartStep1Node);

		modal.open();
	}

	private _renderCartInfo(): void {
		this._nodes.headerBasketCounterNode.textContent = String(this._cart.getCart().length);

		if (this._nodes.cartPriceNode === null) return;
		this._nodes.cartPriceNode.textContent = `${this._cart.calcSumCart()} синапсов`;

		if (this._nodes.cartListNode === null) return;
		const cartModalContentItemNodes = this._cart.getCart().map((product, index) => this._createCartModalContentItemNode(product, index + 1));

		this._nodes.cartListNode.textContent = '';
		this._nodes.cartListNode.append(...cartModalContentItemNodes);
	}

}