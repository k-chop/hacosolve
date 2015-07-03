/// <reference path="../src/typings/jasmine/jasmine.d.ts" />

import s = require('../src/ts/Solver')

describe('NetOfCube', () => {

    it('count unique candidate', () => {
        var net = new s.NetOfCube;
        expect(net.all.length).toBe(62);
    });

});

describe('Piece', () => {

    var t = s.Piece.fromString(
        "#   " +
        "####" +
        "#   "
        , 4);

    it('create from Piece.fromString', () => {
        expect(t.height).toBe(3);
    });

    it('mirrored', () => {
        var mirroredT = t.mirrored();
        expect(mirroredT.width).toBe(4);
        expect(mirroredT.height).toBe(3);
        expect(mirroredT.internalNumber).not.toBe(t.internalNumber);
    });

});