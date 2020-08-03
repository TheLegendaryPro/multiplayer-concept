import main from "./js/main.js"
import atrium from "./js/atrium.js"
import Client from "./js/client.js"

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


// Call the game
screen.game = new Phaser.Game(config)
// Set the socket.io client and bound it to screen
screen.client = new Client()


