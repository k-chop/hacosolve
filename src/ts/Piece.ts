export class Piece {
  public internal: boolean[]
  public internalNumber: number
  public width: number
  public height: number

  public constructor(ns: boolean[], width: number) {
    this.internal = [...ns]
    this.internalNumber = Piece.calcInternalNumber(ns, width)
    this.width = width
    this.height = Math.floor(ns.length / width)
  }

  public static calcInternalNumber(arr: boolean[], width: number): number {
    let ret = 0
    let e = 1
    let idx = arr.length - 1
    while (idx >= 0) {
      if (arr[idx]) {
        ret += e
      }
      e = e << 1
      idx -= 1
    }
    // possible width = 2,3,4,5 (3bit)
    ret <<= 3
    ret += width

    return ret
  }

  public static fromString(pattern: string, width: number): Piece {
    // string -> boolean[]
    const ns = new Array<boolean>(pattern.length)
    for (let i = 0; i < pattern.length; i += 1) {
      if (pattern[i] !== ' ') {
        ns[i] = true
      } else {
        ns[i] = false
      }
    }

    return new Piece(ns, width)
  }

  public eq(that: Piece): boolean {
    return this.internalNumber === that.internalNumber
  }

  public at(x: number, y: number): boolean {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      return this.internal[y * this.width + x]
    } else {
      return undefined
    }
  }

  // 自身を90/180/270度回転したものとそれぞれの鏡像を作り、リストにぶち込んで返す
  public variations(): Piece[] {
    const ret = new Array<Piece>(8)

    // self
    ret[0] = this
    // mirror image
    ret[1] = this.mirrored()
    // rotate90
    ret[2] = this.rotated90()
    // rotate90 mirror
    ret[3] = ret[2].mirrored()
    // rotate180
    ret[4] = ret[2].rotated90()
    // rotate180 mirror
    ret[5] = ret[4].mirrored()
    // rotate270
    ret[6] = ret[4].rotated90()
    // rotate270 mirror
    ret[7] = ret[6].mirrored()

    return ret
  }

  public matchN(ns: number[], nsWidth: number, x: number, y: number): number {
    const h = (ns.length / nsWidth) | 0
    let tileCheck = 0

    if (nsWidth < x + this.width || h < y + this.height) {
      return -1
    }

    for (let i = 0; i < this.height; i += 1) {
      for (let j = 0; j < this.width; j += 1) {
        const n = ns[(y + i) * nsWidth + (x + j)]

        if (this.internal[i * this.width + j] && n !== 0) {
          return -1
        }

        if (n === 1) {
          tileCheck += 1
        }
      }
    }

    return tileCheck
  }

  public match(ns: number[], nsWidth: number, x: number, y: number): boolean {
    const h = (ns.length / nsWidth) | 0

    if (nsWidth < x + this.width || h < y + this.height) {
      return false
    }

    for (let i = 0; i < this.height; i += 1) {
      for (let j = 0; j < this.width; j += 1) {
        if (this.internal[i * this.width + j]) {
          if (ns[(y + i) * nsWidth + (x + j)] !== 1) {
            return false
          }
        }
      }
    }

    return true
  }

  public filled(
    ns: number[],
    nsWidth: number,
    x: number,
    y: number,
    fillNumber: number
  ): number[] {
    const ret = [].concat(ns)
    for (let i = 0; i < this.height; i += 1) {
      for (let j = 0; j < this.width; j += 1) {
        if (this.internal[i * this.width + j]) {
          ret[(y + i) * nsWidth + (x + j)] = fillNumber
        }
      }
    }

    return ret
  }

  // このピースの鏡像を返す
  public mirrored(): Piece {
    const l = this.internal.length
    const ns = new Array<boolean>(l)
    const w = this.width

    for (let i = w; i <= l; i += w) {
      let j = i - 1
      let k = i - w
      for (; k < i; j -= 1, k += 1) {
        ns[k] = this.internal[j]
      }
    }

    return new Piece(ns, w)
  }

  // このピースを右に90度回転したものを返す
  public rotated90(): Piece {
    const l = this.internal.length
    const ns = new Array<boolean>(l)
    const w = this.width
    const h = this.height

    for (let toIdx = 0, row = 0; toIdx < l; row += 1) {
      for (
        let fromIdx = (h - 1) * w + row;
        fromIdx >= 0;
        fromIdx -= w, toIdx += 1
      ) {
        ns[toIdx] = this.internal[fromIdx]
      }
    }

    return new Piece(ns, this.height)
  }

  // デバッグ出力用
  public toString(): string {
    let ret = '\n'
    for (let i = 0; i < this.internal.length; i += 1) {
      if (this.internal[i]) {
        ret += '#'
      } else {
        ret += ' '
      }
      if ((i + 1) % this.width === 0) {
        ret += '\n'
      }
    }

    return ret
  }
}
