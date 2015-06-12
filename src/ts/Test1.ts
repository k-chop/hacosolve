/// <reference path="../typings/bundle.d.ts" />

module Haco {

    export class Test1 extends Phaser.State {

        cell: number[];
        tiles: Phaser.Group;
        SIZE_X = 20;
        SIZE_Y = 20;
        accessor: util.XYAccessWrapper<number>;
        gen: AutoGenerator;

        tips: string;

        create() {

            this.tips = undefined;
            this.tiles = this.game.add.group()

            // initialize
            this.cell = new Array(this.SIZE_Y * this.SIZE_X);
            for (var i = 0; i < this.cell.length; i++) {
                this.cell[i] = 0;
            }
            this.accessor = util.makeAccessor(this.cell, this.SIZE_X);

            this.gen = new AutoGenerator(this.SIZE_X, this.SIZE_Y);

            var set1 = this.accessor.setter(1);

            // example
            set1(11, 10);
            set1(12, 10);
            set1(11, 11);
            set1(12, 11);
            set1(13, 11);
            set1(10, 12);
            set1(11, 12);
            set1(13, 12);
            set1(10, 13);
            set1(13, 13);
            set1(14, 13);
            set1(10, 14);

            set1(12, 12);
            set1(11, 13);
            set1(12, 13);
            set1(12, 14);
            set1(12, 15);
            set1(13, 14);

            // (cell status) == (sprite)
            // cell[i][j] == tiles.getAt(i * SIZE_Y + j)

            var aget = this.accessor.getter();

            for (var i = 0; i < this.SIZE_Y; i++) {
                for (var j = 0; j < this.SIZE_X; j++) {
                    var x = 0 + j * 12 - i * 12+ 400;
                    var y = 0 + i * 6 + j * 6  + 200;
                    var tile: Phaser.Sprite = this.tiles.create(x, y, 'tile');

                    if (aget(j, i) == 0) {
                        tile.alpha = 0.2;
                    }
                    if (aget(j, i) == 1) tile.tint = 0xFFFFFF;
                    if (aget(j, i) == 2) tile.tint = 0x0000FF;
                    if (aget(j, i) == 3) tile.tint = 0xFF00FF;
                }
            }

            // events
            this.tiles.setAll('inputEnabled', true);
            this.tiles.setAll('input.pixelPerfectClick', true);
            this.tiles.callAll('events.onInputDown.add', 'events.onInputDown', this.a, this);

            // button
            var bSol = this.game.add.button(742, 570, 'button_solve', this.solve_start, this);
            var bRes = this.game.add.button(742, 45, 'button_reset', this.cell_reset, this);
            var bEra = this.game.add.button(742, 5, 'button_erase', this.cell_erase, this);

            bSol.onInputOver.add(this.over, this);
            bSol.onInputDown.add(this.down, this);
            bSol.onInputOut.add(this.out, this);
            bRes.onInputOver.add(this.over, this);
            bRes.onInputDown.add(this.down, this);
            bRes.onInputOut.add(this.out, this);
            bEra.onInputOver.add(this.over, this);
            bEra.onInputDown.add(this.down, this);
            bEra.onInputOut.add(this.out, this);

            // key
            this.game.input.keyboard.addCallbacks(this, null, null, this.keyPress);

        }

        keyPress(char: string) {
            var c: number = parseInt(char, 10);
            if (!isNaN(c)) { // 0-9
                var msg = "auto-generate: " + c;
                this.tips = msg
                console.log(msg);
                this.generate(c);
            } else {
                console.log(char);
            }
        }

        over(a: Phaser.Button) {
            a.tint = 0xAAEEFF;
        }

        out(a: Phaser.Button) {
            a.tint = 0xFFFFFF;
        }

        down(a: Phaser.Button) {
            a.tint = 0x777777;
        }

        generate(n: number) {
            var ns = this.gen.generate(n);
            for (var i = 0; i < ns.length; i++) this.cell[i] = ns[i];
            this.coloring();
        }

        a(item: Phaser.Sprite) {
            var i = (2 * item.y - item.x) / 24;
            var j = (item.x + 2 * item.y - 800) / 24;
            if (item.alpha < 0.21) {
                item.alpha = 1;
                this.cell[i * this.SIZE_X + j] = 1;
            } else {
                item.alpha = 0.2;
                this.cell[i * this.SIZE_X + j] = 0;
            }
            console.log("xy(" + item.x + ", " + item.y + ") -> ij(" + i + ", " + j + ")");
        }

        cell_erase() {
            for (var i = 0; i < this.cell.length; i++) {
                this.cell[i] = 0;
            }
            this.tips = "erased.";
            this.coloring();
        }

        cell_reset() {
            for (var i = 0; i < this.cell.length; i++) {
                if (this.cell[i] != 0) {
                    this.cell[i] = 1;
                }
            }
            this.tips = "reset complete.";
            this.coloring();
        }

        solve_start() {

            if (this.cell.indexOf(1) == -1) {
                if (this.cell.indexOf(2) != -1 || this.cell.indexOf(5) != -1) {
                    this.tips = "you need reset!";
                } else {
                    this.tips = "place tiles with click, or press number key for auto-generate.";
                }
                return;
            }

            var el = new Date().getTime();
            var s = new Solver();
            s.solve(this.cell, this.SIZE_X, this.aaa, this);
            if (s.solution == null) {
                if (s.message != '') {
                    this.tips = s.message;
                    console.log(s.message);
                } else {
                    this.tips = "cannot solve..."
                    console.log(this.tips);
                }
                for (var i = 0; i < this.cell.length; i++) if (this.cell[i] != 0) this.cell[i] = 5;
            } else {
                console.log("solved!")
                for (var i = 0; i < this.cell.length; i++) {
                    this.cell[i] = s.solution[i];
                }
                this.tips = 'found '+s.foundCubeCount+' cubes. '+'time: ' + ((new Date().getTime() - el) / 1000) + 's';
            }
            this.coloring();
        }

        aaa(count: number) {
            //this.game.debug.text('count: ' + count, 10, 580);
        }

        render() {

            if (this.tips != undefined) {
                this.game.debug.text(this.tips, 10, 580)
            }

        }

        coloring() {
            var aget = this.accessor.getter();

            for (var i = 0; i < this.SIZE_Y; i++) {
                for (var j = 0; j < this.SIZE_X; j++) {
                    var tile: Phaser.Sprite = this.tiles.getAt(i * this.SIZE_X + j);
                    if (aget(j, i) == 0) {
                        tile.tint = 0xFFFFFF;
                        tile.alpha = 0.2;
                    } else {
                        tile.alpha = 1;
                    }
                    if (aget(j, i) == 1) tile.tint = 0xFFFFFF;
                    if (aget(j, i) == 2) tile.tint = 0x0000FF;
                    if (aget(j, i) == 3) tile.tint = 0xFF00FF;
                    if (aget(j, i) == 4) tile.tint = 0xFFFF00;
                    if (aget(j, i) == 5) tile.tint = 0xFF0000;
                    if (aget(j, i) == 6) tile.tint = 0x00FFFF;
                    if (aget(j, i) == 7) tile.tint = 0x00FF00;
                }
            }

        }

    }
} 