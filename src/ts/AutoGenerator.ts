/// <reference path="../typings/bundle.d.ts" />

module Haco {

    export class AutoGenerator {

        net: NetOfCube;
        field: number[];
        width: number;
        height: number;
        SIZE_LIMIT = 20;

        accessor: util.XYAccessWrapper<number>;

        constructor(width: number, height: number) {
            this.net = new NetOfCube();
            this.width = Math.min(width, this.SIZE_LIMIT);
            this.height = Math.min(height, this.SIZE_LIMIT);
            this.field = new Array<number>(width * height);
            for (var i = 0; i < this.field.length; i++) this.field[i] = 0;

            this.accessor = util.makeAccessor(this.field, width);
        }

        generate(n: number): number[] {
            // NetOfCube.allCandidateからランダムに選択して左上から置いていく
            // 置けないなら右か下にずらしていく

            var ns = [].concat(this.field);
            


            for (var i = 0; i < n; i++) {
                var p = this.net.all[util.rnd(0, this.net.all.length)];

                var y = this.height / 2 | 0;
                var x = this.width / 2 | 0;

                var r = 0;
                var failed = 0;

                if (i == 0) {
                    if (p.matchN(ns, this.width, x, y) != -1) {
                        ns = p.filled(ns, this.width, x, y, 1);
                        continue;
                    } else {
                        console.log("cannot init field.")
                        break;
                    }
                }

                // 全マスに置いてみて一番隣接マスが多い所に置く
                var px = -1, py = -1, pn = -1;

                for (var yy = 0; yy < this.height; yy++) {
                    for (var xx = 0; xx < this.width; xx++) {
                        var pp = p.matchN(ns, this.width, xx, yy)
                        if (pn < pp) {
                            px = xx;
                            py = yy;
                            pn = pp;
                        }
                    }
                }

                if (px != -1 && py != -1 && pn != -1) {
                    ns = p.filled(ns, this.width, px, py, 1);
                } else {
                    console.log("something wrong :(")
                }
            }
            return ns;
        }

    }
} 