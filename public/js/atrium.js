// import {debugDraw} from "./debug.js";
// import Client from "./client.js"
// import SuperScene from "./superscene.js";

export default class Atrium extends Phaser.Scene {

    // Only work in typescript?
    // private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    // pirvate fauna!: Phaser.Physics.Arcade.Sprite

    constructor() {
        super("Atrium")
    }

    preload ()
    {
        // Controls must be added insde here
        this.cursors = this.input.keyboard.createCursorKeys()

        // this.fauna = Phaser.Physics.Arcade.Sprite
        // console.log(this.game.scene.getScene('Atrium'))

        // Make it so that client can reference here, stupid code but works
        screen.client.setGameScene(this.game)
    }

    create ()
    {
        // Make the map
        const map = this.make.tilemap({ key: 'dungeon'});
        const tileset = map.addTilesetImage('dungeon', 'tiles');

        // Load the map layer
        map.createStaticLayer('ground', tileset);
        const wallLayer = map.createStaticLayer('wall', tileset);

        // So that user collides to the wall
        wallLayer.setCollisionByProperty({collide: true});

        // The sprite
        this.fauna = this.physics.add.sprite(128, 128, 'fauna', 'walk-down-3.png');
        this.fauna.body.setSize(this.fauna.width * 0.5, this.fauna.height * 0.8)

        //todo A bunch of animation, make them into another function
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

        // Start playing the animations
        this.fauna.anims.play('fauna-idle-up')

        // Set collider so that wall and player collides
        this.physics.add.collider(this.fauna, wallLayer)

        // Make the camera follow the player
        this.cameras.main.startFollow(this.fauna, true)

        // The map have no players yet
        this.playerMap = {}
        // Client.askNewPlayer()

        // Start the updateCounter to 0 to make the client send something to the server every sometime
        this.updateCounter = 0

        // Done everything else, now can ask for other players
        screen.client.askNewPlayer()
    }

    // Add new players from the object from server
    addNewPlayer (id, x, y) {
        this.playerMap[id] = this.add.sprite(x, y, 'fauna', 'walk-down-3.png')
    }

    // Move players from client from server
    movePlayer (id, x, y) {
        // Find the player from player map
        var player = this.playerMap[id];
        // console.log(player)
        // var distance = Phaser.Math.Distance.Between(player.x,player.y,x,y);

        // Set up the config for tween
        var config = {
            targets: player,
            x: x,
            y: y,
            duration: 100 //todo
        }

        // Tween the player to the new place
        var tween = this.tweens.add(config)
        // var tween = this.add.tween(config).to({x:x,y:y})
        // var duration = 0.2//distance*10;
        // tween.start();
    }

    // Remove players when server tell us to
    removePlayer (id) {
        this.playerMap[id].destroy();
        delete this.playerMap[id];
    }

    update()
    {
        // If no curser or no fauna, we don't update
        if (!this.cursors || !this.fauna) {
            return
        }

        // The stupid code that limites the data transfer rate
        if (this.updateCounter++ % 5 === 0) { //todo
            // console.log("update position to server")
            // Send the locaiton interger
            screen.client.sendLocation(Math.floor(this.fauna.x), Math.floor(this.fauna.y))
        }


        // The code to make moveing work
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