import { Api } from "../components/base/api";
import { Cart } from "../components/not-base/cart";
import { OrderData, OrderResponse } from "../types";
import { API_URL } from "../utils/constants";

export class ApiOrderService extends Api {
	private _cart: Cart;

	constructor(
		cart: Cart
	) {
		super(API_URL);
		this._cart = cart;
	}

	public createOrder(orderData: OrderData): Promise<OrderResponse> {
		return this.post<OrderResponse>('/order', {
			payment: orderData.paymentMethod,
			email: orderData.email,
			phone: orderData.phone,
			address: orderData.address,
			total: this._cart.totalPrice(),
			items: this._cart.getIdProducts()
		});
	}
}