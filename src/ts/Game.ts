/// <reference path="../typings/bundle.d.ts" />

import Boot = require('./Boot')
import Preloader = require('./Preloader')
import MainMenu = require('./MainMenu')
import Test1 = require('./Test1')

class Game extends Phaser.Game {

    constructor() {

        super(800, 600, Phaser.AUTO, 'content', null);

        this.state.add('Boot', Boot, false);
        this.state.add('Preloader', Preloader, false);
        this.state.add('MainMenu', MainMenu, false);
        this.state.add('Test1', Test1, false);

        this.state.start('Boot')
    }
}

export = Game;
