import { Product } from "../../types";
import { ProductComponentFactory } from "./product-component-factory";

export class ProductListComponent {
  private _galleryNode: HTMLElement | null;
	private _productComponentFactory: ProductComponentFactory;

  constructor(productComponentFactory: ProductComponentFactory) {
		this._productComponentFactory = productComponentFactory;
    this._galleryNode = document.querySelector('.gallery');
    if (!this._galleryNode) {
      throw new Error('.gallery не найден');
    }
  }

  public render(products: Product[]): void {
    const fragment = document.createDocumentFragment();

    for (const product of products) {
      const productComponent = this._productComponentFactory.create(product);
      const productComponentNode = productComponent.createNode();

      fragment.appendChild(productComponentNode);
    }

    this._galleryNode.appendChild(fragment);
  }
}