

export default class Atrium extends Phaser.Scene {

    constructor() {
        super("Atrium")
    }

    preload ()
    {
        // Add the Sprite for player here
        this.fauna = Phaser.Physics.Arcade.Sprite
        // Controls must be added inside here
        this.cursors = this.input.keyboard.createCursorKeys()

        // Make it so that client can reference here, stupid code but works
        screen.client.setGameScene(this.game)

        this.portalJSON = this.returnPortalJSON()
        this.offsetJSON = this.returnOffsetJSON()
    }

    create ()
    {
        // Texture
        // this.currentTexture = new Phaser.Textures.Texture()
        // ## PLAYER ##
        // The sprite
        this.fauna = this.physics.add.sprite(600, 1200, 'fauna')
        this.fauna.body.setSize(15, 25, true)
        console.log('offset', this.fauna.body.offset.x)
        // Add the animation
        this.createPlayerAnimations()

        // console.log(this.fauna.texture.manager)
        // this.fauna.texture.manager.setTexture(this.fauna, 'fauna')

        this.setSkin(screen.currentSkin)

        // Load the map then set it as the current map for the ease of unloading it
        this.currentMap = this.loadMap('atriumSample1', 'atriumSampleTiles')

        // Start playing the animations
        this.fauna.anims.play('boy-idle-up')

        // this.fauna.setTexture('boy')

        // Make the camera follow the player
        this.cameras.main.startFollow(this.fauna, true)

        // The map have no players yet
        this.playerMap = {}

        // Start the updateCounter to 0 to make the client send something to the server every sometime
        this.updateCounter = 0
        // Set a last coord for client to know if its location changed since update
        this.lastCoord = {x: 0, y: 0}

        // Done everything else, now can ask for other players
        screen.client.askNewPlayer(screen.currentSkin)

        this.fauna.setDepth(1)
    }

    update() {
        // If no curser or no fauna, we don't update
        if (!this.cursors || !this.fauna) {
            return
        }

        // The stupid code that limites the data transfer rate
        if (this.updateCounter++ % 10 === 0) { //todo
            // Send the location integer only when there is change
            if (this.lastCoord.x != Math.floor(this.fauna.x) || this.lastCoord.y != Math.floor(this.fauna.y)) {
                screen.client.sendLocation(Math.floor(this.fauna.x), Math.floor(this.fauna.y))
                this.lastCoord.x = Math.floor(this.fauna.x)
                this.lastCoord.y = Math.floor(this.fauna.y)
                // console.log('update location')
            }
        }


        // The code to make moveing work
        const speed = 100

        // this.fauna.setTexture('boy')
        const parts = this.fauna.anims.currentAnim.key.split('-')
        parts[0] = this.skin

        if (this.cursors.left?.isDown) {
            parts[1] = "run"
            parts[2] = "side"
            this.fauna.setVelocity(-speed, 0)
            this.fauna.scaleX = -1
            this.fauna.body.offset.x = this.leftOffset
        } else if (this.cursors.right?.isDown) {
            parts[1] = "run"
            parts[2] = "side"
            this.fauna.setVelocity(speed, 0)
            this.fauna.scaleX = 1
            this.fauna.body.offset.x = this.rightOffset
        } else if (this.cursors.up?.isDown) {
            parts[1] = "run"
            parts[2] = "up"
            this.fauna.setVelocity(0, -speed)
        } else if (this.cursors.down?.isDown) {
            parts[1] = "run"
            parts[2] = "down"
            this.fauna.setVelocity(0, speed)
        } else {
            parts[1] = 'idle'
            this.fauna.setVelocity(0, 0)
        }
        // console.log(parts.join('-'))
        this.fauna.anims.play(parts.join('-'), true)

    }


    setSkin (skinName) {
        this.skin = skinName
        this.leftOffset = this.offsetJSON[skinName].leftOffset
        this.rightOffset = this.offsetJSON[skinName].rightOffset
        this.fauna.body.offset.x = this.rightOffset
    }


    loadMap (mapName, tileName) {
        // Set up the map and tileset variable
        const map = this.make.tilemap({key: mapName})
        const tileset = map.addTilesetImage(mapName, tileName)
        // Make a array for storing colliders, then put it inside map for the ease of deleting it
        map.colliders = []
        map.layers.forEach(layer => {
            // For each layer, add colliders from the property
            var tempLayer = map.createStaticLayer(layer.name, tileset)
            tempLayer.setCollisionByProperty({collide: true})
            var tempCollider = this.physics.add.collider(this.fauna, tempLayer)
            // Add it the the colliders array
            map.colliders.push(tempCollider)
        })
        // Add all portals from the portal JSON
        this.addAllPortals(this.portalJSON, mapName)
        // Return the map object to be set at as this.currentMap
        return map
    }



    addAllPortals (result, mapName) {
        // Add portal using the object result (JSON) and the map name as the key
        // Add a array storing portals for the ease of deleting it
        this.portalArray = []
        result[mapName].forEach(portal => {
            // Add the portal by passing all the parameters from the JSON
            var tempPortal = this.addPortal(portal.x, portal.y, portal.map, portal.tileset, portal.vert, portal.tpX, portal.tpY, mapName)
            // Push it to the portal array so that we can access it later
            this.portalArray.push(tempPortal)
        })

    }

