import { Product } from "../../types";
import { StateEmitter } from "./state-emitter";

export class Cart<T extends object = object> {
	private _stateEmitter: StateEmitter

	constructor(
		stateEmitter: StateEmitter
	) {
		this._stateEmitter = stateEmitter;
	}

	public addToCart(product: Product): void {
		this._stateEmitter.updateState(`changeCart id: ${product.id}`, { existInBacket: true });
		this._stateEmitter.updateState('cart', {
			[product.id]: product
		});

	}

	public deleteFromCart(product: Product): void {
		this._stateEmitter.updateState(`changeCart id: ${product.id}`, { existInBacket: false });

		const cartState = this._stateEmitter.getState('cart') as Record<string, Product>;

		delete cartState[product.id]; // Удаляем из корзины ранее добавленный продукт
		this._stateEmitter.setState('cart', cartState);
	}

	public deleteAllFromCart(): void {
		const cart = this._getArrCart();
		const cartState = this._stateEmitter.getState('cart') as Record<string, Product>;

		for (const product of cart) {
			this._stateEmitter.updateState(`changeCart id: ${product.id}`, { existInBacket: false });
			delete cartState[product.id];
		}

		this._stateEmitter.setState('cart', cartState);
	}

	public getProducts(): Product[] {
		return this._getArrCart();
	}

	public calcSumCart(): number {
		return this._getArrCart().reduce((acc, curr) => {
			const price = curr.price === null ? 0 : curr.price;
			acc += price;
			return acc;
		}, 0);
	}

	public subscribeChangeCartId(product: Product, listener: (state: T) => void) {
		this._stateEmitter.subscribe(`changeCart id: ${product.id}`, listener);
	}

	public subscribeCart(listener: (state: T) => void): void {
		this._stateEmitter.subscribe('cart', listener);
	}

	public unsubscribeChangeCartId(product: Product, listener: (state: T) => void) {
		this._stateEmitter.unsubscribe(`changeCart id: ${product.id}`, listener);
	}

	public unsubscribeCart(listener: (state: T) => void) {
		this._stateEmitter.unsubscribe('cart', listener);
	}

	private _getArrCart(): Product[] {
		const stateCart = this._stateEmitter.getState('cart') as Record<string, Product>;

		return Object.values(stateCart);
	}
}
