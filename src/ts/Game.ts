/// <reference path="../typings/bundle.d.ts" />

import Boot from "./Boot"
import Preloader from "./Preloader"
import MainMenu from "./MainMenu"
import Test1 from "./Test1"

export default class Game extends Phaser.Game {

    constructor() {

        super(800, 600, Phaser.AUTO, 'content', null);

        this.state.add('Boot', Boot, false);
        this.state.add('Preloader', Preloader, false);
        this.state.add('MainMenu', MainMenu, false);
        this.state.add('Test1', Test1, false);

        this.state.start('Boot')
    }
}

