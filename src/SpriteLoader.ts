import * as PIXI from 'pixi.js'

type TextureMap = Map<string, PIXI.Texture>

/**
 * SpriteLoader
 */
export class SpriteLoader {
  public loader = PIXI.loader
  private loaded = false
  private textureMap: TextureMap

  public constructor() {
    this.textureMap = new Map<string, PIXI.Texture>()
  }

  public add(ident: string, url: string): void {
    this.loader.add(ident, url)
  }

  public addAll(props: [string, string][]): void {
    props.forEach(([ident, url]) => {
      this.add(ident, url)
    })
  }

  public load(): Promise<void> {
    return new Promise((resolve) => {
      this.loader.load(
        (
          loader: PIXI.loaders.Loader,
          resources: { [key: string]: { texture: PIXI.Texture } }
        ) => {
          Object.keys(resources).forEach((key) => {
            this.textureMap.set(key, resources[key].texture)
          })
          this.loaded = true
          resolve()
        }
      )
    })
  }

  public getSprite(id: string): PIXI.Sprite {
    if (!this.loaded) {
      throw new Error('Attempt to load before load')
    }
    return new PIXI.Sprite(this.textureMap.get(id))
  }

  public getSprites(ids: string[]): PIXI.Sprite[] {
    if (!this.loaded) {
      throw new Error('Attempt to load before load')
    }
    return ids.map((id) => this.getSprite(id))
  }
}
