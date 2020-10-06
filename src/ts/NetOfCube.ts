import { Piece } from './Piece'

export class NetOfCube {
  public pieces: Piece[]
  public all: Piece[]

  public constructor() {
    this.pieces = new Array<Piece>(11)

    this.pieces[0] = Piece.fromString('#   ' + '####' + '#   ', 4)
    this.pieces[1] = Piece.fromString('#   ' + '####' + ' #  ', 4)
    this.pieces[2] = Piece.fromString('#   ' + '####' + '  # ', 4)
    this.pieces[3] = Piece.fromString('#   ' + '####' + '   #', 4)
    this.pieces[4] = Piece.fromString(' #  ' + '####' + ' #  ', 4)
    this.pieces[5] = Piece.fromString(' #  ' + '####' + '  # ', 4)
    this.pieces[6] = Piece.fromString('###  ' + '  ###', 5)
    this.pieces[7] = Piece.fromString('##  ' + ' ###' + ' #  ', 4)
    this.pieces[8] = Piece.fromString('##  ' + ' ###' + '  # ', 4)
    this.pieces[9] = Piece.fromString('##  ' + ' ###' + '   #', 4)
    this.pieces[10] = Piece.fromString('##  ' + ' ## ' + '  ##', 4)

    this.all = this.allCandidates()
  }

  // 同じ形状のピースを除いた全ての候補のリストを返す
  public allCandidates(): Piece[] {
    const all: Piece[] = []
    for (const piece of this.pieces) {
      all.push(...piece.variations())
    }

    const dist: Piece[] = []
    const checked: Set<number> = new Set<number>()
    for (const piece of all) {
      const hash = piece.internalNumber
      if (!checked.has(hash)) {
        dist.push(piece)
        checked.add(hash)
      }
    }

    return dist
  }
}
