// The main scene, supposed to load assets, maybe also starting scene?
export default class Main extends Phaser.Scene {
    constructor() {
        // Don't know why is needed? because phaser.scene needed a key?
        super("Main");
    }

    preload () {
        this.introText = this.add.text(screen.gameWidth * 0.5 - 4*30, 20, "USTown.live", { fontSize: "30px"})
        this.waitingText = this.add.text(screen.gameWidth * 0.5 - 6*30, 60, "Please wait for the game to load", { fontSize: "16px"})
        this.authorText = this.add.text(screen.gameWidth * 0.1, screen.gameHeight * 0.8, "By Chit", { fontSize: "25px"})
        // supposed to load everything here

        // ## SCENES ##
        // tilemapTiledJSON NAME MUST BE THE SAME AS THE TILESHEET PNG NAME
        // tilemapTiledJSON NAME MUST BE THE SAME AS THE TILESHEET PNG NAME


        this.load.image('atriumTiles', 'assets/images/atrium_extruded.png')
        this.load.tilemapTiledJSON('atrium', 'assets/atriummap.json')

        this.load.image('CYT1Tiles', 'assets/images/CYT1_extruded.png')
        this.load.tilemapTiledJSON('CYT1', 'assets/CYT1map.json')

        this.load.image('LG5Tiles', 'assets/images/LG5_extruded.png')
        this.load.tilemapTiledJSON('LG5', 'assets/LG5map.json')

        this.load.image('AC1Tiles', 'assets/images/AC1_extruded.png')
        this.load.tilemapTiledJSON('AC1', 'assets/AC1map.json')

        this.load.image('frogRoadTiles', 'assets/images/frogRoad_extruded.png')
        this.load.tilemapTiledJSON('frogRoad', 'assets/frogRoadmap.json')

        this.load.image('fireChickTiles', 'assets/images/fireChick_extruded.png')
        this.load.tilemapTiledJSON('fireChick', 'assets/fireChickmap.json')

        this.load.image('SGTiles', 'assets/images/SG_extruded.png')
        this.load.tilemapTiledJSON('SG', 'assets/SGmap.json')

        this.load.image('AC2Tiles', 'assets/images/AC2_extruded.png')
        this.load.tilemapTiledJSON('AC2', 'assets/AC2map.json')

        // ## PLAYERS ##
        // The main player
        this.load.atlas('fauna', 'assets/images/fauna.png', 'assets/fauna.json')
        // Other skins
        this.load.atlas('boy', 'assets/images/boy.png', 'assets/boy.json')

        // ## NPCS ##
        this.load.atlas('pupa', 'assets/images/pupaA.png', 'assets/pupaA.json')
        this.load.atlas('npctalk', 'assets/images/npctalk.png', 'assets/npctalk.json')

        // ## OBJECTS ##
        this.load.image('portalVert', '/assets/images/portalVert.png')
        this.load.image('portalHorz', '/assets/images/portalHorz.png')

        this.load.image("textbox", "assets/images/textbox.png")


    };

    create () {

        let skinList = ["fauna", "boy"]
        let skinIndex = 0
        screen.currentSkin = skinList[skinIndex]
        var skinText = this.add.text(screen.gameWidth * 0.5 - 150, 100, "Click to choose skin: " + screen.currentSkin).setInteractive()
        skinText.on('pointerdown', function (pointer) {
            if (skinIndex < skinList.length - 1) {
                skinIndex += 1
            } else {
                skinIndex = 0
            }
            screen.currentSkin = skinList[skinIndex]
            this.text = "Click to choose skin: " + screen.currentSkin
        })

        var tempThis = this
        var startText = this.add.text(screen.gameWidth * 0.5 - 150, 150, "Click to start game", { fontSize: "25px", color: "rgb(254,180,92)"}).setInteractive()
        startText.on('pointerdown', function (pointer) {
            // Start the scene
            var test = tempThis.scene.start('Atrium');

            // Send test to server
            screen.client.sendTest();
        })

        // // When the user click the screen
        // this.input.on('pointerup', function (pointer) {
        //
        //     // Start the scene
        //     var test = this.scene.start('Atrium');
        //
        //     // Send test to server
        //     screen.client.sendTest();
        //
        // }, this);
    }
}
