import { Piece } from "./Piece";

export class NetOfCube {
  public pieces: Piece[];
  public all: Piece[];

  public constructor() {
    this.pieces = new Array<Piece>(11);

    this.pieces[0] = Piece.FROM_STRING("#   " + "####" + "#   ", 4);
    this.pieces[1] = Piece.FROM_STRING("#   " + "####" + " #  ", 4);
    this.pieces[2] = Piece.FROM_STRING("#   " + "####" + "  # ", 4);
    this.pieces[3] = Piece.FROM_STRING("#   " + "####" + "   #", 4);
    this.pieces[4] = Piece.FROM_STRING(" #  " + "####" + " #  ", 4);
    this.pieces[5] = Piece.FROM_STRING(" #  " + "####" + "  # ", 4);
    this.pieces[6] = Piece.FROM_STRING("###  " + "  ###", 5);
    this.pieces[7] = Piece.FROM_STRING("##  " + " ###" + " #  ", 4);
    this.pieces[8] = Piece.FROM_STRING("##  " + " ###" + "  # ", 4);
    this.pieces[9] = Piece.FROM_STRING("##  " + " ###" + "   #", 4);
    this.pieces[10] = Piece.FROM_STRING("##  " + " ## " + "  ##", 4);

    this.all = this.allCandidates();
  }

  // 同じ形状のピースを除いた全ての候補のリストを返す
  public allCandidates(): Piece[] {
    let all: Piece[] = [];
    for (const piece of this.pieces) {
      all = all.concat(piece.variations());
    }

    const dist: Piece[] = [];
    const comp: number[] = [];
    for (const p of all) {
      const hash = p.internalNumber;
      if (comp.indexOf(hash) === -1) {
        dist.push(p);
        comp.push(hash);
      }
    }

    return dist;
  }
}
