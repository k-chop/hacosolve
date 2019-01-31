import { NetOfCube } from "../src/ts/NetOfCube";
import { Piece } from "../src/ts/Piece";

describe("NetOfCube", () => {
  it("can count unique candidate", () => {
    let net = new NetOfCube();
    expect(net.all.length).toBe(62);
  });
});

describe("Pieces", () => {
  let t = Piece.fromString("#   " + "####" + "#   ", 4);

  it("can create from Piece.fromString", () => {
    expect(t.height).toBe(3);
  });

  it("can create properly mirrored piece", () => {
    let mirroredT = t.mirrored();
    expect(mirroredT.width).toBe(4);
    expect(mirroredT.height).toBe(3);
    expect(mirroredT.eq(t)).toBeFalsy();
  });

  it("should equal to rotate 360", () => {
    let net = new NetOfCube();
    net.all.forEach(p => {
      let rotated360 = p
        .rotated90()
        .rotated90()
        .rotated90()
        .rotated90();
      expect(rotated360.eq(p)).toBeTruthy();
    });
  });

  it("should equal to piece that rotated and mirrored many times", () => {
    let net = new NetOfCube();
    net.all.forEach(p => {
      let transformedMany = p
        .rotated90()
        .mirrored()
        .mirrored()
        .rotated90()
        .rotated90()
        .mirrored()
        .mirrored()
        .rotated90();
      expect(transformedMany.eq(p)).toBeTruthy();
    });
  });

  it("can access internal boolean array with xy axis", () => {
    expect(t.at(0, 0)).toBeTruthy();
    expect(t.at(3, 1)).toBeTruthy();
    expect(t.at(0, 1)).toBeTruthy();
    expect(t.at(3, 0)).toBeFalsy();
    expect(t.at(3, 2)).toBeFalsy();
    expect(t.at(4, 0)).toBeUndefined();
    expect(t.at(0, 3)).toBeUndefined();
  });
});
