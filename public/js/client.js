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

        //todo remove it
        this.recieveCount = 0


        // ALL event handlers, I have no idea where to put them
        this.socket.on('a', (data) => {
            // Add players from the allplayer call from server
            console.log('allplayer', data)
            for(var i = 0; i < data.length; i++){
                this.scene.addNewPlayer(data[i].playerID,data[i].x,data[i].y);
            }
            // Now that things are loaded, we are ready
            this.ready = true

        })
        this.socket.on('o', (buffer) => {
            // The constant update of location
            // Don't process until ready
            // console.log("recieved", this.recieveCount++)
            if (!this.ready) return
            // if (!data) return

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
            this.scene.addNewPlayer(data.playerID, data.x, data.y)
        })

        // The function to know what is my id from the server
        // Stupid way, but works
        this.socket.on('i', (id) => {
            console.log('yourid')
            this.scene.fauna.id = id
            console.log(this.scene.fauna.id)
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
        console.log("test sent")
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
    askNewPlayer () {
        this.socket.emit('n')
    }

    // Needed to access the scene, couldn't think of a better way
    setGameScene(game) {
        this.scene = game.scene.getScene('Atrium')
    }

    changeMap (newMap, oldMap) {
        this.ready = false
        this.socket.emit('c', newMap, oldMap, (ark) => {
            this.ready = true
            console.log(this.ready)
            this.scene.removeAllPlayers()
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
