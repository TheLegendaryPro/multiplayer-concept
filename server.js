import express from 'express'

// Use express to send files
let app = express();
// todo Failed to set up https, have to find a way
import fs from 'fs'

app.key = fs.readFileSync('key.pem');
app.cert = fs.readFileSync('cert.pem')

// For now I am using normal http server
// var server = require('http').Server(app);
import http from 'http'
var server = http.Server(app);
// console.log(server)
// Socket.io for client server communications
// let io = require('socket.io').listen(server);
import socket from 'socket.io'
let io = socket.listen(server)



import Codec from "./public/js/codec.js";

// for app.use, to send html and other files
// var options = {
//     dotfiles: 'ignore',
//     etag: false,
//     maxAge: '1d',
//     redirect: false,
//     extensions: ['html'],
//     index: false,
//     setHeaders: function (res, path, stat) {
//         res.set('x-timestamp', Date.now())
//     }
// }
// like: app.use('/assets',express.static(__dirname + '/assets'));

// So that they can access public files
app.use(express.static('public'))


// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

// Listen to a port
server.listen(process.env.PORT || 80, () => {
    console.log('Listening on ' +server.address().port);
})


// A stupid ID system that adds one everytiime someone connects
app.lastPlayerID = 0
// A object to store locations of players
app.lastPlayerLocation = {
    // Contains id: {x:x, y:y}
}



// The event handler for socket.io
io.on('connection', function (socket) {
    // Whenever newplayer is recieved
    socket.on('n', async function () {
        // Make a new player
        socket.player = {
            playerID : app.lastPlayerID++,
            x: 300,
            y: 350
        }
        // Add the location of this player to lastPlayerLocation
        app.lastPlayerLocation[socket.player.playerID] = {}
        app.lastPlayerLocation[socket.player.playerID].x = socket.player.x
        app.lastPlayerLocation[socket.player.playerID].y = socket.player.y
        // Tell the person that sent this allplayers and his id

        socket.emit('i', socket.player.playerID)
        // Tell everyone else there is a new player
        socket.to('atriumSample1').emit('j', socket.player)
        // Join the main room
        for (var key in socket.rooms) {
            var value = socket.rooms[key]
            console.log('socketid?', value)
            socket.leave(value)
        }
        await socket.join('atriumSample1')
        socket.emit('a', getAllPlayers(socket))

        // UpdateLocation
        // Clients keep sending this, which is their location
        socket.on('u', function (data) {
            // console.log('duing update', socket.rooms)
            // Set the value for the player object
            // console.log('update', data.x, data.y)
            // Turn it from node buffer to js array buffer
            var arrayBufferData = Codec.toArrayBuffer(data)
            // Decode the buffer
            var content = Codec.decode(arrayBufferData, Codec.updateSchema)
            // Now that it is decoded, we can get the x and y
            socket.player.x = content.x
            socket.player.y = content.y
            // todo not loop throught sockets, but maybe make another object with only id, x and y, like player map
            // io.emit('move', socket.player)
        })

        // Ask all client to delete the player when he disconnects
        socket.on('disconnect',function(){

            io.emit('r',socket.player.playerID);
        });

        socket.on('c', (newMap, oldMap, ark) => {

            var roomArray = []
            for (var key in socket.rooms) {
                var value = socket.rooms[key]
                roomArray.push(value)
            }
            socket.join(newMap)
            roomArray.forEach(value => {
                socket.leave(value)
            })

            socket.to(oldMap).emit('r', socket.player.playerID)
            ark(newMap)

        })

        socket.on('cg', (newMap, x, y) => {
            socket.player.x = x
            socket.player.y = y
            socket.to(newMap).emit('j', socket.player)
            socket.emit('a', getAllPlayers(socket))
        })
    });

    // Just a test function when test is recieved
    socket.on('test', function (content, ark) {
        console.log('test recieved')
        ark('yes')
    })


    // socket.on('up', () => {
    //     console.log('up')
    // })

    // Set interval is used for updating events every little time period
    setInterval(function(){

        roomAreas.forEach (areaArray => {

            // Initialize it to no players
            var players = []

            areaArray.forEach (room => {
                Object.keys(io.sockets.connected).forEach(socketID => {
                    var roomName
                    Object.values(io.sockets.connected[socketID].rooms).forEach( tempRoomName => {
                        roomName = tempRoomName
                    })
                    if (room == roomName) {
                        var player = io.sockets.connected[socketID].player
                        if (player != undefined && (app.lastPlayerLocation[player.playerID].x != player.x || app.lastPlayerLocation[player.playerID].y != player.y)) {
                            app.lastPlayerLocation[player.playerID].x = player.x
                            app.lastPlayerLocation[player.playerID].y = player.y
                            players.push(player)
                        }
                    }
                })
            })
            if (players.length) {
                // socket.volatile.emit('otherlocation', players);
                // console.log(players)
                var buffer = Codec.encodePlayerChunk(players)
                // console.log(buffer)

                var text = "io"
                areaArray.forEach( name => {
                    text = text + ".to('"
                    text = text + name
                    text = text + "')"
                })
                text = text + ".volatile.emit('o', buffer)"
                // console.log('about to eval the following', text)
                eval(text)

                // io.to('main').volatile.emit('o', buffer);
                // console.log("otherlocation")
            }
        })



        // // A complicated function I have no idea how it works, loop through all connected sockets?
        // Object.keys(io.sockets.connected).forEach(function (socketID) {
        //     // Set player to the socket player object
        //     var player = io.sockets.connected[socketID].player
        //     // If the player exits, add it to the list
        //     // console.log('test')
        //
        //     // console.log(app.lastPlayerLocation)
        //     // console.log(player)
        //     if (player != undefined && (app.lastPlayerLocation[player.playerID].x != player.x || app.lastPlayerLocation[player.playerID].y != player.y)) {
        //         // console.log('results')
        //         app.lastPlayerLocation[player.playerID].x = player.x
        //         app.lastPlayerLocation[player.playerID].y = player.y
        //         players.push(player)
        //     }
        //     // if (player != selfPlayer)
        // })
        //
        // // Send it to the clients only when it is necessory
        // // todo make this always send, since when real launch every sec will have players
        // if (players.length) {
        //     // socket.volatile.emit('otherlocation', players);
        //     // console.log(players)
        //     var buffer = Codec.encodePlayerChunk(players)
        //     // console.log(buffer)
        //     io.to('main').volatile.emit('o', buffer);
        //     // console.log("otherlocation")
        // }
        // console.log('otherlocation', players)
    }, 300); //todo

})


