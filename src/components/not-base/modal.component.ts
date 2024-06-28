import { FunctionVoid } from "../../types";
import { StateEmitter } from "./state-emitter";

export class Modal {
	private _pageWrapperNode = document.querySelector('.page__wrapper');
	private _modalContainerNode = document.querySelector('#modal-container');
	private _modalContentNode = this._modalContainerNode.querySelector('.modal__content');
	private _modalCloseNode = this._modalContainerNode.querySelector('.modal__close');
	private _nameModal: string;
	protected _isOpen: boolean = false;
	protected _stateEmitter: StateEmitter;
	private _onOpen = () => {};
	private _onClose = () => {};

	constructor(content?: HTMLElement, nameModal: string = `${Math.random().toFixed(6)}-modal`) {
		this._modalContentNode.textContent = '';
		this._nameModal = nameModal;

		if (content !== undefined) this._renderContent(content);
	}

	public open(): void {
		this._isOpen = true;
		this._modalContainerNode.classList.add('modal_active');
		this._pageWrapperNode.classList.add('page__wrapper_locked');
		this._onOpen();
		this._addEventListeners();
	}

	public close(): void {
		this._isOpen = false;
		this._modalContainerNode.classList.remove('modal_active');
		this._pageWrapperNode.classList.remove('page__wrapper_locked');
		this._onClose();
		this._removeEventListeners();
	}

	public onOpen(callback: VoidFunction): void {
		this._onOpen = callback;
	}

	public onClose(callback: VoidFunction): void {
		this._onClose = callback;
	}

	protected _renderContent(content: HTMLElement): void {
		this._modalContentNode.textContent = '';
		this._modalContentNode.append(content);
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
		const closestModalContainerNode = targetNode.closest('.modal__container');
		
		if (closestModalContainerNode === null) this.close();
	}
}