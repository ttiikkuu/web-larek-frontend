import { ApiProductsService } from "../../services/api-products.service";
import { Product } from "../../types";
import { Cart } from "./cart";
import { Modal } from "./modal.component";
import { ProductFullCard } from "./product-full-card.component";
import { ProductListComponent } from "./product-list.component";
import { ShoppingCartComponent } from "./shopping-cart.component";
import { StateEmitter } from "./state-emitter";

export class AppController {
	stateEmitter: StateEmitter;
	cart: Cart;
	apiProductsService: ApiProductsService;
	productListComponent: ProductListComponent;
	shoppingCartComponent: ShoppingCartComponent

	constructor() {
    this.stateEmitter = new StateEmitter();
    this.cart = new Cart(this.stateEmitter);
    this.apiProductsService = new ApiProductsService();
    this.productListComponent = new ProductListComponent(this.stateEmitter);
    this.shoppingCartComponent = new ShoppingCartComponent(this.stateEmitter, this.cart);
  }

  init(): void {
    this.stateEmitter.updateState('cart', {});
    this.loadProducts();
    this.setupEventListeners();
  }

  loadProducts(): void {
    this.apiProductsService.getAll().then(products => {
      this.productListComponent.render(products);
    });
  }

  setupEventListeners(): void {
    this.stateEmitter.subscribe<Product>('openFullCard', product => {
      this.showProductFullCard(product);
    });
  }

  showProductFullCard(product: Product): void {
    const productFullCard = new ProductFullCard(this.stateEmitter, this.cart);
    const productFullCardNode = productFullCard.createNode(product);

    const modal = new Modal(productFullCardNode, this.stateEmitter);

    modal.open({
      closeFn: () => {
        const productId = productFullCard.product.id;
        this.stateEmitter.updateState(`closeFullCard by id: ${productId}`, {});
      }
    });
  }
}