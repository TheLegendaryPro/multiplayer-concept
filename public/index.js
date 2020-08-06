import main from "./js/main.js"
import atrium from "./js/atrium.js"
import Client from "./js/client.js"
import gameui from "./js/gameui.js"

screen.gameWidth = Math.floor(window.innerWidth * 0.6)
screen.gameHeight = Math.floor(window.innerHeight * 0.6)

// The config to run game on
var config = {
    type: Phaser.AUTO,
    width: screen.gameWidth,
    height: screen.gameHeight,
    title: "ust.io",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    zoom: 1.5,
    parent: "game",
    scene: [main, atrium, gameui]
}


// Call the game
screen.game = new Phaser.Game(config)
// Set the socket.io client and bound it to screen
screen.client = new Client()


