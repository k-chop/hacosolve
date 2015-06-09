//import util = require('./util')

module Haco {

    export class NetOfCube {

        pieces: Piece[];
        all: Piece[];

        constructor() {
            this.pieces = new Array<Piece>(11);

            this.pieces[0] = Piece.fromString(
                "#   " +
                "####" +
                "#   "
                , 4);
            this.pieces[1] = Piece.fromString(
                "#   " +
                "####" +
                " #  "
                , 4);
            this.pieces[2] = Piece.fromString(
                "#   " +
                "####" +
                "  # "
                , 4);
            this.pieces[3] = Piece.fromString(
                "#   " +
                "####" +
                "   #"
                , 4);
            this.pieces[4] = Piece.fromString(
                " #  " +
                "####" +
                " #  "
                , 4);
            this.pieces[5] = Piece.fromString(
                " #  " +
                "####" +
                "  # "
                , 4);
            this.pieces[6] = Piece.fromString(
                "###  " +
                "  ###"
                , 5);
            this.pieces[7] = Piece.fromString(
                "##  " +
                " ###" +
                " #  "
                , 4);
            this.pieces[8] = Piece.fromString(
                "##  " +
                " ###" +
                "  # "
                , 4);
            this.pieces[9] = Piece.fromString(
                "##  " +
                " ###" +
                "   #"
                , 4);
            this.pieces[10] = Piece.fromString(
                "##  " +
                " ## " +
                "  ##"
                , 4);

            this.all = this.allCandidates();
        }

        // return list of all candidates that except same shape piece.
        allCandidates(): Piece[] {

            var all: Piece[] = [];
            for (var i = 0; i < this.pieces.length; i++) {
                all = all.concat(this.pieces[i].variations());
            }
            
            var dist: Piece[] = [], comp: number[] = [];
            for (var i = 0; i < all.length; i++) {
                var hash = all[i].internal_number;
                if (comp.indexOf(hash) == -1) {
                    dist.push(all[i]);
                    comp.push(hash);
                }
            }

            // TODO: なぜか重複削除版だと通らないやつがある
            return all;
        }
    }

    export class Piece {

        internal: boolean[];
        internal_number: number;
        width: number;
        height: number;

        constructor(ns: boolean[], width: number) {
            this.internal = ns;
            this.internal_number = Piece.toNumber(ns);
            this.width = width;
            this.height = ns.length / width;
        }

        static toNumber(arr: boolean[]): number {
            var ret = 0, e = 1, idx = arr.length - 1;
            while (0 <= idx) {
                if (arr[idx]) ret += e;
                e = e << 1;
                idx--;
            }
            return ret;
        }

        static fromString(pattern: string, width: number): Piece {
            // string -> boolean[]
            var ns = new Array<boolean>(pattern.length);
            for (var i = 0; i < pattern.length; i++) {
                if (pattern[i] != ' ') {
                    ns[i] = true;
                } else {
                    ns[i] = false;
                }
            }
            return new Piece(ns, width);
        }

        at(x: number, y: number): boolean {
            return this.internal[y * this.height + x];
        }

        variations(): Piece[] {
            var ret = new Array<Piece>(8);

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

        match(ns: number[], w: number, x: number, y: number): boolean {
            var h = ns.length / w | 0;

            if (w < x + this.width || h < y + this.height) return false;

            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    if (this.internal[i * this.width + j]) {
                        if (ns[(y + i) * w + (x + j)] != 1) {
                            return false;
                        }
                    }
                }
            }

            return true;
        }

