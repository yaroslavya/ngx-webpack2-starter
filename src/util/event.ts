export class Event<S, E> {
    /**
     * If any event handlers should be invoked @ raise().
     */
    isEnabled = true;

    private _handlers = new Array<(sender: S, args: E) => void>();
    private _sender: S;

    /**
     * Determines if any handlers are registered for this event.
     */
    get hasListeners(): boolean {
        return this._handlers.length > 0;
    }

    private _asPublic = <IEvent<S, E>>{
        off: (handler: (sender: S, args: E) => void) => this.off(handler),
        on: (handler: (sender: S, args: E) => void) => this.on(handler),
        once: (handler: (sender: S, args: E) => void) => this.once(handler)
    };

    /**
     * Return a public version of this event, only exposing the on, once and off methods.
     */
    get asPublic(): IEvent<S, E> {
        return this._asPublic;
    }

    constructor(sender: S) {
        this._sender = sender;
    }

    /**
     * Register a handler that is executed each time this event is raised.
     */
    on(handler: (sender: S, args: E) => void): void {
        this._handlers.push(handler);
    }

    /**
     * Register a handler that is executed once the next time this event is raised.
     */
    once(handler: (sender: S, args: E) => void): void {
        let helper = (sender: S, args: E) => {
            this.off(helper);
            handler(sender, args);
        };

        this.on(helper);
    }

    /**
     * Removes a previously registered event handler.
     */
    off(handler: (sender: S, args: E) => void): void {
        let index = this._handlers.indexOf(handler);
        if (index == -1) return;
        this._handlers.splice(index, 1);
    }

    /**
     * Invokes all event handlers with the given arguments, returning a promise that Promise.all's the return values of all handlers.
     */
    raise(args?: E): Promise<any> {
        if (!this.isEnabled || !this.hasListeners) return Promise.resolve();

        let handlers = this._handlers.slice();
        return Promise.all(handlers.map(h => h(this._sender, args)))
    }

    /**
     * Removes all registered event handlers.
     */
    clear(): void {
        this._handlers = new Array<(sender: S, args: E) => void>();
    }
}

/**
 * Interface for publicly accessible methods to an Event.
 */
export interface IEvent<S, E> {
    on(handler: (sender: S, args: E) => void): void;
    once(handler: (sender: S, args: E) => void): void;
    off(handler: (sender: S, args: E) => void): void;
}
