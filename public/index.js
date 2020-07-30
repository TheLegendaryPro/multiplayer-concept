import main from "./js/main.js"
import atrium from "./js/atrium.js"
import Client from "./js/client.js"
// import SuperScene from "./js/superscene.js";

// The config to run game on
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    title: "ust.io",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    scene: [main, atrium]
}

 // todo A scene or scenes to add to the game. If several are given, the first is started; the remainder are started only if they have { active: true }. See the sceneConfig argument in Phaser.Scenes.SceneManager#add.

// Call the game
let game = new Phaser.Game(config)
// Set the socket.io client and bound it to screen
screen.client = new Client()
// console.log(game.scene.scenes)
// console.log(game.scene.getAt(0))

