import { NetOfCube } from "./NetOfCube";

export class Solver {
  public net: NetOfCube;
  // 答えが入る、見つかっていない場合はundefined
  public solution: number[];
  public skipCache: boolean[];
  public skipCacheHit: number;
  public message: string;
  public foundCubeCount: number;

  constructor() {
    this.net = new NetOfCube();
    this.skipCache = [];
    this.message = "";
    this.foundCubeCount = 0;
  }

  public solve(ns: number[], width: number): number[] {
    this.solution = undefined;
    // ns contains 0 or 1 only
    const sumTiles = ns.reduce((p, c, i, a) => p + c);
    // cant solve
    if (sumTiles % 6 !== 0) {
      const mes = `sum of tiles is ${sumTiles}. cant solve because cannot mod 6.`;
      this.message = mes;
      console.log(mes);

      return ns;
    }

    // bounds
    const h = (ns.length / width) | 0;
    let sy = h;
    let sx = width;
    let lx = 0;
    let ly = 0;
    for (let i = 0; i < ns.length; i += 1) {
      if (ns[i] === 1) {
        sy = Math.min(sy, (i / width) | 0);
        sx = Math.min(sx, i % width | 0);
        ly = Math.max(ly, (i / width) | 0);
        lx = Math.max(lx, i % width | 0);
      }
    }
    console.log(`Bounds is (${sx}, ${sy}) to (${lx}, ${ly})`);

    this.skipCache = new Array<boolean>(ns.length);
    this.skipCacheHit = 0;

    const tileCount = (sumTiles / 6) | 0;
    console.log(`start! cube count: ${tileCount}`);
    const ret = this.solve1(
      this.copy(ns),
      width,
      tileCount,
      tileCount,
      2,
      sx,
      sy,
      sx,
      sy,
      lx,
      ly
    );
    console.log(`skip_cache_hit: ${this.skipCacheHit}`);

    if (this.solution !== undefined) {
      this.foundCubeCount = (sumTiles / 6) | 0;
    }

    return ret;
  }

  // ある座標から5*5のエリアに空のタイルが19個以上ある場合、以後その座標のチェックはスルー
  private skip(ns: number[], width: number, xx: number, yy: number): boolean {
    if (this.skipCache[yy * width + xx]) {
      this.skipCacheHit += 1;

      return true;
    }

    let emptyN = 0;
    let tileN = 0;
    let filledTileN = 0;
    const h = (ns.length / width) | 0;
    const xe = Math.min(width, xx + 5);
    const ye = Math.min(h, yy + 5);
    for (let i = xx; i < xe; i += 1) {
      for (let j = yy; j < ye; j += 1) {
        if (ns[j * width + i] === 1) {
          tileN += 1;
        } else if (ns[j * width + i] === 0) {
          emptyN += 1;
        } else {
          filledTileN += 1;
        }
        if (tileN >= 6) {
          return false;
        }
        if (emptyN > 19) {
          this.skipCache[yy * width + xx] = true;

          return true;
        }
        if (emptyN + filledTileN > 19) {
          return true;
        }
      }
    }
  }

  // 一番左上にあるタイルに隣接したタイルが6つより少ないかどうか
  private cutoffCheck(ns: number[], width: number): boolean {
    const st = ns.indexOf(1);
    if (st === -1) {
      return true;
    }
    const i = (st / width) | 0;
    const j = st % width;
    const height = (ns.length / width) | 0;

    const mark = new Array<boolean>(ns.length);
    const recur = (x: number, y: number): number => {
      if (0 <= x && x < width && 0 <= y && y < height && !mark[y * width + x]) {
        mark[y * width + x] = true;
        if (ns[y * width + x] === 1) {
          return (
            1 +
            recur(x + 1, y) +
            recur(x, y + 1) +
            recur(x, y - 1) +
            recur(x - 1, y)
          );
        } else {
          return 0;
        }
      } else {
        return 0;
      }
    };
    const c = recur(j, i);

    return c < 6;
  }

  private solve1(
    ns: number[],
    width: number,
    count: number,
    countMax: number,
    fillNum: number,
    sx: number,
    sy: number,
    nx: number,
    ny: number,
    lx: number,
    ly: number
  ): number[] {
    if (7 < fillNum) {
      fillNum = 2;
    }

    const h = (ns.length / width) | 0;
    const w = width;
    const len = h * w;

    if (count !== countMax && this.cutoffCheck(ns, width)) {
      return ns;
    }

    const nextX = nx;
    const nextY = ny;

    for (let y = sy; y < ly; y += 1) {
      for (let x = sx; x < lx; x += 1) {
        if (nx !== -1 && ny !== -1) {
          x = nx;
          y = ny;
          nx = -1;
          ny = -1;
        }

        if (this.skip(ns, width, x, y)) {
          continue;
        }

        if (this.solution !== undefined) {
          return ns;
        }

        const all = this.net.all;
        for (const piece of all) {
          if (this.solution === undefined && piece.match(ns, w, x, y)) {
            const a = piece.filled(ns, w, x, y, fillNum);
            if (count === 1) {
              // found solution
              this.solution = this.copy(a);
              ns = a;

              return ns;
            } else {
              this.solve1(
                a,
                w,
                count - 1,
                countMax,
                fillNum + 1,
                sx,
                sy,
                x,
                y,
                lx,
                ly
              );
            }
          }
        }
      }
    }

    return ns;
  }

  private copy(ns: number[]): number[] {
    return [].concat(ns);
  }
}
