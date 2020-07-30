// import {debugDraw} from "./debug.js";
// import Client from "./client.js"
// import SuperScene from "./superscene.js";

export default class Atrium extends Phaser.Scene {

    // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    // pirvate fauna!: Phaser.Physics.Arcade.Sprite

    constructor() {
        super("Atrium")
    }

    preload ()
    {
        this.cursors = this.input.keyboard.createCursorKeys()
        // this.fauna = Phaser.Physics.Arcade.Sprite
        // console.log(this.game.scene.getScene('Atrium'))
        screen.client.setGameScene(this.game)
    }

    create ()
    {
        const map = this.make.tilemap({ key: 'dungeon'});
        const tileset = map.addTilesetImage('dungeon', 'tiles');

        map.createStaticLayer('ground', tileset);
        const wallLayer = map.createStaticLayer('wall', tileset);

        wallLayer.setCollisionByProperty({collide: true});

        this.fauna = this.physics.add.sprite(128, 128, 'fauna', 'walk-down-3.png');
        this.fauna.body.setSize(this.fauna.width * 0.5, this.fauna.height * 0.8)

        this.anims.create({
            key: 'fauna-idle-down',
            frames: [{ key: 'fauna', frame: 'walk-down-3.png'}]
        })

        this.anims.create({
            key: 'fauna-idle-up',
            frames: [{ key: 'fauna', frame: 'walk-up-3.png'}]
        })

        this.anims.create({
            key: 'fauna-idle-side',
            frames: [{ key: 'fauna', frame: 'walk-side-3.png'}]
        })

        this.anims.create({
            key: 'fauna-run-down',
            frames: this.anims.generateFrameNames('fauna', { start: 1, end: 8, prefix: 'run-down-', suffix: '.png'}),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'fauna-run-up',
            frames: this.anims.generateFrameNames('fauna', { start: 1, end: 8, prefix: 'run-up-', suffix: '.png'}),
            repeat: -1,
            frameRate: 10
        })

        this.anims.create({
            key: 'fauna-run-side',
            frames: this.anims.generateFrameNames('fauna', { start: 1, end: 8, prefix: 'run-side-', suffix: '.png'}),
            repeat: -1,
            frameRate: 10
        })

        this.fauna.anims.play('fauna-idle-up')

        this.physics.add.collider(this.fauna, wallLayer)

        this.cameras.main.startFollow(this.fauna, true)

        this.playerMap = {}
        // Client.askNewPlayer()

        this.updateCounter = 0

        screen.client.askNewPlayer()
    }

    addNewPlayer (id, x, y) {
        this.playerMap[id] = this.add.sprite(x, y, 'fauna', 'walk-down-3.png')
    }

    movePlayer (id, x, y) {
        var player = this.playerMap[id];
        // console.log(player)
        // var distance = Phaser.Math.Distance.Between(player.x,player.y,x,y);

        var config = {
            targets: player,
            x: x,
            y: y,
            duration: 100 //todo
        }

        var tween = this.tweens.add(config)
        // var tween = this.add.tween(config).to({x:x,y:y})
        // var duration = 0.2//distance*10;
        // tween.start();
    }

    removePlayer (id) {
        this.playerMap[id].destroy();
        delete this.playerMap[id];
    }

    update()
    {
        if (!this.cursors || !this.fauna) {
            return
        }

        if (this.updateCounter++ % 5 === 0) { //todo
            // console.log("update position to server")
            screen.client.sendLocation(Math.floor(this.fauna.x), Math.floor(this.fauna.y))
        }


        const speed = 100

        if (this.cursors.left?.isDown) {
            this.fauna.anims.play('fauna-run-side', true)
            this.fauna.setVelocity(-speed, 0)

            this.fauna.scaleX = -1
            this.fauna.body.offset.x = 24
        } else if (this.cursors.right?.isDown) {
            this.fauna.anims.play('fauna-run-side', true)
            this.fauna.setVelocity(speed, 0)

            this.fauna.scaleX = 1
            this.fauna.body.offset.x = 8
        } else if (this.cursors.up?.isDown) {
            this.fauna.anims.play('fauna-run-up', true)
            this.fauna.setVelocity(0, -speed)
        } else if (this.cursors.down?.isDown) {
            this.fauna.anims.play('fauna-run-down', true)
            this.fauna.setVelocity(0, speed)
        } else {
            const parts = this.fauna.anims.currentAnim.key.split('-')
            parts[1] = 'idle'
            this.fauna.play(parts.join('-'))
            this.fauna.setVelocity(0, 0)
        }

    }
}