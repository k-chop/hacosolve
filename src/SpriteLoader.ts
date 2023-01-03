import * as PIXI from "pixi.js"

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
  public loader = PIXI.loader
  private textureLoaded = false
  private textureMap: TextureMap

  public constructor() {
    this.textureMap = new Map<string, PIXI.Texture>()
  }

  public load(): Promise<void> {
    Object.entries(textures).forEach(([id, url]) => {
      this.loader.add(id, url)
    })

    return new Promise((resolve) => {
      this.loader.load(
        (
          loader: PIXI.loaders.Loader,
          resources: { [key: string]: { texture: PIXI.Texture } }
        ) => {
          Object.keys(resources).forEach((key) => {
            this.textureMap.set(key, resources[key].texture)
          })
          this.textureLoaded = true
          resolve()
        }
      )
    })
  }

  public getSprite(id: TextureKey): PIXI.Sprite {
    if (!this.textureLoaded) {
      throw new Error("Attempt to load before load")
    }
    return new PIXI.Sprite(this.textureMap.get(id))
  }
}
