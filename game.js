let config = {
    type: Phaser.AUTO,
    width: 1640,
    height: 600,
    x: 100,
    y: 100,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 200}
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [LoadScene, MenuScene, ControlScene, GameScene, GameOver]
};

let game = new Phaser.Game(config);
