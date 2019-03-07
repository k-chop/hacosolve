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
  const wrapper = document.createElement("div");
  wrapper.style.textAlign = "center";
  document.body.appendChild(wrapper);
  wrapper.appendChild(app.view);

  const game = new Game(app, new InitScene());
  game.run();
};
