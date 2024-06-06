import { EventEmitter } from "../base/events";
import { StateEmitter } from "./state-emitter";

export class ShoppingCart {
    private headerBasketNode = document.querySelector('.header__basket');
    private headerBasketCounterNode = document.querySelector('.header__basket-counter');
    private stateEmitter: StateEmitter<object>;
    // private cart = [
        
    // ];
    
    constructor(stateEmitter: StateEmitter<object>) {
        this.stateEmitter = stateEmitter;
        this.initEventListeners();
    }

    private initEventListeners(): void {
        this.headerBasketNode.addEventListener('click', () => {

        });
        this.stateEmitter.subscribe('cart', (product) => {
            console.log(product, 'cart', 'shoppingCart');
        });
    }

    



}