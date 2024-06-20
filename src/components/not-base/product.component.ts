import { Product } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { getCategoryEng } from "../../utils/utils";
import { StateEmitter } from "./state-emitter";

export class ProductComponent {
	public readonly product: Product;
	private eventEmitter: StateEmitter;

	constructor(product: Product, eventEmitter: StateEmitter) {
    this.product = product;
    this.eventEmitter = eventEmitter;
  }

  public createNode(): HTMLElement {
    const cardNode = this.createCardNode();
    this.attachEventListeners(cardNode);
    return cardNode;
  }

  private createCardNode(): HTMLElement {
    const cardCatalogTemplate = document.querySelector<HTMLTemplateElement>('#card-catalog')?.content;
    if (!cardCatalogTemplate) {
      throw new Error('#card-catalog не найден');
    }

    const cardNode = cardCatalogTemplate.querySelector('.card')?.cloneNode(true) as HTMLElement;
    if (!cardNode) {
      throw new Error('.card не найден в template');
    }

    this.updateCardContent(cardNode);
    return cardNode;
  }

  private updateCardContent(cardNode: HTMLElement): void {
    const cardCategoryNode = cardNode.querySelector<HTMLElement>('.card__category');
    const cardTitleNode = cardNode.querySelector<HTMLElement>('.card__title');
    const cardImgNode = cardNode.querySelector<HTMLImageElement>('.card__image');
    const cardPriceNode = cardNode.querySelector<HTMLElement>('.card__price');

    if (!cardCategoryNode || !cardTitleNode || !cardImgNode || !cardPriceNode) {
      throw new Error('Не найдены узлы внутри card');
    }

    const priceText = this.product.price === null ? 'Бесценно' : `${this.product.price} синапсов`;

    cardCategoryNode.textContent = this.product.category;
    cardCategoryNode.classList.add(`card__category_${getCategoryEng(this.product.category)}`);
    cardTitleNode.textContent = this.product.title;
    cardImgNode.src = `${CDN_URL}${this.product.image}`;
    cardPriceNode.textContent = priceText;
  }

  private attachEventListeners(cardNode: HTMLElement): void {
    cardNode.addEventListener('click', () => {
      this.eventEmitter.updateState('openFullCard', this.product);
      this.eventEmitter.updateState(`openFullCard by id: ${this.product.id}`, this.product);
    });
  }
}