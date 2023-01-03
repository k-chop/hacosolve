import * as PIXI from "pixi.js"
import { Scene } from "./Scene"

export const WIDTH = 600
export const HEIGHT = 600

/**
 * Game
 */
export class Game {
  private currentScene: Scene
  private app: PIXI.Application

  public constructor(app: PIXI.Application, initScene: Scene) {
    this.app = app
    this.currentScene = initScene
  }

  public run(): void {
    this.currentScene.create()
    this.app.stage.addChild(this.currentScene.container)
    this.app.ticker.add((_deltatime) => {
      this.update()
      this.render()
    })
  }

  public next(newScene: Scene): void {
    this.currentScene.destroy()
    this.app.stage.removeChild(this.currentScene.container)
    this.currentScene = newScene
    newScene.create()
  }

  public update(): void {
    this.currentScene.update()
  }

  public render(): void {
    this.app.renderer.render(this.app.stage)
  }
}
