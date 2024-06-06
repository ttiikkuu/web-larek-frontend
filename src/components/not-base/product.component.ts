import { Product } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { EventEmitter } from "../base/events";
import { StateEmitter } from "./state-emitter";

export class ProductComponent {
    public readonly product: Product;
    private eventEmitter: StateEmitter<object>;

    constructor(product: Product, eventEmitter: StateEmitter<object>) {
        this.product = product;
        this.eventEmitter = eventEmitter;
    }

    public createNode() {
        const cardCatalogTemplate = document.querySelector<HTMLTemplateElement>('#card-catalog').content;
        const cardNode = cardCatalogTemplate.querySelector('.card').cloneNode(true) as HTMLElement;
        const cardCategorySoftNode = cardNode.querySelector('.card__category_soft');
        const cardTitleNode = cardNode.querySelector('.card__title');
        const cardImgNode = cardNode.querySelector<HTMLImageElement>('.card__image');
        const cardPriceNode = cardNode.querySelector('.card__price');
        const priceText = this.product.price === null ? 'Бесценно' : `${this.product.price} синапсов`;

        cardCategorySoftNode.textContent = this.product.category;
        cardTitleNode.textContent = this.product.title;
        cardImgNode.src = `${CDN_URL}${this.product.image}`;
        cardPriceNode.textContent = priceText;

        cardNode.addEventListener('click', () => {
            this.eventEmitter.updateState('openFullCard', this.product);
            this.eventEmitter.updateState(`openFullCard by id: ${this.product.id}`, this.product);
        });

        return cardNode;
    }
}