import * as PIXI from "pixi.js"

const TILE_HITBOX = new PIXI.Polygon([13, 0, 0, 7, 13, 13, 26, 7])

const STATE_COLOR_MAP: { [state: number]: number } = {
  1: 0xfff0f0,
  2: 0x94df8a,
  3: 0xff514b,
  4: 0xfce14c,
  5: 0x4cfccd,
  6: 0x899cf0,
  7: 0xf089cf,
}

const ERROR_STATE = -1
const BLANK_STATE = 0
const NORMAL_STATE = 1
const ERROR_COLOR = 0xff0000

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

  public normal(): void {
    this.state = NORMAL_STATE
  }

  public erase(): void {
    this.state = BLANK_STATE
  }

  public reset(): void {
    if (!this.isBlank()) this.state = NORMAL_STATE
  }

  public error(): void {
    if (!this.isBlank()) this.state = ERROR_STATE
  }

  public canSolve(): boolean {
    return this.isBlank() || this.isNormal()
  }

  public isBlank(): boolean {
    return this.state === BLANK_STATE
  }

  public isNormal(): boolean {
    return this.state === NORMAL_STATE
  }

  public isError(): boolean {
    return this.state === ERROR_STATE
  }

  public applyColor(): void {
    this.sprite.alpha = 1

    if (this.hovered) {
      this.sprite.tint = 0x00ff00
    } else if (this.isBlank()) {
      this.sprite.tint = 0xffffff
      this.sprite.alpha = 0.2
    } else if (this.isError()) {
      this.sprite.tint = ERROR_COLOR
    } else {
      this.sprite.tint = STATE_COLOR_MAP[this.state]
    }
  }

  private onMouseOver = (): void => {
    this.hovered = true
    this.applyColor()
  }

  private onMouseOut = (): void => {
    this.hovered = false
    this.applyColor()
  }

  private onPointerDown = (): void => {
    if (!this.isBlank()) {
      this.erase()
    } else {
      this.normal()
    }

    this.onChangeTile?.()
  }
}
