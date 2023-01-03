import * as PIXI from "pixi.js"
import { Game, HEIGHT, WIDTH } from "./Game"
import { MainScene } from "./MainScene"

/**
 * entry point
 */
window.onload = () => {
  if (PIXI.isMobile.phone) {
    document.body.style.margin = "0"
    document.body.style.padding = "0"
    document.body.style.overflow = "hidden"

    const app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio,
      backgroundColor: 0x061639,
    })

    window.addEventListener("resize", () => {
      app.renderer.resize(window.innerWidth, window.innerHeight)
    })

    const wrapper = document.createElement("div")
    wrapper.style.position = "absolute"
    wrapper.style.top = "0"
    wrapper.style.left = "0"
    wrapper.style.overflow = "hidden"
    wrapper.style.width = "100%"
    wrapper.style.height = "100%"

    document.body.appendChild(wrapper)
    if (app.view.style) {
      const canvas = app.view as unknown as HTMLCanvasElement
      const canvasScale = 1 / window.devicePixelRatio
      canvas.style.transform = `scale3d(${canvasScale}, ${canvasScale}, ${canvasScale})`
      canvas.style.transformOrigin = "0 0"
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    wrapper.appendChild(app.view as any)

    const game = new Game(app, new MainScene())
    game.run()
  } else {
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
}
