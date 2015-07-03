/// <reference path="../typings/bundle.d.ts" />

// [begin, end)
export function rnd(begin: number, end: number): number {
    return Math.floor(Math.random() * (end - begin)) + begin;
}

export function makeAccessor<T>(arr: Array<T>, width: number): XYAccessWrapper<T> {
    return new XYAccessWrapper(arr, width);
}

export class XYAccessWrapper<T> {

    self: Array<T>;
    width: number;

    constructor(self: Array<T>, width: number) {
        this.self = self;
        this.width = width;
    }

    getter(): (x: number, y: number) => T {
        return (x: number, y: number): T => {
            return this.self[y * this.width + x];
        }
    }

    setter(op: T): (x: number, y: number) => void {
        return (x: number, y: number): void => {
            this.self[y * this.width + x] = op;
        }
    }

}
