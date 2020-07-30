import Client from "./client.js"

// var SuperScene = new Phaser.Class({
//     Extends: Phaser.Scene,
//
//     initialize:
//     function start() {
//         this.client = new Client()
//         console.log(this.client)
//     }
// })
//
// export default SuperScene

export default class SuperScene extends Phaser.Scene {
    constructor() {
        super({
            key: "SuperScene"
        });
        this.client = new Client()
    }

}