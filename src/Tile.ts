import * as PIXI from "pixi.js"

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
  private currentState = -1
  private hovered = false
  private onChangeTile?: () => void

  public get state(): number {
    return this.currentState
  }

  public set state(newState: number) {
    const prevState = this.currentState

    this.currentState = newState

    if (prevState !== newState) {
      this.applyColor()
    }
  }

  public constructor(
    id: number,
    sprite: PIXI.Sprite,
    x: number,
    y: number,
    onChangeTile?: () => void
  ) {
    this.id = id
    this.sprite = sprite
    this.sprite.hitArea = TILE_HITBOX
    this.sprite.interactive = true
    this.sprite.on("mouseover", this.onMouseOver)
    this.sprite.on("mouseout", this.onMouseOut)
    this.sprite.on("pointerdown", this.onPointerDown)
    this.sprite.x = x
    this.sprite.y = y
    this.onChangeTile = onChangeTile
  }

  public erase(): void {
    this.state = 0
  }

  public reset(): void {
    if (this.state !== 0) this.state = 1
  }

  public error(): void {
    if (this.state !== 0) this.state = 5
  }

  public canSolve(): boolean {
    return this.state === 0 || this.state === 1
  }

  public isBlank(): boolean {
    return this.state === 0
  }

  public isError(): boolean {
    return this.state === 5
  }

  public applyColor(): void {
    if (this.hovered) {
      this.sprite.alpha = 1
      this.sprite.tint = 0x00ff00
    } else if (this.state === 0) {
      this.sprite.tint = 0xffffff
      this.sprite.alpha = 0.2
    } else {
      this.sprite.alpha = 1
      this.sprite.tint = STATE_COLOR_MAP[this.state]
    }
  }

  private onMouseOver = (_ev: { target: PIXI.Sprite }): void => {
    this.hovered = true
    this.applyColor()
  }

  private onMouseOut = (_ev: { currentTarget: PIXI.Sprite }): void => {
    this.hovered = false
    this.applyColor()
  }

  private onPointerDown = (_ev: { target: PIXI.Sprite }): void => {
    if (this.state !== 0) {
      this.state = 0
    } else {
      this.state = 1
    }

    this.onChangeTile?.()
  }
}
