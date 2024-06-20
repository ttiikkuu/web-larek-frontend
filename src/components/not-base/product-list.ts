import { Product } from "../../types";
import { EventEmitter } from "../base/events";
import { ProductComponent } from "./product.component";
import { StateEmitter } from "./state-emitter";

export class ProductList {
	private galleryNode = document.querySelector('.gallery');
	private stateEmitter: StateEmitter;

	constructor(stateEmitter: StateEmitter) {
		this.stateEmitter = stateEmitter;
	}

	public render(products: Product[]): void {
		for (const product of products) {
			const productComponent = new ProductComponent(product, this.stateEmitter);
			const productComponentNode = productComponent.createNode();

			this.galleryNode.append(productComponentNode);
		}
	}
}