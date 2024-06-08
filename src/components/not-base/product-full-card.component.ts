// Тимофей сам написал 20.05.2024
import { Product } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { StateEmitter } from "./state-emitter";

export class ProductFullCard {
	public get product() {
		return this._product;
	}
	private _stateEmitter: StateEmitter<object>;
	private _product: Product;
	private _existInBacket = false;
	private _fullCardBtnNode: HTMLButtonElement;

	constructor(stateEmitter: StateEmitter<object>) {
		this._stateEmitter = stateEmitter;
	}

	public createNode(product: Product): HTMLElement {
		this._product = product;

		const fullCardTemplate = document.querySelector<HTMLTemplateElement>('#card-preview').content;
		const fullCardNode = fullCardTemplate.querySelector('.card_full').cloneNode(true) as HTMLElement;
		const fullCardImageNode = fullCardNode.querySelector<HTMLImageElement>('.card__image');
		const fullCardCategoryNode = fullCardNode.querySelector('.card__category');
		const fullCardTitleNode = fullCardNode.querySelector('.card__title');
		const fullCardTextNode = fullCardNode.querySelector('.card__text');
		const fullCardPriceNode = fullCardNode.querySelector('.card__price');
		const fullCardBtnNode = fullCardNode.querySelector<HTMLButtonElement>('.card__button');
		const priceText = product.price === null ? 'Бесценно' : `${product.price} синапсов`;
		
		this._fullCardBtnNode = fullCardBtnNode;

		fullCardBtnNode.textContent = 'Добавить в корзину';
		fullCardCategoryNode.textContent = product.category;
		fullCardTitleNode.textContent = product.title;
		fullCardTextNode.textContent = product.description;
		fullCardImageNode.src = `${CDN_URL}${product.image}`;
		fullCardPriceNode.textContent = priceText;


		this._stateEmitter.subscribe(`changeCart id: ${product.id}`, this._listenerChangeCart);
		this._stateEmitter.subscribeNewEvents(`closeFullCard by id: ${product.id}`, this._closeCallbackFullCard);

		fullCardBtnNode.addEventListener('click', () => {

			if (this._existInBacket === false) { // Если нет в корзине, то добавить в корзину, иначе удалить
				this._existInBacket = true;
				this._stateEmitter.updateState(`changeCart id: ${product.id}`, { existInBacket: true });
				this._stateEmitter.updateState('cart', {
					[product.id]: product
				});
			} else if (this._existInBacket === true) {
				this._existInBacket = false;
				this._stateEmitter.updateState(`changeCart id: ${product.id}`, { existInBacket: false });

				const cartState: any = this._stateEmitter.getState('cart');

				delete cartState[product.id]; // Удаляем из корзины ранее добавленный продукт
				this._stateEmitter.setState('cart', cartState);
			}

		});

		return fullCardNode;
	}

	public destroyNode() { }

	private _listenerChangeCart = ({ existInBacket }: { existInBacket: boolean }) => {		
		this._existInBacket = existInBacket;

		if (existInBacket === true) {
			this._fullCardBtnNode.textContent = 'Удалить из корзины';
		} else {
			this._fullCardBtnNode.textContent = 'Добавить в корзину';
		}
	}

	private _closeCallbackFullCard = () => {		
		this._stateEmitter.unsubscribe(`changeCart id: ${this._product.id}`, this._listenerChangeCart);
		this._stateEmitter.unsubscribe(`closeFullCard by id: ${this._product.id}`, this._closeCallbackFullCard);
	}


}
