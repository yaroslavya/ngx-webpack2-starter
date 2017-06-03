import { Subject, Subscription } from "rxjs";

export class PopupTunnelServiceBase<T, C> {
    private _configs = new Map<string, C>();
    private _selectedObservables = new Map<string, Subject<T>>();

    configure(args: {
        consumer?: string;
        config?: C;
    }): void {
        let config = args.config instanceof Object ? args.config : null;

        this._configs.set(args.consumer || null, config);
    }

    /**
     * Returns the config matching the provided consumer or null if none found.
     */
    getConfig(args: { consumer: string; }): C {
        return this._configs.get(args.consumer) || null;
    }

    subscribeSelected(args: {
        consumer?: string,
        handler: (selected: T) => void
    }): Subscription {
        let consumer = args.consumer || null;

        if (!this._selectedObservables.has(consumer)) {
            this._selectedObservables.set(consumer, new Subject<T>());
        }

        return this._selectedObservables.get(consumer).subscribe(args.handler);
    }

    reportSelected(args: {
        consumer: string,
        selected: T
    }): void {
        let subject = this._selectedObservables.get(args.consumer);

        subject && subject.next(args.selected);
    }
}
