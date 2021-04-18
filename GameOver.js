class GameOver extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOver'
        })
    }
    init(data) {
        this.winner = data;
    }
    fireworks() {
        this.anims.create({
            key: 'firework',
            frames: this.anims.generateFrameNumbers('firework', { start: 0, end: 29 }),
            frameRate: 10,
            repeat: -1
        });
        this.fireworksArray = [];
        for (let i = 0; i < 5; i++) {
            if (i % 2 === 0) {
                this.fireworksArray.push(this.add.sprite(150, (i+1) * 100, 'firework'));
                this.fireworksArray.push(this.add.sprite(1490, (i+1) * 100, 'firework'));
            }
            else {
                this.fireworksArray.push(this.add.sprite(300, (i+1) * 100, 'firework'));
                this.fireworksArray.push(this.add.sprite(1340, (i+1) * 100, 'firework'));
            }
        }
        this.fireworksArray.forEach(object => {
            object.anims.play('firework', true);
        });
    }
    soundHandle() {
        this.soundFX = this.sound.add("post", {loop: 'true'});
        this.soundFX.play();
        this.input.keyboard.on('keyup', function(e) {
            switch(e.key) {
                case 'p':
                    if (this.soundFX.isPlaying) {
                        this.soundFX.pause();
                    }
                    else {
                        this.soundFX.resume();
                    }
                    break;
            }
        }, this);
    }
    buttonEvents(buttons) {
        buttons.forEach( object => {
            object.setInteractive();
            object.on("pointerover", () => {
                object.setColor('#f0f');
            });
            object.on("pointerout", () => {
                object.setColor('#fff');
            });
            object.on("pointerup", () => {
                this.scene.stop('GameOver');
                if(this.soundFX.isPlaying) {
                    this.soundFX.stop();
                }
                if (object.text === 'Menu') {
                   this.scene.start('MenuScene');
                }
                else {
                    this.scene.start('GameScene');
                }
            });
        });
    }
    create() {
        this.add.text(840, 40, 'Game Over', { fontSize: '80px', fill: '#fff' }).setOrigin(0.5);
        this.add.text(840, 160, this.winner + ' has won!', { fontSize: '30px', fill: '#fff'}).setOrigin(0.5);
        this.add.text(840, 290, 'Congratulations!', { fontSize: '44px', fill: '#fff'}).setOrigin(0.5);
        this.restart = this.add.text(720, 470, 'Restart', { fontSize: '48px', fill: '#fff'}).setOrigin(0.5);
        this.menu = this.add.text(980,  470, 'Menu', { fontSize: '48px', fill: '#fff'}).setOrigin(0.5);

        this.fireworks();
        this.soundHandle();
        this.buttonEvents([this.restart, this.menu]);

    }
}