// Use express to send files
let express = require('express');
let app = express();
// todo Failed to set up https, have to find a way
let fs = require('fs');
// console.log(app)

app.key = fs.readFileSync('key.pem');
app.cert = fs.readFileSync('cert.pem')

// For now I am using normal http server
var server = require('http').Server(app);
console.log(server)
// Socket.io for client server communications
let io = require('socket.io').listen(server);

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


// The event handler for socket.io
io.on('connection', function (socket) {
    // Whenever newplayer is recieved
    socket.on('newplayer', function () {
        // Make a new player
        socket.player = {
            id : app.lastPlayerID++,
            x: 100,
            y: 100
        }
        // Tell the person that sent this allplayers and his id
        socket.emit('allplayers', getAllPlayers(socket.player))
        socket.emit('yourid', socket.player.id)
        // Tell everyone else there is a new player
        socket.broadcast.emit('newplayer', socket.player)

        // Clients keep sending this, which is their location
        socket.on('update', function (data) {
            // Set the value for the player object
            // console.log('update', data.x, data.y)
            socket.player.x = data.x
            socket.player.y = data.y
            // todo not loop throught sockets, but maybe make another object with only id, x and y, like player map
            // io.emit('move', socket.player)
        })

        // Ask all client to delete the player when he disconnects
        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });

    // Just a test function when test is recieved
    socket.on('test', function () {
        console.log('test recieved')
    })

    // socket.on('up', () => {
    //     console.log('up')
    // })

    // Set interval is used for updating events every little time period
    setInterval(function(){

        // Initialize it to no players
        var players = []

        // A complicated function I have no idea how it works, loop through all connected sockets?
        Object.keys(io.sockets.connected).forEach(function (socketID) {
            // Set player to the socket player object
            var player = io.sockets.connected[socketID].player
            // If the player exits, add it to the list
            if (player != undefined) players.push(player);
            // if (player != selfPlayer)
        })

        // Send it to the clients
        socket.emit('otherlocation', players);
        // console.log('otherlocation', players)
    }, 80); //todo

})


// A function to find all active clients on the map
function getAllPlayers(selfPlayer) {
    // Initialize it to no players
    var players = []

    Object.keys(io.sockets.connected).forEach(function (socketID) {
        // Set player to the socket player object
        var player = io.sockets.connected[socketID].player
        // If the player exits, AND is not self, add it to the list
        if (player != selfPlayer && player != undefined) players.push(player);
    })
    // Log it and then return
    console.log("get all players", players)
    return players
}