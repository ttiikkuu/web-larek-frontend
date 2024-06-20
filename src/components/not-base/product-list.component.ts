import { Product } from "../../types";
import { ProductComponent } from "./product.component";
import { StateEmitter } from "./state-emitter";

export class ProductListComponent {
  private galleryNode: HTMLElement | null;
  private stateEmitter: StateEmitter;

  constructor(stateEmitter: StateEmitter) {
    this.stateEmitter = stateEmitter;
    this.galleryNode = document.querySelector('.gallery');
    if (!this.galleryNode) {
      throw new Error('.gallery не найден');
    }
  }

  public render(products: Product[]): void {
    const fragment = document.createDocumentFragment();

    for (const product of products) {
      const productComponent = new ProductComponent(product, this.stateEmitter);
      const productComponentNode = productComponent.createNode();

      fragment.appendChild(productComponentNode);
    }

    this.galleryNode.appendChild(fragment);
  }
}