import { Api } from "../components/base/api";
import { Cart } from "../components/not-base/cart";
import { OrderContactData, OrderData, OrderPaymentAndAddressData, OrderResponse, Product } from "../types";
import { API_URL } from "../utils/constants";

export class OrderStepTrackerService extends Api {
	private _order: Partial<OrderData>;
	private _step = 0;
	private _cart: Cart;

	constructor(cart: Cart) {
		super(API_URL);
		this._cart = cart;
	}

	public saveStepOne({ paymentMethod, address }: OrderPaymentAndAddressData): void {
		this._step = 1;
		this._order = { paymentMethod, address, products: this._cart.getProducts() };
	}

	public saveStepTwo({ email, phone }: OrderContactData): void {
		if (this._step !== 1) throw new Error('Перейти на шаг 2 в заказе можно только после 1 шага');
		this._step = 2;

		this._order = {
			...this._order,
			email,
			phone
		};
	}

	public saveServerPostOrderInfo({
		success
	}: {
		success: boolean
	}): void {
		if (success === true) {
			this._step = 0;
			this._order = {};
			return;
		}

		this._step = 1;
	}

	public getOrderData(): OrderData {
		return this._order as unknown as OrderData;
	}

}