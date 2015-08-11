/// <reference path="../typings/bundle.d.ts" />

export default class Preloader extends Phaser.State {

    preload() {
        //  Load our actual games assets
        this.load.image('tile', 'assets/image/tile00a.png');
        this.load.image('logo', 'assets/image/logo.png');
        this.load.image('button_solve', 'assets/image/button_solve.png');
        this.load.image('button_reset', 'assets/image/button_reset.png');
        this.load.image('button_erase', 'assets/image/button_erase.png');

        this.load.audio('start', 'assets/sound/c_cursor02.ogg');

        this.load.onLoadComplete.add(this.loadComplete, this);
    }

    create() {

        //this.game.load.start();
    }

    loadComplete() {

        this.game.state.start('MainMenu', true, false);

    }
}
