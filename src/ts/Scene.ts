import * as PIXI from "pixi.js";

/**
 * Scene
 */
export abstract class Scene {
  public readonly id: string;
  public readonly app: PIXI.Application;
  public readonly container: PIXI.Container;

  public constructor(id: string) {
    this.id = id;
    this.container = new PIXI.Container();
  }

  public abstract update(): void;
  public abstract create(): void;
  public abstract destroy(): void;
}
