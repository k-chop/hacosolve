import { NetOfCube } from './NetOfCube'
import * as util from './util'

export class AutoGenerator {
  public net: NetOfCube
  public field: number[]
  public width: number
  public height: number
  public SIZE_LIMIT = 100

  public accessor: util.XYAccessWrapper<number>

  public constructor(width: number, height: number) {
    this.net = new NetOfCube()
    this.width = Math.min(width, this.SIZE_LIMIT)
    this.height = Math.min(height, this.SIZE_LIMIT)
    this.field = new Array<number>(width * height)
    for (let i = 0; i < this.field.length; i += 1) {
      this.field[i] = 0
    }
    this.accessor = util.makeAccessor(this.field, width)
  }

  public generate(n: number): number[] {
    // NetOfCube.allCandidateからランダムに選択して左上から置いていく
    // 置けないなら右か下にずらしていく

    let ns = [...this.field]

    for (let i = 0; i < n; i += 1) {
      const p = this.net.all[util.rnd(0, this.net.all.length)]

      const y = (this.height / 2) | 0
      const x = (this.width / 2) | 0

      if (i === 0) {
        if (p.matchN(ns, this.width, x, y) !== -1) {
          ns = p.filled(ns, this.width, x, y, 1)
          continue
        } else {
          console.log('cannot init field.')
          break
        }
      }

      // 全マスに置いてみて一番隣接マスが多い所に置く
      let px = -1
      let py = -1
      let pn = -1

      for (let yy = 0; yy < this.height; yy += 1) {
        for (let xx = 0; xx < this.width; xx += 1) {
          const pp = p.matchN(ns, this.width, xx, yy)
          if (pn < pp) {
            px = xx
            py = yy
            pn = pp
          }
        }
      }

      if (px !== -1 && py !== -1 && pn !== -1) {
        ns = p.filled(ns, this.width, px, py, 1)
      } else {
        console.log('something wrong :(')
      }
    }

    return ns
  }
}