    addPortal (x, y, map, tileset, vert, tpX, tpY, mapName) {
        // If vertial, add the vertical image, vice versa
        if (vert) {
            var portal = this.physics.add.image(x, y, 'portalVert').setImmovable()
        } else {
            var portal = this.physics.add.image(x, y, 'portalHorz').setImmovable()
        }
        // Add the collider and name it collider
        var collider = this.physics.add.collider(this.fauna, portal, this.hitPortal, null, this)
        // Add all the properties to the portal object
        portal.setScale(5, 5)
        portal.oldMap = mapName
        portal.targetMap = map
        portal.targetTileset = tileset
        portal.tpX = tpX
        portal.tpY = tpY
        // Even the collider get added to the portal object
        portal.collider = collider
        // Return it and it will be stored inside this.portalArray
        return portal
    }


    hitPortal (fauna, portal) {
        // Delete all colliders from the map layers
        this.currentMap.colliders.forEach(collider => collider.destroy())
        // Delete all colliders from the portal
        this.portalArray.forEach(portal => portal.collider.destroy())
        // Fetch the data from the portal before it is destroyed
        var oldMap = portal.oldMap
        var map = portal.targetMap
        var tileset = portal.targetTileset
        var x = portal.tpX
        var y = portal.tpY
        // Now that data is fetched, we can destroy all portals
        this.portalArray.forEach( tempPortal => tempPortal.destroy())
        // Destroy the map too
        this.currentMap.destroy()
        // Then load the new map
        this.currentMap = this.loadMap(map, tileset)
        // Teleport the player to the correct position
        this.fauna.setPosition(x, y)
        // Ask the client to emit change map
        screen.client.changeMap(map, oldMap)

    }

    // Add new players from the object from server
    addNewPlayer (id, x, y ,skin) {
        this.playerMap[id] = this.add.sprite(x, y, skin)
        this.playerMap[id].skin = skin
        // console.log(this.playerMap[id])
    }



    endTween (arg) {
        // let parts = ["fauna", "idle"]
        // parts[2] = arg.targets[0].tweenDirection
        // arg.targets[0].anims.play(parts.join("-"), true)
        arg.targets[0].anims.pause()
    }

    // Move players from client from server
    movePlayer (id, x, y) {
        // console.log("movePlayer", id, x, y)
        // Find the player from player map
        var player = this.playerMap[id]
        if (player == undefined) return
        // var distance = Phaser.Math.Distance.Between(player.x,player.y,x,y);


        let tempDirection = player.tweenDirection

        if (Math.abs(player.x - x) > Math.abs(player.y - y)) {
            if (player.x > x) {
                player.tweenDirection = "side"
                player.scaleX = -1
            } else {
                player.tweenDirection = "side"
                player.scaleX = 1
            }
        } else {
            if (player.y > y) {
                player.tweenDirection = "up"
            } else {
                player.tweenDirection = "down"
            }
        }
        if (tempDirection == player.tweenDirection) {
            player.anims.resume()
        } else {
            let parts = [this.playerMap[id].skin, "run"]
            parts[2] = player.tweenDirection
            player.anims.play(parts.join("-"), true)
        }



        // Set up the config for tween
        var config = {
            targets: player,
            x: x,
            y: y,
            duration: 250, //todo
            // onStart: this.startTween,
            onComplete: this.endTween
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

    removeAllPlayers () {
        // Loop through the player map and remove them all
        for (var key in this.playerMap) {
            this.removePlayer(key)
        }
    }



    createPlayerAnimations () {
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
        this.anims.create({
            key: 'boy-idle-down',
            frames: [{ key: 'boy', frame: 'walk-down-3.png'}]
        })
        this.anims.create({
            key: 'boy-idle-up',
            frames: [{ key: 'boy', frame: 'walk-up-3.png'}]
        })
        this.anims.create({
            key: 'boy-idle-side',
            frames: [{ key: 'boy', frame: 'walk-side-3.png'}]
        })
        this.anims.create({
            key: 'boy-run-down',
            frames: this.anims.generateFrameNames('boy', { start: 1, end: 4, prefix: 'walk-down-', suffix: '.png'}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'boy-run-up',
            frames: this.anims.generateFrameNames('boy', { start: 1, end: 4, prefix: 'walk-up-', suffix: '.png'}),
            repeat: -1,
            frameRate: 10
        })
        this.anims.create({
            key: 'boy-run-side',
            frames: this.anims.generateFrameNames('boy', { start: 1, end: 4, prefix: 'walk-side-', suffix: '.png'}),
            repeat: -1,
            frameRate: 10
        })
    }


    returnPortalJSON () {
        return{
            "atriumSample1": [
                {
                    "x": 700,
                    "y": 1050,
                    "map": "dungeon",
                    "tileset": "tiles",
                    "vert": false,
                    "tpX": 100,
                    "tpY": 100
                }
            ],
            "dungeon": [
                {
                    "x": 50,
                    "y": 50,
                    "map": "atriumSample1",
                    "tileset": "atriumSampleTiles",
                    "vert": true,
                    "tpX": 600,
                    "tpY": 1100
                }
            ]
        }
    }

    returnOffsetJSON () {
        return {
            "fauna": {
                "rightOffset": 8.5,
                "leftOffset": 22
            },
            "boy": {
                "rightOffset": 1,
                "leftOffset": 16
            }
        }
    }
}