        filled(ns: number[], w: number, x: number, y: number, fillNumber: number): number[] {

            var ret = [].concat(ns);
            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++) {
                    if (this.internal[i * this.width + j]) {
                        ret[(y + i) * w + (x + j)] = fillNumber;
                    }
                }
            }
            return ret;
        }

        mirrored(): Piece {

            var l = this.internal.length;
            var ns = new Array<boolean>(l);
            var w = this.width;

            for (var i = w; i <= l; i += w) {
                for (var j = i - 1, k = i - w; k < i; j--, k++) {
                    ns[k] = this.internal[j];
                }
            }
            return new Piece(ns, w);
        }

        rotated90(): Piece {

            var l = this.internal.length;
            var ns = new Array<boolean>(l);
            var w = this.width;
            var h = this.height;

            for (var i = l - w, k = 0; i < l; i++) {
                for (var j = i; j >= 0; j -= w, k++) {
                    ns[k] = this.internal[j];
                }
            }

            return new Piece(ns, this.height);
        }

        toString() {

            var ret = '\n';
            for (var i = 0; i < this.internal.length; i++) {
                if (this.internal[i]) {
                    ret += '#';
                } else {
                    ret += ' ';
                }
                if ((i+1) % this.width == 0) ret += '\n'
            } 
            return ret;
        }

    }

    export class Solver {

        net: NetOfCube;
        ok: number[];
        skip_cache: boolean[];
        skip_cache_hit: number;

        constructor() {
            this.net = new NetOfCube();
            this.ok = null;
            this.skip_cache = [];
        }

        test(): number[] {
            return [1,0,0,0,1,1,1,1,1,0,0,0];
        }

        solve(ns: number[], width: number, callback: any, context): number[]{

            this.ok = null;
            // ns contains 0 or 1 only
            var sumTiles = ns.reduce((p, c, i, a) => p + c)
            // cant solve
            if (sumTiles % 6 != 0) {
                console.log('sum of tiles is '+sumTiles+'. cant solve because cannot mod 6.')
                return ns;
            }

            // bound
            var h = ns.length / width | 0;
            var si = width, sj = h, lx = 0, ly = 0;
            for (var i = 0; i < ns.length; i++) {
                if (ns[i] == 1) {
                    si = Math.min(si, i / width | 0);
                    sj = Math.min(sj, i % width | 0);
                    ly = Math.max(ly, i / width | 0);
                    lx = Math.max(lx, i % width | 0);
                }
            }
            si -= 1; si = Math.max(si, 0);
            sj -= 1; sj = Math.max(sj, 0);
            lx += 5; lx = Math.min(lx, width);
            ly += 5; ly = Math.min(ly, h);
            
            console.log("("+sj+", "+si+") to ("+lx+", "+ly+")")

            this.skip_cache = new Array<boolean>(ns.length);
            this.skip_cache_hit = 0;

            var count = sumTiles / 6 | 0;
            console.log("start! count: " + count);
            var ret = this.solve1(this.copy(ns), width, count, count, 2, 0, 0, lx, ly, callback, context);
            console.log("skip_cache_hit: " + this.skip_cache_hit);
            return ret;
        }

        // ある座標から5*5のエリアに空のタイルが19個以上ある場合、以後その座標はスルー
        skip(ns: number[], width: number, xx: number, yy: number): boolean {
            if (this.skip_cache[yy * width + xx]) {
                this.skip_cache_hit++;
                return true;
            }

            var emptyN = 0, tileN = 0, filledTileN = 0;
            var h = ns.length / width | 0;
            var xe = Math.min(width, xx + 5);
            var ye = Math.min(h, yy + 5);
            for (var i = xx; i < xe; i++) {
                for (var j = yy; j < ye; j++) {
                    if (ns[j * width + i] == 1) {
                        tileN++;
                    } else if (ns[j * width + i] == 0) {
                        emptyN++;
                    } else {
                        filledTileN++;
                    }
                    if (tileN >= 6) return false;
                    if (emptyN > 19) {
                        this.skip_cache[yy * width + xx] = true;
                        return true;
                    }
                    if (emptyN + filledTileN > 19) return true;
                }
            }
        }

        cutoff_check(ns: number[], width: number): boolean {
            var cnt = 0;
            var st = ns.indexOf(1)
            if (st == -1) return true;
            var i = st / width | 0, j = st % width;
            var height = ns.length / width | 0;

            //console.log("a");
            var mark = new Array<boolean>(ns.length);
            var recur = function (x: number, y: number): number {
                //console.log("chk x:" + x + ", y:" + y);
                if (0 <= x && x < width && 0 <= y && y < height && !mark[y * width + x]) {
                    mark[y * width + x] = true;
                    if (ns[y * width + x] == 1) {
                        return 1 + recur(x + 1, y) + recur(x, y + 1) + recur(x, y - 1) + recur(x - 1, y);
                    } else { return 0; }
                } else { return 0; }
            }
            var c = recur(j, i);
            //console.log("c: "+c);
            return c < 6;
        }

        solve1(ns: number[], width: number, count: number, countMax: number, fillNum: number, sx: number, sy: number, lx: number, ly: number, callback: any, context: any): number[] {

            if (count == 1) {
                //console.log("at last!!");
                //sx = 0;
                //sy = 0;
            }

            if (7 < fillNum) {
                fillNum = 2;
            }

            var h = ns.length / width | 0;
            var w = width;
            var len = h * w;

            if (count != countMax && this.cutoff_check(ns, width)) {
                //console.log("cutoff!");
                return ns;
            }

            for (var y = sy; y < ly; y++) {
                for (var x = sx; x < lx; x++) {

                    if (this.skip(ns, width, x, y)) {
                        continue;
                    }

                    var all = this.net.all;
                    for (var i = 0; i < all.length; i++) {
                        if (this.ok == null && all[i].match(ns, w, x, y)) {
                            //console.log("count "+count+", at "+x+","+y+": matched "+all[i].internal_number+""+all[i].toString())
                            var a = all[i].filled(ns, w, x, y, fillNum);
                            if (count == 1) { // found solution
                                this.ok = this.copy(a);
                                ns = a;
                                return ns;
                            } else {
                                this.solve1(a, w, count - 1, countMax, fillNum + 1, x, y, lx, ly, callback, context);
                            }
                        }
                    }
                }
            }

            //callback.apply(context, [count]);

            return ns;
        }

        copy(ns: number[]): number[] {
            return [].concat(ns);
        }

    }


} 