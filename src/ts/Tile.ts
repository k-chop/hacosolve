import * as PIXI from 'pixi.js'

const TILE_HITBOX = new PIXI.Polygon(13, 0, 0, 7, 13, 13, 26, 7)

const STATE_COLOR_MAP: { [state: number]: number } = {
  1: 0xffffff,
  2: 0x0000ff,
  3: 0xff00ff,
  4: 0xffff00,
  5: 0xff0000,
  6: 0x00ffff,
  7: 0x00ff00,
}

export class Tile {
  public id: number
  public sprite: PIXI.Sprite
  private currentState: number
  private prevState: number
  public get state(): number {
    return this.currentState
  }
  public set state(newState: number) {
    this.currentState = newState
  }

  public constructor(id: number, sprite: PIXI.Sprite, x: number, y: number) {
    this.id = id
    this.sprite = sprite
    this.sprite.hitArea = TILE_HITBOX
    this.sprite.interactive = true
    this.sprite.on('mouseover', this.onMouseOver)
    this.sprite.on('mouseout', this.onMouseOut)
    this.sprite.on('pointerdown', this.onPointerDown)
    this.sprite.x = x
    this.sprite.y = y
  }

  public coloring(state: number = this.currentState): void {
    if (state !== this.currentState) {
      this.currentState = state
    }
    if (state === 0) {
      this.sprite.tint = 0xffffff
      this.sprite.alpha = 0.2
    } else {
      this.sprite.alpha = 1
      const color = STATE_COLOR_MAP[state]
      this.sprite.tint = color
    }
  }

  private onMouseOver = (_ev: { target: PIXI.Sprite }): void => {
    this.prevState = this.currentState
    this.currentState = 7
    this.coloring()
  }

  private onMouseOut = (_ev: { currentTarget: PIXI.Sprite }): void => {
    this.currentState = this.prevState
    this.coloring()
  }

  private onPointerDown = (_ev: { target: PIXI.Sprite }): void => {
    console.log(`Pressed id ${this.id} tile.`)
    if (this.prevState !== 0) {
      this.state = 0
    } else {
      this.state = 1
    }
    this.prevState = this.state
    this.coloring()
  }
}
