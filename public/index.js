import main from "./js/main.js"
import atrium from "./js/atrium.js"
import Client from "./js/client.js"

// The config to run game on
var config = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.6,//800,
    height: window.innerHeight * 0.6,//600,
    title: "ust.io",
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
        }
    },
    zoom: 1.3,
    parent: "game",
    scene: [main, atrium]
}


// Call the game
screen.game = new Phaser.Game(config)
// Set the socket.io client and bound it to screen
screen.client = new Client()


