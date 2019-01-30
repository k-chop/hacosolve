import * as PIXI from "pixi.js";
import { Game } from "./Game";
import { InitScene } from "./InitScene";

/**
 * entry point
 */
window.onload = () => {
  const app = new PIXI.Application(600, 600, {
    backgroundColor: 0x061639
  });
  document.body.appendChild(app.view);

  const game = new Game(app, new InitScene());
};
