class MenuScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'MenuScene'
        })
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
                if (object.text === 'PLAY') {
                    this.scene.stop('MenuScene');
                    this.scene.start('GameScene', this.soundFX);
                }
                if (object.text === 'Controls') {
                    this.scene.launch('ControlScene');
                }
            });
        });
    }
    create() {
        this.add.image(0, 0, 'bkg').setOrigin(0).setDepth(0);
        this.soundFX = this.sound.add("menu", {loop: 'true'});
        this.soundFX.play();
        this.soundFX.pause();
        this.play = this.add.text(760, 290, 'PLAY', { fontSize: '60px', fill: '#fff' });
        this.options = this.add.text(470, 300, 'Options', { fontSize: '48px', fill: '#fff' });
        this.controls = this.add.text(990, 300, 'Controls', { fontSize: '48px', fill: '#fff' });
        this.music = this.add.text(740, 450, 'Music: OFF', { fontSize: '36px', fill: '#fff' });
        this.buttonEvents([this.play, this.options, this.controls]);

        this.input.keyboard.on('keyup', function(e) {
            switch(e.key) {
                case 'p':
                    if (this.soundFX.isPlaying) {
                        this.music.setText('Music: OFF');
                        this.soundFX.pause();
                    }
                    else {
                        this.music.setText('Music: ON');
                        this.soundFX.resume();
                    }
                    break;
            }
        }, this);
    }
}