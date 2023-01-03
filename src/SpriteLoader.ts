import * as PIXI from "pixi.js"
import { Assets } from "pixi.js"

type TextureMap = Map<string, PIXI.Texture>

export type TextureResource = { [id: string]: string }

export const textures = {
  eraseButton: "./assets/image/button_erase.png",
  resetButton: "./assets/image/button_reset.png",
  solveButton: "./assets/image/button_solve.png",
  tile: "./assets/image/tile00a.png",
} as const satisfies TextureResource

export type TextureKey = keyof typeof textures

/**
 * SpriteLoader
 */
export class SpriteLoader {
  private textureLoaded = false
  private textureMap: TextureMap

  public constructor() {
    this.textureMap = new Map<string, PIXI.Texture>()
  }

  public async load(): Promise<void> {
    await Promise.all(
      Object.entries(textures).map(([id, url]) =>
        Assets.load(url).then((texture) => {
          if (texture) this.textureMap.set(id, texture)
        })
      )
    )
    this.textureLoaded = true
  }

  public getSprite(id: TextureKey): PIXI.Sprite {
    if (!this.textureLoaded) {
      throw new Error("Attempt to load before load")
    }
    return new PIXI.Sprite(this.textureMap.get(id))
  }
}
