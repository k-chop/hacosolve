// [begin, end)
export function rnd(begin: number, end: number): number {
  // tslint:disable-next-line:insecure-random
  return Math.floor(Math.random() * (end - begin)) + begin;
}

export class XYAccessWrapper<T> {
  private self: T[];
  private width: number;

  public constructor(self: T[], width: number) {
    this.self = self;
    this.width = width;
  }

  public getter(): (x: number, y: number) => T {
    return (x: number, y: number): T => {
      return this.self[y * this.width + x];
    };
  }

  public setter(op: T): (x: number, y: number) => void {
    return (x: number, y: number): void => {
      this.self[y * this.width + x] = op;
    };
  }
}

export function makeAccessor<T>(arr: T[], width: number): XYAccessWrapper<T> {
  return new XYAccessWrapper(arr, width);
}
