
module Haco {

    export class Test1 extends Phaser.State {

        cell: number[];
        tiles: Phaser.Group;
        SIZE_X = 20;
        SIZE_Y = 20;
        accessor: util.XYAccessWrapper<number>;

        elasp_time: number;

        create() {

            this.elasp_time = -1;
            this.tiles = this.game.add.group()

            // initialize
            this.cell = new Array(this.SIZE_Y * this.SIZE_X);
            for (var i = 0; i < this.cell.length; i++) {
                    if (Math.random() <= 0.5) {
                        this.cell[i] = 0;
                    } else {
                        this.cell[i] = 0;
                }
            }
            this.accessor = util.makeAccessor(this.cell, this.SIZE_X);

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
            this.coloring();
        }

        cell_reset() {
            for (var i = 0; i < this.cell.length; i++) {
                if (this.cell[i] != 0) {
                    this.cell[i] = 1;
                }
            }
            this.coloring();
        }

        solve_start() {
            this.elasp_time = -1;
            var el = new Date().getTime();
            var s = new Solver();
            s.solve(this.cell, this.SIZE_X, this.aaa, this);
            if (s.solution == null) {
                console.log("cannot solve...");
                for (var i = 0; i < this.cell.length; i++) if (this.cell[i] != 0) this.cell[i] = 5;
            } else {
                console.log("solved!")
                for (var i = 0; i < this.cell.length; i++) {
                    this.cell[i] = s.solution[i];
                }
            }
            this.elasp_time = (new Date().getTime() - el);
            this.coloring();
        }

        aaa(count: number) {
            //this.game.debug.text('count: ' + count, 10, 580);
        }

        render() {
            
            this.game.debug.text('width: ' + this.tiles.width, 10, 16);
            this.game.debug.text('height: ' + this.tiles.height, 10, 36);
            this.game.debug.text('group size: ' + this.tiles.length, 10, 56);
            this.game.debug.text('tiles x: ' + this.tiles.x, 10, 76);
            this.game.debug.text('tiles y: ' + this.tiles.y, 10, 96);

            if (this.elasp_time != -1) {
                this.game.debug.text('time: ' + (this.elasp_time/1000) + 's', 10, 580)
            }

        }

        coloring() {
            var aget = this.accessor.getter();

            for (var i = 0; i < this.SIZE_Y; i++) {
                for (var j = 0; j < this.SIZE_X; j++) {
                    if (aget(j, i) == 0) {
                        var tile: Phaser.Sprite = this.tiles.getAt(i * this.SIZE_X + j)
                        tile.tint = 0xFFFFFF;
                        tile.alpha = 0.2;
                    }
                    if (aget(j, i) == 1) this.tiles.getAt(i * this.SIZE_X + j).tint = 0xFFFFFF;
                    if (aget(j, i) == 2) this.tiles.getAt(i * this.SIZE_X + j).tint = 0x0000FF;
                    if (aget(j, i) == 3) this.tiles.getAt(i * this.SIZE_X + j).tint = 0xFF00FF;
                    if (aget(j, i) == 4) this.tiles.getAt(i * this.SIZE_X + j).tint = 0xFFFF00;
                    if (aget(j, i) == 5) this.tiles.getAt(i * this.SIZE_X + j).tint = 0xFF0000;
                    if (aget(j, i) == 6) this.tiles.getAt(i * this.SIZE_X + j).tint = 0x00FFFF;
                    if (aget(j, i) == 7) this.tiles.getAt(i * this.SIZE_X + j).tint = 0x00FF00;
                }
            }

        }

    }
} 