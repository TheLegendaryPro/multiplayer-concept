import main from "./js/main.js"
import atrium from "./js/atrium.js"

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    title: "ust.io",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [main, atrium]
}

 // todo A scene or scenes to add to the game. If several are given, the first is started; the remainder are started only if they have { active: true }. See the sceneConfig argument in Phaser.Scenes.SceneManager#add.

let game = new Phaser.Game(config)


