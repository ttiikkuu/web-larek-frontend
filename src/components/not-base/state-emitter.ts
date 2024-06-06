import { EventEmitter } from "../base/events";

type EventName = string | RegExp;
type Subscriber<T> = (state: T) => void;
type EmitterEvent = {
	eventName: string;
	state: unknown;
};
type EventInfo<T> = {
	state: T;
	subscribers: Set<Subscriber<T>>;
}

export class StateEmitter<T extends object> {
	private _eventStateMap: Map<EventName, EventInfo<T>>;

	constructor() {
		this._eventStateMap = new Map<EventName, EventInfo<T>>();
	}

	public updateState(eventName: EventName, newChangedState: Partial<T>): void {
		const eventInfo = this._eventStateMap.get(eventName);
		const eventInfoState = eventInfo === undefined ? {} : eventInfo.state;

		const newState = {
			...eventInfoState,
			...newChangedState
		} as T;

		this.setState(eventName, newState);
	}

	public getState(eventName: EventName) {
		const eventInfo = this._eventStateMap.get(eventName);

		if (eventInfo === undefined) return {};

		return eventInfo.state;
	}

	public setState(eventName: EventName, newState: T): void {
		let eventInfo = this._eventStateMap.get(eventName);

		if (eventInfo === undefined) {
			eventInfo = { state: newState, subscribers: new Set<Subscriber<T>>() };
			this._eventStateMap.set(eventName, eventInfo);
		} else {
			eventInfo.state = newState;
		}

		eventInfo.subscribers.forEach(subscriber => subscriber(eventInfo.state));
	}

	public getAllState() {
		return this._eventStateMap;
	}

	public subscribe<T>(eventName: EventName, listener: Subscriber<T>, {
		onlyFutureEvents
	} = { onlyFutureEvents: false }): void {
		let eventInfo = this._eventStateMap.get(eventName) as unknown as EventInfo<T> | undefined;

		if (!eventInfo) {
			eventInfo = { state: undefined as unknown as T, subscribers: new Set<Subscriber<T>>() };
			this._eventStateMap.set(eventName, eventInfo as any);
		}

		eventInfo.subscribers.add(listener);

		// Если есть сохраненное состояние для данного события, немедленно уведомим подписчика
		if (onlyFutureEvents === false && eventInfo.state !== undefined) {
			listener(eventInfo.state);
		}
	}

	public subscribeNewEvents(eventName: EventName, listener: Subscriber<T>) {
		let eventInfo = this._eventStateMap.get(eventName) as unknown as EventInfo<T> | undefined;

		if (!eventInfo) {
			eventInfo = { state: undefined as unknown as T, subscribers: new Set<Subscriber<T>>() };
			this._eventStateMap.set(eventName, eventInfo as any);
		}

		eventInfo.subscribers.add(listener);
	}

	public unsubscribe(eventName: EventName, listener: (state: T) => void, isFullDelete: boolean = false): void {
		// console.log(this._eventStateMap.get(eventName), eventName);

		const eventInfo = this._eventStateMap.get(eventName);

		if (eventInfo) {
			eventInfo.subscribers.delete(listener);
			if (eventInfo.subscribers.size === 0) {
				if (isFullDelete === true) {
					this._eventStateMap.delete(eventName);
				}
			}
		}
	}

	public unsubscribeAll(eventName: EventName): void {
		const eventInfo = this._eventStateMap.get(eventName);

		if (eventInfo !== undefined) {
			eventInfo.subscribers.clear();
		}
	}
}