import * as _ from "lodash";

export class ShortMemoryMap<K, V> {
    private _valueGetter: (key: K) => V;
    private _cached: { key: K, value: V };

    constructor(getValue: (key: K) => V) {
        this._valueGetter = getValue;
    }

    get(key: K): V {
        if (this._cached == null || !_.isEqual(this._cached.key, key)) {
            this._cached = { key: key, value: this._valueGetter(key) };
        }

        return this._cached.value;
    }
}