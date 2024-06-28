import { Product } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { getCategoryEng } from "../../utils/utils";
import { Cart } from "./cart";
import { StateEmitter } from "./state-emitter";

export class ProductFullCard {
  public get product(): Product {
    return this._product;
  }
  
  private _stateEmitter: StateEmitter;
  private _product: Product;
  private _existInBacket = false;
  private _fullCardBtnNode: HTMLButtonElement;
  private _cart: Cart;

  constructor(stateEmitter: StateEmitter, cart: Cart) {
    this._stateEmitter = stateEmitter;
    this._cart = cart;
  }

  public createNode(product: Product): HTMLElement {
    this._product = product;

    const fullCardTemplate = document.querySelector<HTMLTemplateElement>('#card-preview')?.content;
    if (!fullCardTemplate) {
      throw new Error('#card-preview не найден');
    }

    const fullCardNode = fullCardTemplate.querySelector('.card_full')?.cloneNode(true) as HTMLElement;
    if (!fullCardNode) {
      throw new Error('.card_full не найден');
    }

    this._initializeCardContent(fullCardNode, product);
    this._attachEventListeners(fullCardNode, product);

    return fullCardNode;
  }

  private _initializeCardContent(cardNode: HTMLElement, product: Product): void {
    const fullCardImageNode = cardNode.querySelector<HTMLImageElement>('.card__image');
    const fullCardCategoryNode = cardNode.querySelector<HTMLElement>('.card__category');
    const fullCardTitleNode = cardNode.querySelector<HTMLElement>('.card__title');
    const fullCardTextNode = cardNode.querySelector<HTMLElement>('.card__text');
    const fullCardPriceNode = cardNode.querySelector<HTMLElement>('.card__price');
    const fullCardBtnNode = cardNode.querySelector<HTMLButtonElement>('.card__button');

    if (!fullCardImageNode || !fullCardCategoryNode || !fullCardTitleNode || !fullCardTextNode || !fullCardPriceNode || !fullCardBtnNode) {
      throw new Error('Не найдены узлы при создании FullCard');
    }

    const priceText = product.price === null ? 'Бесценно' : `${product.price} синапсов`;
    
    this._fullCardBtnNode = fullCardBtnNode;
		
		if (product.price === null) {
			this._fullCardBtnNode.disabled = true;
		}
    
    fullCardCategoryNode.classList.add(`card__category_${getCategoryEng(this.product.category)}`);
    fullCardBtnNode.textContent = 'Добавить в корзину';
    fullCardCategoryNode.textContent = product.category;
    fullCardTitleNode.textContent = product.title;
    fullCardTextNode.textContent = product.description;
    fullCardImageNode.src = `${CDN_URL}${product.image}`;
    fullCardPriceNode.textContent = priceText;
  }

  private _attachEventListeners(cardNode: HTMLElement, product: Product): void {
    this._cart.subscribeChangeCartId(product, this._listenerChangeCart);
    this._stateEmitter.subscribeNewEvents(`closeFullCard by id: ${product.id}`, this._closeCallbackFullCard);

    this._fullCardBtnNode.addEventListener('click', () => {
      if (this._existInBacket) {
        this._existInBacket = false;
        this._cart.deleteFromCart(product);
      } else {
        this._existInBacket = true;
        this._cart.addToCart(product);
      }
    });
  }

  private _listenerChangeCart = ({ existInBacket }: { existInBacket: boolean }): void => {
    this._existInBacket = existInBacket;
    this._fullCardBtnNode.textContent = existInBacket ? 'Удалить из корзины' : 'Добавить в корзину';
  }

  private _closeCallbackFullCard = (): void => {
		this._cart.unsubscribeChangeCartId(this._product, this._listenerChangeCart);
    this._stateEmitter.unsubscribe(`closeFullCard by id: ${this._product.id}`, this._closeCallbackFullCard);
  }
}
