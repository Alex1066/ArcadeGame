class EnemyPatrol {
    constructor(startX, startY, endX, endY) {
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.startX = startX;
        if(this.startX < this.endX) {
            this.left_to_right = true;
            this.right_to_left = false;
        }
        else {
            this.left_to_right = false;
            this.right_to_left = true;
        }
        if (this.startY < this.endY) {
            this.up_down = true;
            this.down_up = false;
        }
        else {
            this.down_up = true;
            this.up_down = false;
        }
    }
}
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key:'GameScene'
        });
    }
    init(data){
        this.soundFX = data;
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
    setWorld() {
        this.index = 0;
        // An array containing EnemyPatrol objects.
        // Used for patrol movement and animation.
        this.patrolUnits = [];
        // Array of Point objects which represents respawn coordinates.
        this.spawnGroup = [];
        this.lives = [3, 3];
        this.scores = [0, 0];

        this.physics.world.setBounds(0, 0, 800, 3200);
        this.image = this.add.tileSprite(800, 1600, 1620, 3200, 'background');
        this.map = this.add.tilemap('map');
        this.tileset = this.map.addTilesetImage('tileset3');
        this.backgroundLayer = this.map.createStaticLayer('Tile Layer 1', this.tileset);
        this.backgroundLayer.setCollisionBetween(0, 1000);
        this.delimeter = new Phaser.Geom.Rectangle(800, 0, 20, 3200);
        let graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
        graphics.fillRectShape(this.delimeter).setDepth(1);
        this.scoreTextPlayer1 = this.add.text(10, 10, 'Score: 0', { fontSize: '16px', fill: '#f00' }).setScrollFactor(0);
        this.scoreTextPlayer2 = this.add.text(10, 10, 'Score: 0', { fontSize: '16px', fill: '#f00' }).setScrollFactor(0);
        this.livesPlayer1 = this.add.text(10, 25, 'Lives: ' + this.lives[0], { fontSize: '16px', fill: '#0b0' }).setScrollFactor(0);
        this.livesPlayer2 = this.add.text(10, 25, 'Lives: ' + this.lives[1], { fontSize: '16px', fill: '#0b0' }).setScrollFactor(0);

    }

    createAnimations() {
        // Player1.
        this.anims.create({
            key: 'dude_left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'dude_turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'dude_right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // Player2.
        this.anims.create({
            key: 'tank_left',
            frames: this.anims.generateFrameNumbers('tank', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });    //
        this.anims.create({
            key: 'tank_turn',
            frames: [ { key: 'tank', frame: 6 } ],
            frameRate: 20
        });
        this.anims.create({
            key: 'tank_right',
            frames: this.anims.generateFrameNumbers('tank', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        // Patrol units.[0, 1, 2,3,4,5,6,7,8,9]
        this.anims.create({
            key: 'creature_right',
            frames: this.anims.generateFrameNumbers('creature', [0, 1, 2, 3, 4, 5, 6, 7, 8,9]),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'creature_left',
            frames: this.anims.generateFrameNumbers('creature_r', [4, 3, 2, 1, 0, 9, 8, 7, 6, 5]),
            frameRate: 10,
            repeat: -1
        });

        // Fire.
        this.anims.create({
            key: 'fire',
            frames: this.anims.generateFrameNumbers('fire', { start: 0, end: 31 }),
            frameRate: 20,
            repeat: -1
        });
    }
    shapePhysicsBody(object, sizeX, sizeY, offsetX, offsetY) {
        object.setSize(sizeX, sizeY);
        object.setOffset(offsetX, offsetY);
    }
    createPlayers() {
        this.player1 = this.physics.add.sprite(96, 32, 'dude');
        this.player1.setCollideWorldBounds(true);
        this.physics.add.collider(this.player1, this.backgroundLayer);
        this.shapePhysicsBody(this.player1,30 ,40, 1, 8);
        this.player2 = this.physics.add.sprite(500, 32, 'tank');
        this.player2.setCollideWorldBounds(true);
        this.physics.add.collider(this.player2, this.backgroundLayer);
        this.shapePhysicsBody(this.player2,30 ,28, 0, 0);

    }
    setControls() {
        // Player1
        this.left = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.right = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        this.up = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        // Player2
        this.a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    }

    setCameras() {
        this.camera1 = this.cameras.main;
        this.camera1.setBounds(0, 0, 1600, 3200);
        this.camera2 = this.cameras.add(820, 0, 800, 600);
        this.camera2.setBounds(0, 0, 800, 3200);
        this.camera2.startFollow(this.player1);
        this.camera1.startFollow(this.player2);
        this.scoreTextPlayer1.cameraFilter = 1;
        this.livesPlayer1.cameraFilter = 1;
        this.scoreTextPlayer2.cameraFilter = 2;
        this.livesPlayer2.cameraFilter = 2;
    }
    prepareObject(type, object) {
        switch(type) {
            case 'star':
                this.object = this.physics.add.image(Math.floor(object.x/32) * 32 + 16, Math.floor(object.y/32 +1) *32 -11, 'star');
                break;
            case 'fire':
                this.object = this.physics.add.sprite(Math.floor(object.x/32 +1) * 32, Math.floor(object.y/32) * 32 + 8, 'fire').setScale(1,0.5);
                this.shapePhysicsBody(this.object, 40, 70, 13, 50);
                break;
            case 'patrol':
                this.object = this.physics.add.sprite(Math.floor(object.x/32 +1) * 32, Math.floor(object.y/32) * 32 + 3, 'creature').setScale(1/3,1/3);
                this.shapePhysicsBody(this.object, 150, 160, 13, 20);
                break;
        }
        this.object.body.setAllowGravity(false);
        return this.object;
    }
    getObjectLayers() {
        let spawnPoints = this.map.getObjectLayer('SpawnPoints')['objects'];
        let fireObjects = this.map.getObjectLayer('FireLayer')['objects'];
        let patrolObjects = this.map.getObjectLayer('PatrolLayer')['objects'];
        let starObjects = this.map.getObjectLayer('StarLayer')['objects'];
        this.fireGroup = this.physics.add.staticGroup();
        this.patrolGroup = this.physics.add.staticGroup();
        this.starGroup = this.physics.add.staticGroup();
        starObjects.forEach(object => {
            this.starGroup.add(this.prepareObject('star', object));
        }, this);
        spawnPoints.forEach(object => {
            this.spawnGroup.push(new Point(object.x, object.y));
        }, this);
        fireObjects.forEach(object => {
            this.fireGroup.add(this.prepareObject('fire', object));
        }, this);
        patrolObjects.forEach(object => {
            this.patrolGroup.add(this.prepareObject('patrol', object));
            this.patrolUnits.push(new EnemyPatrol(object.x,object.y, object.x + object.polyline[1].x, object.y + object.polyline[1].y));
        }, this);
    }
    setOverlapEvents() {
        this.starGroup.children.iterate( function (child) {
            this.physics.add.overlap([this.player1, this.player2], child, this.starCollision, null, this);
        }, this);
        this.fireGroup.children.iterate( function (child) {
            child.anims.play('fire', true);
            this.physics.add.overlap([this.player1, this.player2], child, this.dangerCollision, null, this);
        }, this);
        this.patrolGroup.children.iterate( function (child) {
            this.physics.add.overlap([this.player1, this.player2], child, this.dangerCollision, null, this);
        }, this);
    }
    create() {
        this.setWorld();
        this.createAnimations();
        this.createPlayers();
        this.setControls();
        this.setCameras();
        this.getObjectLayers();
        this.setOverlapEvents();

    }
    randomSpawn(player) {
        let index = Phaser.Math.Between(0, this.spawnGroup.length - 1);
        player.body.x = this.spawnGroup[index].x;
        player.body.y = this.spawnGroup[index].y;
    }
    dangerCollision(player) {
        this.randomSpawn(player);
        if (player === this.player1) {
            this.lives[0]--;
            this.livesPlayer1.setText('Lives: ' + this.lives[0]);
        }
        else {
            this.lives[1]--;
            this.livesPlayer2.setText('Lives: ' + this.lives[1]);
        }
        if(this.lives[0] === 0) {
            this.soundFX.stop();
            this.scene.stop('GameScene');
            this.scene.start('GameOver', 'Player2');
        }
        if(this.lives[1] === 0) {
            this.soundFX.stop();
            this.scene.stop('GameScene');
            this.scene.start('GameOver', 'Player1');
        }
    }
    starCollision(player, child) {
        child.disableBody(true, true);
        if (player === this.player1) {
            this.scores[0] += 10;
            this.scoreTextPlayer1.setText('Score: ' + this.scores[0]);
        }
        else {
            this.scores[1] +=10;
            this.scoreTextPlayer2.setText('Score: ' + this.scores[1]);
        }
        if (this.starGroup.countActive(true) === 0) {
            if (this.scores[0] > this.scores[1]) {
                this.soundFX.stop();
                this.scene.stop('GameScene');
                this.scene.start('GameOver', 'Player1');
            }
            else {
                this.soundFX.stop();
                this.scene.stop('GameScene');
                this.scene.start('GameOver', 'Player2');
            }
            this.pause();
        }
    }
    animatePatrolUnits() {
        this.index = 0;
        this.patrolGroup.children.iterate(function (child) {
            if (child.x < this.patrolUnits[this.index].endX && this.patrolUnits[this.index].left_to_right) {
                child.setVelocityX(100);
                child.anims.play('creature_right', true);
            }
            else if(child.x >= this.patrolUnits[this.index].endX && !this.patrolUnits[this.index].right_to_left) {
                this.patrolUnits[this.index].left_to_right = false;
                this.patrolUnits[this.index].right_to_left = true;
                child.setVelocityX(0);
                child.anims.pause();
            }
            if (child.x > this.patrolUnits[this.index].startX && this.patrolUnits[this.index].right_to_left) {
                child.setVelocityX(-100);
                child.anims.play('creature_left', true);
            }
            else if(child.x <= this.patrolUnits[this.index].startX && !this.patrolUnits[this.index].left_to_right) {
                this.patrolUnits[this.index].left_to_right = true;
                this.patrolUnits[this.index].right_to_left = false;
                child.setVelocityX(0);
                child.anims.pause();
            }
            this.index++;
        }, this);
    }
    update() {
        this.animatePatrolUnits();

        if (this.left.isDown) {
            this.player1.setVelocityX(-110);
            this.player1.anims.play('dude_left', true);
        }
        else if (this.right.isDown) {
            this.player1.setVelocityX(110);
            this.player1.anims.play('dude_right', true);
        }
        else {
            this.player1.setVelocityX(0);
            this.player1.anims.play('dude_turn', true);
        }
        if (this.up.isDown && (this.player1.body.onFloor() || this.player1.body.touching.down)) {
            this.player1.setVelocityY(-230);
        }

        if (this.a.isDown) {
            this.player2.setVelocityX(-110);
            this.player2.anims.play('tank_left', true);
        }
        else if (this.d.isDown) {
            this.player2.setVelocityX(110);
            this.player2.anims.play('tank_right', true);
        }
        else {
            this.player2.setVelocityX(0);
            this.player2.anims.play('tank_turn', true);
        }
        if (this.w.isDown && (this.player2.body.onFloor() || this.player2.body.touching.down)) {
            this.player2.setVelocityY(-230);
        }
    }
}