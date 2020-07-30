// import Client from "./client.js"
// import SuperScene from "./superscene.js";

// let config = {
//     active: true
// }
//
// var Main = new Phaser.Class ({
//
//     Extends: SuperScene,
//
//     initialize:
//
//     function SceneB ()
//     {
//         Phaser.Scene.call(this, { key: 'sceneB' });
//     },
//
//     preload () {
//         this.load.image('tiles', 'assets/images/dungeon_tiles.png');
//         this.load.tilemapTiledJSON('dungeon', 'assets/map.json');
//
//         this.load.atlas('fauna', 'assets/images/fauna.png', 'assets/fauna.json');
//
//     },
//
//     create () {
//         this.input.on('pointerup', function (pointer) {
//
//             var test = this.scene.start('Atrium');
//             console.log(test)
//             this.client.sendTest();
//
//         }, this);
//     }
// })
//
// export default Main

// The main scene, supposed to load assets, maybe also starting scene?
export default class Main extends Phaser.Scene {
    constructor() {
        // Don't know why is needed? because phaser.scene needed a key?
        super("Main");
    }

    preload () {
        // supposed to load everything here
        this.load.image('tiles', 'assets/images/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon', 'assets/map.json');

        this.load.atlas('fauna', 'assets/images/fauna.png', 'assets/fauna.json');

        this.fauna = Phaser.Physics.Arcade.Sprite

    };

    create () {
        // When the user click the screen
        this.input.on('pointerup', function (pointer) {

            // Start the scene
            var test = this.scene.start('Atrium');
            // console.log(test)

            // Send test to server
            screen.client.sendTest();

        }, this);
    }
}
