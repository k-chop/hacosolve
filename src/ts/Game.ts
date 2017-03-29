import * as PIXI from 'pixi.js';
import { Scene } from './Scene';

/**
 * Game
 */
export class Game {
    private currentScene: Scene;
    private app: PIXI.Application;

    constructor(app: PIXI.Application, initScene: Scene) {
        this.app = app;
        this.currentScene = initScene;
        initScene.create();
        this.app.stage.addChild(initScene.container);
        app.ticker.add((deltaTime) => {
            this.update();
            this.render();
        });
    }

    public next(newScene: Scene) {
        this.currentScene.destroy();
        this.app.stage.removeChild(this.currentScene.container);
        this.currentScene = newScene;
        newScene.create();
    }

    public update() {
        this.currentScene.update();
    }

    public render() {
        this.app.renderer.render(this.app.stage);
    }
}
