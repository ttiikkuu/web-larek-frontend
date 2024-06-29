import { Product } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { getCategoryEng } from "../../utils/utils";
import { Cart } from "./cart";
import { Modal } from "./modal.component";

export class ModalProductFullCardComponent extends Modal {
	private _nodes = {
		fullCardBtnNode: null as any,
		fullCardNode: null as any
	};
  
  private _product: Product;
  private _existInBacket: boolean = false;
  private _cart: Cart;

	constructor(
		cart: Cart,
		content?: HTMLElement,
		nameModal: string = `${Math.random().toFixed(6)}-modal`) {
		super(content, nameModal);
		this._cart = cart;
	}

	public open(): void {
		console.error('Метод open отключён в ModalProductFullCardComponent');
	}

	public openWithProduct(product: Product): void {
		this._product = product;
		this._renderModalContent();
		this._checkIfInCart();
		super.open();
	}

	private _renderModalContent(): void {
		if (this._nodes.fullCardNode === null) {
			this._renderContent(this._createModalContentNode());
			return;
		}

		this._renderContent(this._nodes.fullCardNode);
	}

	private _createModalContentNode(): HTMLElement {
    const fullCardTemplate = document.querySelector<HTMLTemplateElement>('#card-preview')?.content;
    if (!fullCardTemplate) {
      throw new Error('#card-preview не найден');
    }

    const fullCardNode = fullCardTemplate.querySelector('.card_full')?.cloneNode(true) as HTMLElement;
    if (!fullCardNode) {
      throw new Error('.card_full не найден');
    }

    this._initializeCardContent(fullCardNode, this._product);
    this._attachEventListeners();

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
    
    this._nodes.fullCardBtnNode = fullCardBtnNode;
		
		if (product.price === null) {
			this._nodes.fullCardBtnNode.disabled = true;
		}
    
    fullCardCategoryNode.classList.add(`card__category_${getCategoryEng(this._product.category)}`);
    fullCardBtnNode.textContent = 'Добавить в корзину';
    fullCardCategoryNode.textContent = product.category;
    fullCardTitleNode.textContent = product.title;
    fullCardTextNode.textContent = product.description;
    fullCardImageNode.src = `${CDN_URL}${product.image}`;
    fullCardPriceNode.textContent = priceText;
  }

  private _attachEventListeners(): void {
    this._nodes.fullCardBtnNode.addEventListener('click', this._clickCardBtnListener);
  }

	private _clickCardBtnListener = (): void => {
		if (this._existInBacket === true) {
			this._existInBacket = false;
			this._cart.deleteFromCart(this._product);
		} else {
			this._existInBacket = true;
			this._cart.addToCart(this._product);
		}

		this._nodes.fullCardBtnNode.textContent =  this._existInBacket ? 'Удалить из корзины' : 'Добавить в корзину';
	};

	private _checkIfInCart(): void {
		this._existInBacket = this._cart.ifInCart(this._product);
    this._nodes.fullCardBtnNode.textContent = this._existInBacket ? 'Удалить из корзины' : 'Добавить в корзину';
	}

}