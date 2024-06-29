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

	
	public async sendOrderToServer(): Promise<OrderResponse> {
		if (this._step !== 2) throw new Error('Отправить заказ на сервер можно только после шага 2');

		return this.post<OrderResponse>('/order', {
			payment: this._order.paymentMethod,
			email: this._order.email,
			phone: this._order.phone,
			address: this._order.address,
			total: this._cart.totalPrice(),
			items: this._cart.getIdProducts()
		}).then(data => {
			this._step = 0;
			this._order = {};
			return data;
		}).catch((error) => {
			this._step = 1;
			
			throw error;
		}).catch(() => {
			alert('Заказ на сервер не смог отправиться');
			throw 'Заказ на сервер не смог отправиться';
		});
	}


}