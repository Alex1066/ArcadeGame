class LoadScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'LoadScene'
        })
    }
    loadAudio() {
        this.load.audio('menu', 'assets/audio/menu.mp3');
        this.load.audio('post', ['assets/audio/post_game.mp3']);
    }
    loadImages() {
        this.load.image('bkg', 'assets/image/foggy.png');
        this.load.image('tileset3', 'assets/image/tileset3.png');
        this.load.image('star', 'assets/image/star.png');
        this.load.image('background', 'assets/image/background.png');
    }
    loadSprites() {
        this.load.spritesheet('dude', 'assets/sprite/dude.png', {frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('tank', 'assets/sprite/tank.png', {frameWidth: 32, frameHeight: 26});
        this.load.spritesheet('fire', 'assets/sprite/fire.png', {frameWidth: 64, frameHeight: 128});
        this.load.spritesheet('creature', 'assets/sprite/creature.png', {frameWidth: 189, frameHeight: 189});
        this.load.spritesheet('creature_r', 'assets/sprite/creature_r.png', {frameWidth: 189, frameHeight: 189});
        this.load.spritesheet('firework', 'assets/sprite/firework.png', {frameWidth: 256, frameHeight: 256});
    }
    loadMaps() {
        this.load.tilemapTiledJSON('map', 'assets/map/FinalMap.json');
    }
    preload() {
        let loadingBar = this.add.graphics({
            fillStyle: {
                color: 0x00ffff
            }
        });
        this.loadAudio();
        this.loadImages();
        this.loadSprites();
        this.loadMaps();
        this.load.on("progress", (percent) => {
            loadingBar.fillRect(0, 275, 1640 * percent , 50);
        });
        this.loading = this.add.text(550, 100, 'Loading', { fontSize: '128px', fill: '#fff' });
    }
    create() {
        this.scene.start('MenuScene');
    }
}