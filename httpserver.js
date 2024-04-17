// Import the module to read file and to open http and https server
import http from 'http'
// Use express to send files, start an app
import express from 'express'
let app = express();
// Send clients all files within public
app.use(express.static('public'))
// Start http server
var httpServer = http.Server(app)

// Import socket but not use it yet, then create a new socket
import socket from 'socket.io'
var io = new socket

// Http and https both listen to different port
httpServer.listen(process.env.PORT || 10003, () => {
    console.log('Listening on ' +httpServer.address().port);
})
io.attach(httpServer)

// Use winston for logging
import winston from 'winston'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        //
        // - Write all logs with level `error` and below to `error.log`
        // - Write all logs with level `info` and below to `combined.log`
        //
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

// Use codec for encoding buffers for clients
import Codec from "./public/js/codec.js";

// A object to store locations of players
app.lastPlayerLocation = {
    // Contains id: {x:x, y:y}
}
// To calculate how many clients are connect to the server
app.connectCounter = 0

// The event handler for socket.io
io.on('connection', function (socket) {
    // Whenever newplayer is recieved
    socket.on('n', async function (skin) {
        // Assign a id for that player, by looping through all ids and find a unused one
        var usedIDs = []
        Object.keys(io.sockets.connected).forEach( socketID => {
            var player = io.sockets.connected[socketID].player
            if (player == undefined) return
            usedIDs.push(player.playerID)
        })
        var unusedID = 0
        while (usedIDs.includes(unusedID)) unusedID++
        // Make a new player
        socket.player = {
            skin: skin,
            playerID : unusedID,
            x: 220,
            y: 710
        }
        // Add the location of this player to lastPlayerLocation
        app.lastPlayerLocation[socket.player.playerID] = {}
        app.lastPlayerLocation[socket.player.playerID].x = socket.player.x
        app.lastPlayerLocation[socket.player.playerID].y = socket.player.y
        // Tell the person that sent this allplayers and his id
        socket.emit('i', socket.player.playerID)
        // Tell everyone else there is a new player
        socket.to('frogRoad').emit('j', socket.player)
        // Leave all other rooms, then join the room for frog road
        for (var key in socket.rooms) {
            var value = socket.rooms[key]
            socket.leave(value)
        }
        await socket.join('frogRoad')
        socket.emit('a', getAllPlayers(socket))

        // UpdateLocation
        // Clients keep sending this, which is their location
        socket.on('u', function (data) {
            // Turn it from node buffer to js array buffer
            var arrayBufferData = Codec.toArrayBuffer(data)
            // Decode the buffer
            var content = Codec.decode(arrayBufferData, Codec.updateSchema)
            // Now that it is decoded, we can get the x and y
            socket.player.x = content.x
            socket.player.y = content.y
            // todo not loop throught sockets, but maybe make another object with only id, x and y, like player map
        })

        // Ask all client to delete the player when he disconnects
        socket.on('disconnect',function(){
            app.connectCounter--
            var currentdate = new Date()
            var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
            logger.log('info', datetime + ' - Disconnection, IP: ' + socket.handshake.address + ' Duration: ' + msToTime((currentdate - new Date(socket.handshake.time))) + ' Player count: ' + app.connectCounter)
            // Tell other players that this player left
            io.emit('r',socket.player.playerID);
        });

        // Change map
        socket.on('c', (newMap, oldMap, ark) => {
            // Make a empty array for rooms the user is in
            var roomArray = []
            for (var key in socket.rooms) {
                // Add the room to the array
                var value = socket.rooms[key]
                roomArray.push(value)
            }
            // Join the new room
            socket.join(newMap)
            // Leave all the old rooms, so the user should be only in the new room
            roomArray.forEach(value => {
                socket.leave(value)
            })
            // Broadcast to all users from the old map to remove this player
            socket.to(oldMap).emit('r', socket.player.playerID)
            // Send a acknowledgement back to the user
            ark(newMap)

        })

        // Changed rooms, get new playerz
        socket.on('cg', (newMap, x, y) => {
            // Set the coords of the player
            socket.player.x = x
            socket.player.y = y
            // Broadcast to people in the new map that the player joined
            socket.to(newMap).emit('j', socket.player)
            // Send a respond to the user about other users' locations
            socket.emit('a', getAllPlayers(socket))
        })
    });

    // Just a test function when test is recieved
    socket.on('test', function (content, ark) {
        var currentdate = new Date()
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth()+1)  + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        // console.log(datetime + ' - New connection, IP: ' + socket.handshake.address + ', Type: ' + socket.handshake.headers["user-agent"])
        logger.log('info', datetime + ' - New connection, IP: ' + socket.handshake.address + ', Type: ' + socket.handshake.headers["user-agent"])
        ark('The test was well received')
        app.connectCounter++
    })


    // Set interval is used for updating events every little time period
    setInterval(function(){

        // For each room area
        roomAreas.forEach (areaArray => {

            // Initialize it to no players
            var players = []

            // For each room inside the room area
            areaArray.forEach (room => {
                // For each connected sockets
                Object.keys(io.sockets.connected).forEach(socketID => {
                    // Set its name inside room name
                    var roomName
                    // Loop through the socket's connecte rooms, because only have one, so set it
                    Object.values(io.sockets.connected[socketID].rooms).forEach( tempRoomName => {
                        roomName = tempRoomName
                    })
                    // If the room name is equal to the room processing
                    if (room == roomName) {
                        // Extract the player data
                        var player = io.sockets.connected[socketID].player
                        // If the player moved, add him to the array
                        if (player != undefined && (app.lastPlayerLocation[player.playerID].x != player.x || app.lastPlayerLocation[player.playerID].y != player.y)) {
                            app.lastPlayerLocation[player.playerID].x = player.x
                            app.lastPlayerLocation[player.playerID].y = player.y
                            players.push(player)
                        }
                    }
                })
            })
            // If there are players that moved, prepare to send the data
            if (players.length) {
                // Create the buffer from encoding it
                var buffer = Codec.encodePlayerChunk(players)

                // Because we don't know which room it will be sending to, we have to use a eval function
                var text = "io"
                areaArray.forEach( name => {
                    text = text + ".to('"
                    text = text + name
                    text = text + "')"
                })
                text = text + ".volatile.emit('o', buffer)"
                // console.log('about to eval the following', text)
                eval(text)
            }
        })

    }, 300); //todo

})


// A function to find all active clients on the map
function getAllPlayers(socket) {

    // Initialize it to no players
    var players = []
    var value

    Object.keys(socket.rooms).forEach( key => {
        value = socket.rooms[key]
    })

    // Find all sockets to see what players are inside that room
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
    // return
    return players
}


function msToTime(duration) {
    var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    return hours + ":" + minutes + ":" + seconds;
}



var roomAreas = [
    ["LG5", "frogRoad", "atrium", "AC1", "fireChick"],
    ["CYT1", "SG", "AC2", "busiSchool"]
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
