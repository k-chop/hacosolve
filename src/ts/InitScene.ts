import { AutoGenerator } from './AutoGenerator'
import { Scene } from './Scene'
import { Solver } from './Solver'
import { SpriteLoader } from './SpriteLoader'
import { Tile } from './Tile'
import * as util from './util'

/**
 * InitScene
 */
export class InitScene extends Scene {
  public SIZE_X = 20
  public SIZE_Y = 20
  public accessor: util.XYAccessWrapper<number>
  public gen: AutoGenerator
  public tiles: Tile[]
  public tips: PIXI.Text

  private spriteLoader: SpriteLoader

  public constructor() {
    super('init')
    this.spriteLoader = new SpriteLoader()
    this.tiles = new Array<Tile>()
  }

  public update(): void {}

  public async create(): Promise<void> {
    await this.load()

    for (let col = 0; col < this.SIZE_Y; col += 1) {
      for (let row = 0; row < this.SIZE_X; row += 1) {
        const idx = col * this.SIZE_X + row
        const x = 0 + row * 12 - col * 12 + 280
        const y = 0 + col * 6 + row * 6 + 200

        const tileSprite = this.spriteLoader.sprite('tileA')
        const tile = new Tile(idx, tileSprite, x, y)
        this.container.addChild(tile.sprite)
        this.tiles[idx] = tile
      }
    }
    const solveButton = this.spriteLoader.sprite('btn_solve')
    solveButton.interactive = true
    solveButton.on('pointerdown', () => {
      this.solveStart()
    })
    this.container.addChild(solveButton)

    this.tips = new PIXI.Text('', { fill: ['#fff'], fontSize: 16 })
    this.tips.x = 5
    this.tips.y = 600 - 20

    this.container.addChild(this.tips)

    this.initializeBoard()
  }

  public destroy(): void {
    throw new Error('Method not implemented.')
  }

  private async load(): Promise<void> {
    this.spriteLoader.addAll([
      ['btn_erase', './assets/image/button_erase.png'],
      ['btn_solve', './assets/image/button_solve.png'],
      ['tileA', './assets/image/tile00a.png'],
    ])
    await this.spriteLoader.load()
  }

  private solveStart(): void {
    const isFresh = this.tiles.every(tile => tile.canSolve())
    const isBlankAll = this.tiles.every(tile => tile.isBlank())

    if (isFresh) {
      if (isBlankAll) {
        this.tips.text =
          'Place tiles with click, or press number key for auto-generate.'
        return
      }
    } else {
      this.tips.text = 'You need reset!'
      return
    }

    const beforeTime = performance.now()
    const solver = new Solver()
    const numbers = this.tiles.map(tile => tile.state)
    solver.solve(numbers, this.SIZE_X)
    if (solver.solution == null) {
      if (solver.message !== '') {
        this.tips.text = solver.message
        console.log(solver.message)
      } else {
        this.tips.text = 'cannot solve...'
        console.log(this.tips)
      }
      for (const tile of this.tiles) {
        if (tile.state !== 0) {
          tile.state = 5
        }
      }
    } else {
      for (let idx = 0; idx < this.tiles.length; idx += 1) {
        this.tiles[idx].state = solver.solution[idx]
      }
      const elaspedTime = (performance.now() - beforeTime) / 1000
      this.tips.text = `Found ${solver.foundCubeCount} cubes. elasped time: ${elaspedTime} sec`
    }
    this.coloring()
  }

  private initializeBoard(): void {
    this.gen = new AutoGenerator(this.SIZE_X, this.SIZE_Y)
    this.generate(5)
  }

  private generate(cubeNum: number): void {
    const ns = this.gen.generate(cubeNum)
    for (let idx = 0; idx < ns.length; idx += 1) {
      this.tiles[idx].state = ns[idx]
    }
    this.coloring()
  }

  private coloring(): void {
    for (const tile of this.tiles) {
      tile.coloring()
    }
  }
}
