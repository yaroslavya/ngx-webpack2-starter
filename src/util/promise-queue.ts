export class PromiseQueue<T> {
    private _active: Promise<any>;
    private _queue = new Array<IPendingPromise<T>>();

    enqueue(handler: () => Promise<T>): Promise<T> {
        let promise = new Promise<T>((resolve, reject) => {
            this._queue.push(<IPendingPromise<T>>{
                resolved: resolve,
                rejected: reject,
                handler: handler
            });
        });

        this._dequeue();

        return promise;
    }

    private _dequeue(): void {
        if (this._queue.length == 0 || this._active != null) {
            return;
        }

        let next = this._queue.splice(0, 1)[0];

        this._active = next.handler()
            .then((...args: any[]) => next.resolved(...args))
            .catch((...args: any[]) => next.rejected(...args))
            .then(() => {
                this._active = null;
                this._dequeue();
            });
    }
}

interface IPendingPromise<T> {
    resolved: (...args: any[]) => void;
    rejected: (...args: any[]) => void;
    handler: () => Promise<T>;
}
