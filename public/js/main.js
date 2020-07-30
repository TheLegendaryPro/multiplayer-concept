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

export default class Main extends Phaser.Scene {
    constructor() {
        super("Main");
    }

    preload () {
        this.load.image('tiles', 'assets/images/dungeon_tiles.png');
        this.load.tilemapTiledJSON('dungeon', 'assets/map.json');

        this.load.atlas('fauna', 'assets/images/fauna.png', 'assets/fauna.json');

        this.fauna = Phaser.Physics.Arcade.Sprite

    };

    create () {
        this.input.on('pointerup', function (pointer) {

            var test = this.scene.start('Atrium');
            // console.log(test)
            screen.client.sendTest();

        }, this);
    }
}
