import { ApiProductsService } from "../../services/api-products.service";
import { OrderStepTrackerService } from "../../services/order-step-tracker.service";
import { Product } from "../../types";
import { Cart } from "./cart";
import { ModalCartComponent } from "./modal-cart.component";
import { ModalOrderContactInformationComponent } from "./modal-order-contact-information.component";
import { ModalOrderPaymentAndAddressComponent } from "./modal-order-payment-and-address.component";
import { ModalOrderSuccessfullyPlacedComponent } from "./modal-order-successfully-placed.component";
import { Modal } from "./modal.component";
import { ProductFullCard } from "./product-full-card.component";
import { ProductListComponent } from "./product-list.component";
import { StateEmitter } from "./state-emitter";

export class AppController {
	stateEmitter: StateEmitter;
	cart: Cart;
	apiProductsService: ApiProductsService;
	productListComponent: ProductListComponent;
	orderStepTrackerService: OrderStepTrackerService;
	modalCartComponent: ModalCartComponent;
	modalOrderPaymentAndAddressComponent: ModalOrderPaymentAndAddressComponent;
	modalOrderContactInformationComponent: ModalOrderContactInformationComponent;
	modalOrderSuccessfullyPlacedComponent: ModalOrderSuccessfullyPlacedComponent;

	constructor() {
    this.stateEmitter = new StateEmitter();
    this.cart = new Cart(this.stateEmitter);
		this.orderStepTrackerService = new OrderStepTrackerService(this.cart);
    this.apiProductsService = new ApiProductsService();
    this.productListComponent = new ProductListComponent(this.stateEmitter);
		this.modalOrderSuccessfullyPlacedComponent = new ModalOrderSuccessfullyPlacedComponent(
			this.cart
		);
		this.modalOrderContactInformationComponent = new ModalOrderContactInformationComponent(
			this.stateEmitter,
			this.cart,
			this.orderStepTrackerService,
			this.modalOrderSuccessfullyPlacedComponent
		);
		this.modalOrderPaymentAndAddressComponent = new ModalOrderPaymentAndAddressComponent(
			this.orderStepTrackerService,
			this.modalOrderContactInformationComponent,
		);
    this.modalCartComponent = new ModalCartComponent(
			this.cart,
			this.modalOrderPaymentAndAddressComponent
		);
		// this.modal
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

    const modalProductFullCart = new Modal(productFullCardNode);

		modalProductFullCart.open();
		modalProductFullCart.onClose(() => {
			const productId = productFullCard.product.id;
      this.stateEmitter.updateState(`closeFullCard by id: ${productId}`, {});
		});
  }
}