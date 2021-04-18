class ControlScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'ControlScene'
        })
    }
    create() {
        this.delimeter = new Phaser.Geom.Rectangle(1100, 0, 540, 200);
        let graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
        graphics.fillRectShape(this.delimeter);
        this.player1 = this.add.text(1120, 70, 'Player1: left_arrow, right_arrow, up_arrow', { fontSize: '20px', fill: '#ff0' });
        this.player2 = this.add.text(1120, 100, 'Player2: A,D,W', { fontSize: '20px', fill: '#ff0' });
        this.sound = this.add.text(1120, 130, 'Toggle Music: P', { fontSize: '20px', fill: '#ff0' });
        this.close = this.add.text(1610, 0, 'X', { fontSize: '50px', fill: '#fff' });
        this.close.setInteractive();
        this.close.on("pointerover", () => {
            this.close.setColor('#f0f');
        });
        this.close.on("pointerout", () => {
            this.close.setColor('#fff');
        });
        this.close.on("pointerup", () => {
            this.scene.stop();
        });
    }
}