import { Product } from "../../types";
import { ProductComponent } from "./product.component";
import { StateEmitter } from "./state-emitter";

export class ProductComponentFactory {
  private stateEmitter: StateEmitter;

  constructor(stateEmitter: StateEmitter) {
    this.stateEmitter = stateEmitter;
  }

  create(product: Product): ProductComponent {
    return new ProductComponent(product, this.stateEmitter);
  }
}
