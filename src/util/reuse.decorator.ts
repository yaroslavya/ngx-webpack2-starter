import * as deepEqual from "deep-equal";
import * as deepClone from "clone";

type ReusablePromise = {
    args: any;
    promise: Promise<any>;
};

/**
 * Reuse the promise returned by this function until it resolved or rejected.
 * Uses deep equal & deep clone on the arguments.
 * 
 * note: not sure if it could, under some circumstances, break zone aware promises
 * since we might me reusing a promise that was created in zone A and gets reused in zone B.
 */
export function Reuse() {
    return (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>) => {
        let originalMethod = descriptor.value;
        let promises = new Array<ReusablePromise>();

        descriptor.value = function (...args: any[]) {
            let cloned = deepClone(args, true); //without true Fails on otc-coupons with recursive content inside integration tests
            let reusable = promises.find(p => deepEqual(p.args, cloned));

            if (reusable) {
                return reusable.promise;
            }

            let result = originalMethod.apply(this, args);

            if (!(result instanceof Promise)) {
                return result;
            }

            promises.push({ args: cloned, promise: result });
            result
                .then(() => promises.splice(promises.findIndex(x => x.promise == result), 1))
                .catch(() => promises.splice(promises.findIndex(x => x.promise == result), 1));

            return result;
        };

        return descriptor;
    };
};
