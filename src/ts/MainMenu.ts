/// <reference path="../typings/bundle.d.ts" />

export default class MainMenu extends Phaser.State {

    create() {

        const fx = this.add.audio('start');
        fx.play();

        const logo = this.add.sprite(this.world.centerX, 0, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        this.game.add.tween(logo).to({y: this.world.centerY - 100}, 200, Phaser.Easing.Cubic.In, true)

        this.input.onDown.add(this.startGame, this);
    }

    startGame() {

        this.game.state.start('Test1', true, false);
    }
}
