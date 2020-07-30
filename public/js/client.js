export default class Client {
    // The class for client
    constructor() {
        // Set it to not ready, so that it won't process other's data yet
        // Which could cause error
        this.ready = false
        // Connect to socket.io
        this.socket = io.connect()


        // ALL event handlers, I have no idea where to put them
        this.socket.on('allplayers', (data) => {
            // Add players from the allplayer call from server
            console.log('allplayer', data)
            for(var i = 0; i < data.length; i++){
                this.scene.addNewPlayer(data[i].id,data[i].x,data[i].y);
            }
            // Now that things are loaded, we are ready
            this.ready = true

        })
        this.socket.on('otherlocation', (data) => {
            // The constant update of location
            // Don't process until ready
            if (!this.ready) return
            // console.log("otherlocation", data)
            // console.log(data[0].id)

            // Filter away self
            let filterResult = data.filter(playerData => playerData.id != this.scene.fauna.id)
            // console.log('filtered', filterResult)

            // Call the move function them move them
            filterResult.forEach(player => this.scene.movePlayer(player.id, player.x, player.y))
        })

        // The function to add a new player
        this.socket.on('newplayer', (data) => {
            this.scene.addNewPlayer(data.id, data.x, data.y)
        })

        // The function to know what is my id from the server
        // Stupid way, but works
        this.socket.on('yourid', (id) => {
            console.log('yourid')
            this.scene.fauna.id = id
            console.log(this.scene.fauna.id)
        })

        // Remove players
        this.socket.on('remove', playerID => {
            this.scene.removePlayer(playerID)
            console.log('remove', playerID)
        })
    };

    // A function to send test, then the server will recieve and log it
    sendTest () {
        console.log("test sent")
        this.socket.emit('test')
    };

    // The fuction that is called constantly
    sendLocation(x, y) {
        this.socket.emit('update', {x: x, y: y})
    }

    // Ask for the new players
    askNewPlayer () {
        this.socket.emit('newplayer')
    }

    // Needed to access the scene, couldn't think of a better way
    setGameScene(game) {
        this.scene = game.scene.getScene('Atrium')
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
