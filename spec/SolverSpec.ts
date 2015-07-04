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

});