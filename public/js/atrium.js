import sceneEvents from "./eventcenter.js"

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
        this.dialogJSON = this.returnDialogJOSN()
    }

    create ()
    {
        this.scene.run('game-ui')

        this.input.on("pointerdown", pointer => {
            var deltaX = pointer.downX - window.innerWidth * 0.3
            var deltaY = pointer.downY - window.innerHeight * 0.3
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 0) {
                    this.mobileInput = "right"
                } else {
                    this.mobileInput = "left"
                }
            } else {
                if (deltaY > 0) {
                    this.mobileInput = "down"
                } else {
                    this.mobileInput = "up"
                }
            }
        })
        this.input.on("pointerup", pointer => {
            this.mobileInput = "stop"
        })
        this.input.on("pointerout", pointer => {
            this.mobileInput = "stop"
        })

        // ## PLAYER ##
        // The sprite
        this.fauna = this.physics.add.sprite(220, 710, 'fauna')
        this.fauna.body.setSize(10, 10, true)
        // Add the animation
        this.createPlayerAnimations()

        // Set the skin for the player using what was inputted in the previous screen
        this.setSkin(screen.currentSkin)

        // Load the map then set it as the current map for the ease of unloading it
        this.currentMap = this.loadMap('frogRoad', 'frogRoadTiles')

        // Start playing the animations
        this.fauna.anims.play('boy-idle-up')

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


        // var convo = this.physics.add.sprite(610, 1230, "npctalk").setDepth(1).setImmovable()
        // var pupa = this.physics.add.sprite(610, 1240, "pupa").setDepth(1).setImmovable()
        // this.physics.add.collider(this.fauna, pupa, null, null, this)
        // this.physics.add.collider(this.fauna, convo, this.hitConvo, null, this)

    }

    update() {
        // If no curser or no fauna, we don't update
        if (!this.cursors || !this.fauna) {
            return
        }

        // The stupid code that limites the data transfer rate
        if (this.updateCounter++ % 15 === 0) {
            // Send the location integer only when there is change
            if (this.lastCoord.x != Math.floor(this.fauna.x) || this.lastCoord.y != Math.floor(this.fauna.y)) {
                screen.client.sendLocation(Math.floor(this.fauna.x), Math.floor(this.fauna.y))
                this.lastCoord.x = Math.floor(this.fauna.x)
                this.lastCoord.y = Math.floor(this.fauna.y)
                // console.log('update location')
            }
        }


        // The code to make moveing work
        const speed = 150 //todo

        // this.fauna.setTexture('boy')
        const parts = this.fauna.anims.currentAnim.key.split('-')
        parts[0] = this.skin

        // remarks: I removed the ? after left, right, up and down, cause I couldn't obfuscate with them
        if (this.cursors.left.isDown || this.mobileInput == "left") {
            parts[1] = "run"
            parts[2] = "side"
            this.fauna.setVelocity(-speed, 0)
            this.fauna.scaleX = -1
            this.fauna.body.offset.x = this.leftOffset
        } else if (this.cursors.right.isDown || this.mobileInput == "right") {
            parts[1] = "run"
            parts[2] = "side"
            this.fauna.setVelocity(speed, 0)
            this.fauna.scaleX = 1
            this.fauna.body.offset.x = this.rightOffset
        } else if (this.cursors.up.isDown || this.mobileInput == "up") {
            parts[1] = "run"
            parts[2] = "up"
            this.fauna.setVelocity(0, -speed)
        } else if (this.cursors.down.isDown || this.mobileInput == "down") {
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
        console.log('loaded map')
        const tileset = map.addTilesetImage(mapName, tileName, 16, 16, 1, 2)
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
        this.addAllDialogChars(this.dialogJSON, mapName)
        // Return the map object to be set at as this.currentMap
        return map
    }


    addAllDialogChars(result, mapName) {
        this.dialogCharArray = []
        if (result[mapName]) {
            result[mapName].forEach( dialog => {
                var tempDialogChar = this.addDialogChar(dialog.x, dialog.y, dialog.type, dialog.character, dialog.content)
                this.dialogCharArray.push(tempDialogChar)
            })
        } else {
            console.log("Didn't load dialog because this map have none")
        }
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

    addDialogChar (x, y, type, character, content) {
        var dialog = this.physics.add.sprite(x + 10, y - 10, "npctalk").setDepth(1)
        dialog.setFrame(type + ".png")
        var dialogChar = this.physics.add.sprite(x, y, character).setDepth(1).setImmovable()

        // var dialogCollider = this.physics.add.collider(this.fauna, dialog)
        var charCollider = this.physics.add.collider(this.fauna, dialogChar, this.hitDialogChar, null, this)

        dialogChar.content = content
        // dialogChar.dialogCollider = dialogCollider
        dialogChar.collider = charCollider
        dialogChar.dialog = dialog
        return dialogChar
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

    hitDialogChar (fauna, dialogChar) {
        dialogChar.dialog.destroy()
        dialogChar.collider.destroy()
        sceneEvents.emit("startDialog", dialogChar.content)
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

        // destroy dialogChars
        this.dialogCharArray.forEach( dialogChar => {
            // console.log(dialogChar.collider)
            if (dialogChar.collider.active) dialogChar.collider.destroy()
            if (dialogChar.dialog) dialogChar.dialog.destroy()
            dialogChar.destroy()
        })

        // Destroy the map too
        this.currentMap.destroy()
        // Then load the new map
        this.currentMap = this.loadMap(map, tileset)
        // Teleport the player to the correct position
        this.fauna.setPosition(x, y)
        // Ask the client to emit change map
        screen.client.changeMap(map, oldMap)

    }


    // hitConvo (fauna, convo) {
    //     convo.destroy()
    //     console.log("hit pupa")
    //     sceneEvents.emit("test1312", ['yo', 'hello there', 'do you know who I am?'])
    // }

    // Add new players from the object from server
    addNewPlayer (id, x, y ,skin) {
        if (this.playerMap[id] != undefined) return
        this.playerMap[id] = this.add.sprite(x, y, skin)
        this.playerMap[id].skin = skin
        // console.log(this.playerMap[id])
    }



    endTween (arg) {
        // let parts = ["fauna", "idle"]
        // parts[2] = arg.targets[0].tweenDirection
        // arg.targets[0].anims.play(parts.join("-"), true)
        try {
            arg.targets[0].anims.pause()
        } catch (err) {}
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

        var tweenDelay = screen.client.delay

        // Set up the config for tween
        var config = {
            targets: player,
            x: x,
            y: y,
            duration: tweenDelay,
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
            "frogRoad": [
                {
                    "x": 4180,
                    "y": 30,
                    "map": "fireChick",
                    "tileset": "fireChickTiles",
                    "vert": true,
                    "tpX": 230,
                    "tpY": 2240
                }
            ],
            "fireChick": [
                {
                    "x": 1580,
                    "y": 25,
                    "map": "atrium",
                    "tileset": "atriumTiles",
                    "vert": false,
                    "tpX": 970,
                    "tpY": 2120
                },
                {
                    "x": 200,
                    "y": 2240,
                    "map": "frogRoad",
                    "tileset": "frogRoadTiles",
                    "vert": true,
                    "tpX": 4180,
                    "tpY": 30
                }
            ],
            "atrium": [
                {
                    "x": 970,
                    "y": 2210,
                    "map": "fireChick",
                    "tileset": "fireChickTiles",
                    "vert": false,
                    "tpX": 1580,
                    "tpY": 45
                },
                {
                    "x": 310,
                    "y": 330,
                    "map": "LG5",
                    "tileset": "LG5Tiles",
                    "vert": false,
                    "tpX": 2380,
                    "tpY": 60
                },
                {
                    "x": 1740,
                    "y": 1290,
                    "map": "AC1",
                    "tileset": "AC1Tiles",
                    "vert": true,
                    "tpX": 65,
                    "tpY": 260
                }
            ],
            "LG5": [
                {
                    "x": 2380,
                    "y": 25,
                    "map": "atrium",
                    "tileset": "atriumTiles",
                    "vert": false,
                    "tpX": 310,
                    "tpY": 360
                }
            ],
            "AC1": [
                {
                    "x": 35,
                    "y": 260,
                    "map": "atrium",
                    "tileset": "atriumTiles",
                    "vert": true,
                    "tpX": 1710,
                    "tpY": 1290
                },
                {
                    "x": 1685,
                    "y": 270,
                    "map": "AC2",
                    "tileset": "AC2Tiles",
                    "vert": true,
                    "tpX": 70,
                    "tpY": 600
                }
            ],
            "AC2": [
                {
                    "x": 10,
                    "y": 600,
                    "map": "AC1",
                    "tileset": "AC1Tiles",
                    "vert": true,
                    "tpX": 1665,
                    "tpY": 270
                },
                {
                    "x": 2180,
                    "y": 610,
                    "map": "CYT1",
                    "tileset": "CYT1Tiles",
                    "vert": true,
                    "tpX": 70,
                    "tpY": 160
                }
            ],
            "CYT1": [
                {
                    "x": 50,
                    "y": 160,
                    "map": "AC2",
                    "tileset": "AC2Tiles",
                    "vert": true,
                    "tpX": 2140,
                    "tpY": 610
                },
                {
                    "x": 1435,
                    "y": 125,
                    "map": "SG",
                    "tileset": "SGTiles",
                    "vert": true,
                    "tpX": 85,
                    "tpY": 850
                }
            ],
            "SG": [
                {
                    "x": 45,
                    "y": 850,
                    "map": "CYT1",
                    "tileset": "CYT1Tiles",
                    "vert": true,
                    "tpX": 1415,
                    "tpY": 125
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

    returnDialogJOSN () {
        return {
            "atrium": [
                {
                    "type": "talk3",
                    "character": "pupa",
                    "x": 800,
                    "y": 1250,
                    "content": ["Hi there (press or click on here to continue)", "Welcome to HKUST", "feel free to explore around here"]
                }
            ]

        }
    }
}