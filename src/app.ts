import * as PIXI from "pixi.js"
import { Game, HEIGHT, WIDTH } from "./Game"
import { MainScene } from "./MainScene"

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper.appendChild(app.view as any)

  const game = new Game(app, new MainScene())
  game.run()
}
