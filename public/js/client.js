export default class Client {
    constructor() {
        this.ready = false
        this.socket = io.connect()
        this.socket.on('allplayers', (data) => {
            console.log('allplayer', data)
            for(var i = 0; i < data.length; i++){
                this.scene.addNewPlayer(data[i].id,data[i].x,data[i].y);
            }
            this.ready = true
        })
        this.socket.on('otherlocation', (data) => {
            if (!this.ready) return
            // console.log("otherlocation", data)
            // console.log(data[0].id)
            let filterResult = data.filter(playerData => playerData.id != this.scene.fauna.id)
            // console.log('filtered', filterResult)
            filterResult.forEach(player => this.scene.movePlayer(player.id, player.x, player.y))

        })
        this.socket.on('newplayer', (data) => {
            this.scene.addNewPlayer(data.id, data.x, data.y)
        })
        this.socket.on('yourid', (id) => {
            console.log('yourid')
            this.scene.fauna.id = id
            console.log(this.scene.fauna.id)
        })
        this.socket.on('remove', playerID => {
            this.scene.removePlayer(playerID)
            console.log('remove', playerID)
        })
    };

    sendTest () {
        console.log("test sent")
        this.socket.emit('test')
    };

    sendLocation(x, y) {
        this.socket.emit('update', {x: x, y: y})
    }

    askNewPlayer () {
        this.socket.emit('newplayer')
    }

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
