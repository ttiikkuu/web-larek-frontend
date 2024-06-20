import { FunctionVoid } from "../../types";
import { StateEmitter } from "./state-emitter";

export class Modal {
	private _pageWrapperNode = document.querySelector('.page__wrapper');
	private _modalContainerNode = document.querySelector('#modal-container');
	private _modalContentNode = this._modalContainerNode.querySelector('.modal__content');
	private _modalCloseNode = this._modalContainerNode.querySelector('.modal__close');
	private _closeFn: FunctionVoid = () => { };
	private _nameModal: string;
	private _stateEmitter: StateEmitter;

	constructor(content: HTMLElement, stateEmitter: StateEmitter, nameModal: string = `${crypto.randomUUID()}-modal`) {
		this._modalContentNode.textContent = '';
		this._nameModal = nameModal;
		this._stateEmitter = stateEmitter;

		this._stateEmitter.subscribeNewEvents(`close ${nameModal}`, () => {			
			this.close();
		});

		this._stateEmitter.subscribeNewEvents(`open ${nameModal}`, () => {			
			this.open();
		});

		if (content !== undefined) this._modalContentNode.append(content);
	}

	public open({ closeFn }: { closeFn: FunctionVoid } = { closeFn: this._closeFn }): void {
		this._modalContainerNode.classList.add('modal_active');
		this._pageWrapperNode.classList.add('page__wrapper_locked');
		this._closeFn = closeFn;
		this._addEventListeners();
	}

	public close(): void {
		this._modalContainerNode.classList.remove('modal_active');
		this._pageWrapperNode.classList.remove('page__wrapper_locked');
		this._closeFn();
		this._removeEventListeners();
	}

	private _addEventListeners(): void {
		window.addEventListener('keydown', this._closeEscListener);
		this._modalCloseNode.addEventListener('click', this._closeBtnClickListener);
		this._modalContainerNode.addEventListener('click', this._closeOverlayClickListener);
	}

	private _removeEventListeners(): void {
		window.removeEventListener('keydown', this._closeEscListener);
		this._modalCloseNode.removeEventListener('click', this._closeBtnClickListener);
		this._modalContainerNode.removeEventListener('click', this._closeOverlayClickListener);
	}

	private _closeEscListener = (event: KeyboardEvent): void => {
		const keyPressed = event.key;

		if (keyPressed === 'Escape') this.close();
	};

	private _closeBtnClickListener = (event: PointerEvent): void => {
		this.close();
	}

	private _closeOverlayClickListener = (event: PointerEvent): void => {
		event.stopPropagation();
		const targetNode = event.target as HTMLElement;
		const closestModalContainerNode = targetNode.closest('.modal__container'); // Если в родителях есть 
		
		if (closestModalContainerNode === null) this.close();
	}
}