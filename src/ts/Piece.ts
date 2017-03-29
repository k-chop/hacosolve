export class Piece {

    public internal: boolean[];
    public internalNumber: number;
    public width: number;
    public height: number;

    constructor(ns: boolean[], width: number) {
        this.internal = ns;
        this.internalNumber = Piece.CALC_INTERNAL_NUMBER(ns, width);
        this.width = width;
        this.height = ns.length / width;
    }

    public static CALC_INTERNAL_NUMBER(arr: boolean[], width: number): number {
        let ret = 0;
        let e = 1;
        let idx = arr.length - 1;
        while (0 <= idx) {
            if (arr[idx]) { ret += e; }
            e = e << 1;
            idx -= 1;
        }
        // possible width = 2,3,4,5 (3bit)
        ret <<= 3;
        ret += width;
        return ret;
    }

    public static FROM_STRING(pattern: string, width: number): Piece {
        // string -> boolean[]
        const ns = new Array<boolean>(pattern.length);
        for (let i = 0; i < pattern.length; i += 1) {
            if (pattern[i] !== ' ') {
                ns[i] = true;
            } else {
                ns[i] = false;
            }
        }
        return new Piece(ns, width);
    }

    public eq(that: Piece): boolean {
        return this.internalNumber === that.internalNumber;
    }

    public at(x: number, y: number): boolean {
        if (0 <= x && x < this.width && 0 <= y && y < this.height) {
            return this.internal[y * this.width + x];
        } else {
            return undefined;
        }
    }

    // 自身を90/180/270度回転したものとそれぞれの鏡像を作り、リストにぶち込んで返す
    public variations(): Piece[] {
        const ret = new Array<Piece>(8);

        // self
        ret[0] = this;
        // mirror image
        ret[1] = this.mirrored();
        // rotate90
        ret[2] = this.rotated90();
        // rotate90 mirror
        ret[3] = ret[2].mirrored();
        // rotate180
        ret[4] = ret[2].rotated90();
        // rotate180 mirror
        ret[5] = ret[4].mirrored();
        // rotate270
        ret[6] = ret[4].rotated90();
        // rotate270 mirror
        ret[7] = ret[6].mirrored();

        return ret;
    }

    /*
    matchF(ns: number[], nsWidth: number, x: number, y: number): boolean {
        return this.matchF(ns, nsWidth, x, y, (n: number) => { return n != 1; });
    }
    */

    public matchN(ns: number[], nsWidth: number, x: number, y: number): number {
        const h = ns.length / nsWidth | 0;
        let tileCheck = 0;

        if (nsWidth < x + this.width || h < y + this.height) { return -1; }

        for (let i = 0; i < this.height; i += 1) {
            for (let j = 0; j < this.width; j += 1) {
                const n = ns[(y + i) * nsWidth + (x + j)];

                if (this.internal[i * this.width + j] && n !== 0) {
                    return -1;
                }

                if (n === 1) {
                    tileCheck += 1;
                }
            }
        }
        return tileCheck;
    }

    //matchF(ns: number[], nsWidth: number, x: number, y: number, f: (n: number) => boolean): boolean {
    public match(ns: number[], nsWidth: number, x: number, y: number): boolean {
        const h = ns.length / nsWidth | 0;

        if (nsWidth < x + this.width || h < y + this.height) {
            return false;
        }

        for (let i = 0; i < this.height; i += 1) {
            for (let j = 0; j < this.width; j += 1) {
                if (this.internal[i * this.width + j]) {
                    if (ns[(y + i) * nsWidth + (x + j)] !== 1) {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    public filled(ns: number[], nsWidth: number, x: number, y: number, fillNumber: number): number[] {

        const ret = [].concat(ns);
        for (let i = 0; i < this.height; i += 1) {
            for (let j = 0; j < this.width; j += 1) {
                if (this.internal[i * this.width + j]) {
                    ret[(y + i) * nsWidth + (x + j)] = fillNumber;
                }
            }
        }
        return ret;
    }

    // このピースの鏡像を返す
    public mirrored(): Piece {

        const l = this.internal.length;
        const ns = new Array<boolean>(l);
        const w = this.width;

        for (let i = w; i <= l; i += w) {
            for (let j = i - 1, k = i - w; k < i; j -= 1 , k += 1) {
                ns[k] = this.internal[j];
            }
        }
        return new Piece(ns, w);
    }

    // このピースを右に90度回転したものを返す
    public rotated90(): Piece {

        const l = this.internal.length;
        const ns = new Array<boolean>(l);
        const w = this.width;
        const h = this.height;

        for (let i = l - w, k = 0; i < l; i += 1) {
            for (let j = i; j >= 0; j -= w, k += 1) {
                ns[k] = this.internal[j];
            }
        }

        return new Piece(ns, this.height);
    }

    // デバッグ出力用
    public toString() {

        let ret = '\n';
        for (let i = 0; i < this.internal.length; i += 1) {
            if (this.internal[i]) {
                ret += '#';
            } else {
                ret += ' ';
            }
            if ((i + 1) % this.width === 0) {
                ret += '\n';
            }
        }
        return ret;
    }
}