// A function to find all active clients on the map
function getAllPlayers(socket) {

    // Initialize it to no players
    var players = []
    var value

    Object.keys(io.sockets.adapter.rooms).forEach(function (roomName) {
        console.log('looping throught this room', roomName)

        Object.keys(socket.rooms).forEach( key => {
            console.log('looping through room of that player socket')
            value = socket.rooms[key]
        })
        console.log('value', value)
        if (roomName == value) {
            console.log('the correct room is', value, io.sockets.adapter.rooms[roomName])
            // Object.keys(io.sockets.adapter.rooms[roomName].sockets).forEach(key => {
            //     console.log('ppl', key)
            // })
        }
        // console.log('iosocketsconnected', io.sockets.connected[value])
    })

    console.log('now what we know it is', value)

    Object.keys(io.sockets.connected).forEach(function (socketID) {
        // Set player to the socket player object
        var roomName
        Object.values(io.sockets.connected[socketID].rooms).forEach( tempRoomName => {
            roomName = tempRoomName
        })
        if (value == roomName) {
            var player = io.sockets.connected[socketID].player
            // If the player exits, AND is not self, add it to the list
            if (player != socket.player && player != undefined) players.push(player);
        }
    })
    // Log it and then return
    console.log("get all players", players)
    return players
}


// var roomAreas = [
//     ["atriumSample1"],
//     ["dungeon"]
// ]


var roomAreas = [
    ["atriumSample1", "dungeon"]
]


var codes = {
    "u": "update <",
    "o": "other players >",
    "c": "change map <",
    "n": "new player <",
    "a": "all player >",
    "i": "your id >",
    "j": "player join >",
    "r": "remove player >",
    "cg": "changed room, get new players <"
}
