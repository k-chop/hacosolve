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
        // RAINBOOOOOW!!!!
        //
        //for (const tile of this.tiles) {
        //    tile.state = Math.floor(Math.random() * 7);
        //}
        //this.coloring();
    }

    public async create() {
        await this.load();

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
        this.solveStart();
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
        const isFresh = this.tiles.every((tile) => tile.state === 0 || tile.state === 1);
        if (!isFresh) {
            const dunno = this.tiles.some((tile) => tile.state === 2 || tile.state === 5)
            if (dunno) {
                this.tips = 'You need reset!';
            } else {
                this.tips = 'Place tiles with click, or press number key for auto-generate.';
            }
            return;
        }
        const beforeTime = new Date().getTime();
        const solver = new Solver();
        const numbers = this.tiles.map((tile) => tile.state);
        solver.solve(numbers, this.SIZE_X, () => {}, this);
        if (solver.solution == null) {
            if (solver.message !== '') {
                this.tips = solver.message;
                console.log(solver.message);
            } else {
                this.tips = 'cannot solve...';
                console.log(this.tips);
            }
            for (const tile of this.tiles) {
                if (tile.state !== 0) { tile.state = 5; }
            }
        } else {
            console.log('solved!');
            for (let idx = 0; idx < this.tiles.length; idx += 1) {
                this.tiles[idx].state = solver.solution[idx];
            }
            const elaspedTime = (new Date().getTime() - beforeTime) / 1000;
            this.tips = `Found ${solver.foundCubeCount} cubes. elasped time: ${elaspedTime} sec`;
        }
        this.coloring();
    }

    private initializeBoard() {
        this.gen = new AutoGenerator(this.SIZE_X, this.SIZE_Y);
        this.generate(5);
    }

    private generate(cubeNum: number) {
        const ns = this.gen.generate(cubeNum);
        for (let idx = 0; idx < ns.length; idx += 1) {
            this.tiles[idx].state = ns[idx];
        }
        this.coloring();
    }

    private coloring() {
        for (const tile of this.tiles) {
            tile.coloring();
        }
    }
}
