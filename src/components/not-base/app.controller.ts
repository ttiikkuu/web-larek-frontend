import { ApiProductsService } from "../../services/api-products.service";
import { OrderStepTrackerService } from "../../services/order-step-tracker.service";
import { Product } from "../../types";
import { Cart } from "./cart";
import { ModalCartComponent } from "./modal-cart.component";
import { ModalOrderContactInformationComponent } from "./modal-order-contact-information.component";
import { ModalOrderPaymentAndAddressComponent } from "./modal-order-payment-and-address.component";
import { ModalOrderSuccessfullyPlacedComponent } from "./modal-order-successfully-placed.component";
import { ModalProductFullCardComponent } from "./modal-product-full-card.component";
import { ProductComponentFactory } from "./product-component-factory";
import { ProductListComponent } from "./product-list.component";
import { ProductComponent } from "./product.component";
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
	modalProductFullCardComponent: ModalProductFullCardComponent;
	productComponent: ProductComponent;
	productComponentFactory: ProductComponentFactory;

	constructor() {
    this.stateEmitter = new StateEmitter();
    this.cart = new Cart(this.stateEmitter);
		this.orderStepTrackerService = new OrderStepTrackerService(this.cart);
    this.apiProductsService = new ApiProductsService();
		this.productComponentFactory = new ProductComponentFactory(this.stateEmitter);
    this.productListComponent = new ProductListComponent(this.productComponentFactory);
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
		this.modalProductFullCardComponent = new ModalProductFullCardComponent(this.cart);

		// this.modal
  }

  init(): void {
    this.stateEmitter.updateState('cart', {});
    this.loadProducts();
    this.setupEventListeners();
  }

  loadProducts(): void {
    this.apiProductsService.getAll().then(products => {
			console.log(products);
			
      this.productListComponent.render(products);
    });
  }

  setupEventListeners(): void {
    this.stateEmitter.subscribe<Product>('openFullCard', product => {
      this.showProductFullCard(product);
    });
  }

  showProductFullCard(product: Product): void {
		this.modalProductFullCardComponent.openWithProduct(product);
  }
}