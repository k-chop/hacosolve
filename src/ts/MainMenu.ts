/// <reference path="../typings/bundle.d.ts" />

export default class MainMenu extends Phaser.State {

    create() {

        const fx = this.add.audio('start');
        fx.play();

        const logo = this.add.sprite(this.world.centerX, this.world.centerY - 100, 'logo');
        logo.anchor.setTo(0.5, 0.5);

        this.input.onDown.add(this.startGame, this);
    }

    startGame() {

        this.game.state.start('Test1', true, false);
    }
}
