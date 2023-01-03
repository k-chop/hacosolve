import { AutoGenerator } from "./AutoGenerator"
import { HEIGHT, WIDTH } from "./Game"
import { Scene } from "./Scene"
import { SpriteLoader } from "./SpriteLoader"
import { Tile } from "./Tile"
import SolverWorker from "./solverWorker?worker&inline"
import { WorkerResult } from "./solverWorker"
import * as PIXI from "pixi.js"
import { t } from "./i18n"

const worker = new SolverWorker()

/**
 * MainScene
 */
export class MainScene extends Scene {
  public SIZE_X = 20
  public SIZE_Y = 20
  public gen: AutoGenerator
  public tiles: Tile[]
  public tips: PIXI.Text
  public tileCountText: PIXI.Text

  private spriteLoader: SpriteLoader
  private tileCount = 0

  public constructor() {
    super("main")

    this.spriteLoader = new SpriteLoader()
    this.tiles = new Array<Tile>()
    this.tips = new PIXI.Text("", { fill: ["#fff"], fontSize: 16 })
    this.tileCountText = new PIXI.Text("", { fill: ["#fff"], fontSize: 16 })
    this.gen = new AutoGenerator(this.SIZE_X, this.SIZE_Y)
  }

  public update(): void {
    // nop
  }

  public async create(): Promise<void> {
    await this.load()

    for (let col = 0; col < this.SIZE_Y; col += 1) {
      for (let row = 0; row < this.SIZE_X; row += 1) {
        const idx = col * this.SIZE_X + row
        const x = 0 + row * 12 - col * 12 + 280
        const y = 0 + col * 6 + row * 6 + 200

        const tileSprite = this.spriteLoader.getSprite("tile")

        const tile = new Tile(idx, tileSprite, x, y, () => this.onChangeTile())
        this.container.addChild(tile.sprite)
        this.tiles[idx] = tile
      }
    }

    const solveButton = this.spriteLoader.getSprite("solveButton")
    solveButton.interactive = true
    solveButton.anchor.x = 0.5
    solveButton.anchor.y = 1
    solveButton.x = WIDTH / 2
    solveButton.y = HEIGHT - 10
    solveButton.on("pointerdown", () => this.solveStart())
    this.container.addChild(solveButton)

    const resetButton = this.spriteLoader.getSprite("resetButton")
    resetButton.interactive = true
    resetButton.anchor.x = 0.5
    resetButton.anchor.y = 1
    resetButton.x = WIDTH / 2 + resetButton.texture.width + 40
    resetButton.y = HEIGHT - 10
    resetButton.on("pointerdown", () => this.reset())
    this.container.addChild(resetButton)

    const eraseButton = this.spriteLoader.getSprite("eraseButton")
    eraseButton.interactive = true
    eraseButton.anchor.x = 0.5
    eraseButton.anchor.y = 1
    eraseButton.x = WIDTH / 2 - resetButton.texture.width - 40
    eraseButton.y = HEIGHT - 10
    eraseButton.on("pointerdown", () => this.erase())
    this.container.addChild(eraseButton)

    this.tips.x = 5
    this.tips.y = 5
    this.container.addChild(this.tips)

    this.tileCountText.x = 5
    this.tileCountText.y = HEIGHT - 22
    this.container.addChild(this.tileCountText)

    this.initializeBoard()
  }

  public destroy(): void {
    throw new Error("Method not implemented.")
  }

  private load(): Promise<void> {
    return this.spriteLoader.load()
  }

  private erase(): void {
    this.tiles.forEach((tile) => tile.erase())
    this.tips.text = ""
    this.updateTileCount()
  }

  private reset(): void {
    this.tiles.forEach((tile) => tile.reset())
    this.tips.text = ""
    this.updateTileCount()
  }

  private solveStart(): void {
    const isFresh = this.tiles.every((tile) => tile.canSolve())
    const isBlankAll = this.tiles.every((tile) => tile.isBlank())

    if (isFresh) {
      if (isBlankAll) {
        this.tips.text = t("placeTiles")
        return
      }
    } else {
      this.tips.text = t("resetTiles")
      return
    }

    const beforeTime = performance.now()
    const board = this.tiles.map((tile) => tile.state)

    worker.postMessage({ board, width: this.SIZE_X })

    worker.addEventListener(
      "message",
      (event: MessageEvent<WorkerResult>) => {
        const data = event.data
        if (data.type === "result") {
          if (!data.solved) {
            this.tips.text = data.message ? t(data.message) : t("cannotSolve")
            this.tiles.forEach((tile) => tile.error())
          } else {
            for (let idx = 0; idx < this.tiles.length; idx += 1) {
              this.tiles[idx].state = data.solution[idx]
            }
            const elapsedTime = (performance.now() - beforeTime) / 1000
            const formattedElapsedTime = `${elapsedTime.toFixed(3)} ${t("sec")}`
            this.tips.text = `${t("found")} ${t("elapsedTime")} ${formattedElapsedTime}`
          }
        }
      },
      { once: true }
    )
  }

  private initializeBoard(): void {
    this.generate(5)
    this.onChangeTile()
  }

  private generate(cubeNum: number): void {
    const board = this.gen.generate(cubeNum)

    for (let idx = 0; idx < board.length; idx += 1) {
      this.tiles[idx].state = board[idx]
    }
  }

  public onChangeTile(): void {
    const isError = this.tiles.every((tile) => tile.isError() || tile.canSolve())
    if (isError) {
      this.reset()
    }
    this.updateTileCount()
  }

  public updateTileCount(): void {
    this.tileCount = this.tiles.reduce((a, b) => a + (b.isBlank() ? 0 : 1), 0)
    this.tileCountText.text = "Tiles: " + this.tileCount + ` (% 6 == ${this.tileCount % 6})`
  }
}
