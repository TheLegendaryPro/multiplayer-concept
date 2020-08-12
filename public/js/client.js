import Codec from "./codec.js"
// let Codec = require('./public/js/codec.js').Codec

export default class Client {
    // The class for client
    constructor() {
        // Set it to not ready, so that it won't process other's data yet
        // Which could cause error
        this.ready = false
        // Connect to socket.io
        this.socket = io.connect()

        this.tempTime = Date.now()
        this.delay = 300


        // ALL event handlers, I have no idea where to put them
        this.socket.on('a', (data) => {
            // Add players from the allplayer call from server
            for(var i = 0; i < data.length; i++){
                this.scene.addNewPlayer(data[i].playerID,data[i].x,data[i].y, data[i].skin);
            }
            // Now that things are loaded, we are ready
            this.ready = true

        })
        this.socket.on('o', (buffer) => {
            // The constant update of location
            // Don't process until ready
            if (!this.ready) return

            var tempDelay = Date.now() - this.tempTime
            if (tempDelay < 1000) {
                if (tempDelay < this.delay) {
                    this.delay--
                } else {
                    this.delay++
                }
            }
            // this.delay = (tempDelay < 1000) ? tempDelay : 300
            this.tempTime = Date.now()

            // console.log("otherlocation", data)
            // console.log(data[0].id)
            // console.log(buffer)
            var data = Codec.decodePlayerChunk(buffer)
            // console.log(data)

            // Filter away self
            // console.log(this.scene.fauna.id)
            let filterResult = data.filter(playerData => playerData.playerID != this.scene.fauna.id)
            // console.log('filtered', filterResult)

            // Call the move function them move them
            filterResult.forEach(player => this.scene.movePlayer(player.playerID, player.x, player.y))
            // console.log("processed")
        })

        // The function to add a new player
        this.socket.on('j', (data) => {
            console.log('player join', data)
            this.scene.addNewPlayer(data.playerID, data.x, data.y, data.skin)
        })

        // The function to know what is my id from the server
        // Stupid way, but works
        this.socket.on('i', (id) => {
            this.scene.fauna.id = id
            console.log("Our ID is: " + this.scene.fauna.id)
        })

        // Remove players
        this.socket.on('r', playerID => {
            console.log(playerID)
            this.scene.removePlayer(playerID)
            console.log('remove', playerID)
        })
    };

    // A function to send test, then the server will recieve and log it
    sendTest () {
        console.log("We (client) sent a test to the server")
        this.socket.emit('test', 'content', function (answer) {
            console.log(answer)
        })
    };

    // The fuction that is called constantly
    sendLocation(x, y) {
        // Do not send location until the scene is loaded
        if (!this.ready) return
        // What is contained inside the package
        var update = {
            // playerID: this.scene.fauna.id,
            x: x,
            y: y
        }

        // Encode the message using the updateSchema
        var buffer = Codec.encode(update, Codec.updateSchema)

        // UpdateLocation
        // Send the update package with the buffer
        this.socket.emit('u', buffer)
    }

    // Ask for the new players
    askNewPlayer (skin) {
        this.socket.emit('n', skin)
    }

    // Needed to access the scene, couldn't think of a better way
    setGameScene(game) {
        this.scene = game.scene.getScene('Atrium')
    }

    changeMap (newMap, oldMap) {
        // Make the state for client to be not ready, so it won't process other players
        this.ready = false
        // Emit c for change map to server with new map and old map, and a callback
        this.socket.emit('c', newMap, oldMap, (ark) => {
            // If the server responded, make ourself ready again
            this.ready = true
            // Remove all players from the scene
            this.scene.removeAllPlayers()
            // emit another message to the server with the new map, and the coords of the player
            this.socket.emit('cg', ark, Math.floor(this.scene.fauna.x), Math.floor(this.scene.fauna.y))
        })
    }
}

// clientVar.socket.on('allplayers',function(data) {
//     console.log('allplayers')
//     // for (var i = 0; i < data.length; i++) {
//     //     Game.addNewPlayer(data[i].id, data[i].x, data[i].y);
//     // }
//     //
//     // Client.socket.on('move', function (data) {
//     //     Game.movePlayer(data.id, data.x, data.y);
//     // });
//     //
//     // Client.socket.on('remove', function (id) {
//     //     Game.removePlayer(id);
//     // });
// })



// var Client = {};
// Client.socket = io.connect();
//
// Client.sendTest = function(){
//     console.log("test sent");
//     Client.socket.emit('test');
// };
//
// Client.askNewPlayer = function(){
//     Client.socket.emit('newplayer');
// };
//
// Client.sendUpdate = function(x,y){
//     Client.socket.emit('update',{x:x,y:y});
// };
//
// Client.socket.on('newplayer',function(data){
//     Game.addNewPlayer(data.id,data.x,data.y);
// });
//
// Client.socket.on('allplayers',function(data){
//     for(var i = 0; i < data.length; i++){
//         Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
//     }
//
//     Client.socket.on('move',function(data){
//         Game.movePlayer(data.id,data.x,data.y);
//     });
//
//     Client.socket.on('remove',function(id){
//         Game.removePlayer(id);
//     });
// });
