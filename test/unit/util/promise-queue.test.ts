import { PromiseQueue } from "../../../src";

// note: sometimes these tests take forever (~3s)
// i have not figured out why
describe("promise-queue", () => {
    let createTimeoutPromise = (timeout?: number) => new Promise(resolve => setTimeout(() => resolve(), timeout || 0));

    it("should return the enqueued's promise value", async done => {
        let queue = new PromiseQueue<any>();
        let result = await queue.enqueue(() => Promise.resolve("bamboozled"));

        expect(result).toBe("bamboozled");
        done();
    });

    it("should execute promises in the sequence they were enqueued", async done => {
        let queue = new PromiseQueue<any>();
        let order = [];

        queue.enqueue(() => createTimeoutPromise(3).then(() => order.push(0)));
        queue.enqueue(() => createTimeoutPromise(2)).then(() => order.push(1));
        await queue.enqueue(() => createTimeoutPromise(1)).then(() => order.push(2));

        expect(order).toEqual([0, 1, 2]);
        done();
    });

    it("should continue even if a promise rejected", async done => {
        let queue = new PromiseQueue<any>();
        let didExecute = false;

        queue.enqueue(() => createTimeoutPromise().then(() => Promise.reject<any>(null))).catch(() => (void 0));
        await queue.enqueue(() => createTimeoutPromise()).then(() => didExecute = true);

        expect(didExecute).toBe(true);
        done();
    });

    it("should deadlock if an enqueued promise returns another enqueue", async done => {
        let queue = new PromiseQueue<any>();

        setTimeout(() => {
            done();
        }, 1);

        await queue.enqueue(() => createTimeoutPromise().then(() => queue.enqueue(() => createTimeoutPromise().then(() => {
            fail("expected to deadlock and not execute this line");
            done();
        }))));

        fail("expected to deadlock and not reach this line");
        done();
    });

    it("should not deadlock if an enqueued promise enqueues another promise", async done => {
        let queue = new PromiseQueue<any>();
        let finished = false;

        setTimeout(() => {
            if (finished) return;

            fail("didnt reach expected line");
            done();
        }, 10);

        await queue.enqueue(() => createTimeoutPromise().then(() => {
            queue.enqueue(() => createTimeoutPromise());
        }));

        finished = true;
        done();
    });
});
