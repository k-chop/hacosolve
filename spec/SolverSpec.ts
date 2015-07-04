/// <reference path="../src/typings/jasmine/jasmine.d.ts" />

import s = require('../src/ts/Solver')

describe('NetOfCube', () => {

    it('can count unique candidate', () => {
        var net = new s.NetOfCube;
        expect(net.all.length).toBe(62);
    });

});

describe('Pieces', () => {

    var t = s.Piece.fromString(
        "#   " +
        "####" +
        "#   "
        , 4);

    it('can create from Piece.fromString', () => {
        expect(t.height).toBe(3);
    });

    it('can create properly mirrored piece', () => {
        var mirroredT = t.mirrored();
        expect(mirroredT.width).toBe(4);
        expect(mirroredT.height).toBe(3);
        expect(mirroredT.eq(t)).toBeFalsy();
    });

    it('should equal to rotate 360', () => {
        var at = t.rotated90().rotated90().rotated90().rotated90();
        expect(at.eq(t)).toBeTruthy();
    });

    it('should equal to piece that rotated and mirrored many times', () => {
        var mt = t.rotated90().mirrored().mirrored().rotated90().rotated90().mirrored().mirrored().rotated90();
        expect(mt.eq(t)).toBeTruthy();
    });

    it('can access internal boolean array with xy axis', () => {
        expect(t.at(0, 0)).toBeTruthy();
        expect(t.at(3, 1)).toBeTruthy();
        expect(t.at(0, 1)).toBeTruthy();
        expect(t.at(3, 0)).toBeFalsy();
        expect(t.at(3, 2)).toBeFalsy();
        expect(t.at(4, 0)).toBeUndefined();
        expect(t.at(0, 3)).toBeUndefined();
    });

});