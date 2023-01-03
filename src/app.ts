import * as PIXI from "pixi.js"
import { Game, HEIGHT, WIDTH } from "./Game"
import { InitScene } from "./InitScene"

/**
 * entry point
 */
window.onload = () => {
  document.body.style.margin = "5rem 0"

  const app = new PIXI.Application({
    width: WIDTH,
    height: HEIGHT,
    backgroundColor: 0x061639,
  })
  const wrapper = document.createElement("div")
  wrapper.style.display = "flex"
  wrapper.style.justifyContent = "center"
  wrapper.style.alignItems = "center"

  document.body.appendChild(wrapper)
  wrapper.appendChild(app.view)

  const game = new Game(app, new InitScene())
  game.run()
}
