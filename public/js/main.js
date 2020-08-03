// The main scene, supposed to load assets, maybe also starting scene?
export default class Main extends Phaser.Scene {
    constructor() {
        // Don't know why is needed? because phaser.scene needed a key?
        super("Main");
    }

    preload () {
        // supposed to load everything here

        // ## SCENES ##
        // The dungeon scene
        this.load.image('tiles', 'assets/images/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon', 'assets/map.json');
        // The atrium scene
        this.load.image('atriumSampleTiles', 'assets/images/atriumSample1.png')
        this.load.tilemapTiledJSON('atriumSample1', 'assets/atriumSample1.json')

        // ## PLAYERS ##
        // The main player
        this.load.atlas('fauna', 'assets/images/fauna.png', 'assets/fauna.json')
        // Other skins
        this.load.atlas('boy', 'assets/images/boy.png', 'assets/boy.json')

        // ## OBJECTS ##
        this.load.image('portalVert', '/assets/images/portalVert.png')
        this.load.image('portalHorz', '/assets/images/portalHorz.png')


    };

    create () {

        let skinList = ["fauna", "boy"]
        let skinIndex = 0
        screen.currentSkin = skinList[skinIndex]
        var skinText = this.add.text(100, 100, "Click to choose skin: " + screen.currentSkin).setInteractive()
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
        var startText = this.add.text(100, 150, "Click to start game").setInteractive()
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
