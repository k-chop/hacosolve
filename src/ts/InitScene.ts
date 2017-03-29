import { AutoGenerator } from './AutoGenerator';
import { Scene } from './Scene';
import { Solver } from './Solver';
import { SpriteLoader } from './SpriteLoader';
import { Tile } from './Tile';
import * as util from './util';

/**
 * InitScene
 */
export class InitScene extends Scene {

    public cell: number[];
    public SIZE_X = 20;
    public SIZE_Y = 20;
    public accessor: util.XYAccessWrapper<number>;
    public gen: AutoGenerator;
    public tiles: Tile[];
    public tips: string;

    private spriteLoader: SpriteLoader;

    constructor() {
        super('init');
        this.spriteLoader = new SpriteLoader();
        this.tiles = new Array<Tile>();
        this.tips = '';
    }

    public update(): void {
        //for (let idx = 0; idx < this.cell.length; idx += 1) {
        //    this.cell[idx] = Math.floor(Math.random() * 7);
        //}
        //this.coloring();
    }

    public async create() {
        await this.load();

        const hitBox = new PIXI.Polygon(
            13, 0,
            0, 7,
            13, 13,
            26, 7
        );

        for (let col = 0; col < this.SIZE_Y; col += 1) {
            for (let row = 0; row < this.SIZE_X; row += 1) {
                const idx = col * this.SIZE_X + row;
                const x = 0 + row * 12 - col * 12 + 280;
                const y = 0 + col * 6 + row * 6 + 200;

                const tileSprite = this.spriteLoader.sprite('tileA');
                const tile = new Tile(idx, tileSprite, x, y);
                this.container.addChild(tile.sprite);
                this.tiles[idx] = tile;
            }
        }
        this.initializeBoard();
        //this.solveStart();
    }

    public destroy(): void {
        throw new Error('Method not implemented.');
    }

    private async load() {
        this.spriteLoader.addAll([
            ['btn_erase', './assets/image/button_erase.png'],
            ['btn_solve', './assets/image/button_solve.png'],
            ['tileA', './assets/image/tile00a.png']
        ]);
        await this.spriteLoader.load();
    }

    private solveStart() {
        if (this.cell.indexOf(1) === -1) {
            if (this.cell.indexOf(2) !== -1 || this.cell.indexOf(5) !== -1) {
                this.tips = 'You need reset!';
            } else {
                this.tips = 'Place tiles with click, or press number key for auto-generate.';
            }
            return;
        }
        const beforeTime = new Date().getTime();
        const solver = new Solver();
        solver.solve(this.cell, this.SIZE_X, () => {}, this);
        if (solver.solution == null) {
            if (solver.message !== '') {
                this.tips = solver.message;
                console.log(solver.message);
            } else {
                this.tips = 'cannot solve...';
                console.log(this.tips);
            }
            for (let idx = 0; idx < this.cell.length; idx += 1) {
                if (this.cell[idx] !== 0) { this.cell[idx] = 5; }
            }
        } else {
            console.log('solved!');
            for (let idx = 0; idx < this.cell.length; idx += 1) {
                this.cell[idx] = solver.solution[idx];
            }
            const elaspedTime = (new Date().getTime() - beforeTime) / 1000;
            this.tips = `Found ${solver.foundCubeCount} cubes. elasped time: ${elaspedTime} sec`;
        }
        this.coloring();
    }

    private initializeBoard() {
        this.cell = new Array(this.SIZE_Y * this.SIZE_X);
        for (let idx = 0; idx < this.cell.length; idx += 1) {
            this.cell[idx] = 0;
        }
        this.accessor = util.makeAccessor(this.cell, this.SIZE_X);
        this.gen = new AutoGenerator(this.SIZE_X, this.SIZE_Y);
        this.generate(5);
    }

    private generate(cubeNum: number) {
        const ns = this.gen.generate(cubeNum);
        for (let idx = 0; idx < ns.length; idx += 1) {
            this.cell[idx] = ns[idx];
            this.tiles[idx].state = ns[idx];
        }
        this.coloring();
    }

    private coloring() {
        for (let idx = 0; idx < this.tiles.length; idx += 1) {
            this.tiles[idx].coloring(this.cell[idx]);
        }
    }
}
