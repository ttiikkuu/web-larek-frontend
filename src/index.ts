import { Cart } from './components/not-base/cart';
import { Modal } from './components/not-base/modal.component';
import { ProductFullCard } from './components/not-base/product-full-card.component';
import { ProductList } from './components/not-base/product-list';
import { ShoppingCart } from './components/not-base/shopping-cart.component';
import { StateEmitter } from './components/not-base/state-emitter';
import './scss/styles.scss';
import { ApiProductsService } from './services/api-products.service';
import { Product } from './types';

// const eventEmitter = new EventEmitter();
const stateEmitter = new StateEmitter();
const cart = new Cart(stateEmitter);
const apiProductsService = new ApiProductsService();
const productList = new ProductList(stateEmitter);
const shoppingCart = new ShoppingCart(stateEmitter, cart);

stateEmitter.updateState('cart', {});
apiProductsService.getAll().then(products => {
	productList.render(products);
});

stateEmitter.subscribe<Product>('openFullCard', product => {
	const productFullCard = new ProductFullCard(stateEmitter, cart);
	const productFullCardNode = productFullCard.createNode(product);

	const modal = new Modal(productFullCardNode);

	modal.open({
		closeFn: () => {
			const productId = productFullCard.product.id;
			stateEmitter.updateState(`closeFullCard by id: ${productId}`, {});
		}
	});
});


