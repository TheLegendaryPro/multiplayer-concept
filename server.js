let express = require('express');
let app = express();
let fs = require('fs');
console.log(app)

app.key = fs.readFileSync('key.pem');
app.cert = fs.readFileSync('cert.pem')

var server = require('http').Server(app);
console.log(server)
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
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

server.listen(process.env.PORT || 80, () => {
    console.log('Listening on ' +server.address().port);
})

app.lastPlayerID = 0


io.on('connection', function (socket) {
    socket.on('newplayer', function () {
        socket.player = {
            id : app.lastPlayerID++,
            x: 100,
            y: 100
        }
        socket.emit('allplayers', getAllPlayers(socket.player))
        socket.emit('yourid', socket.player.id)
        socket.broadcast.emit('newplayer', socket.player)

        socket.on('update', function (data) {
            // console.log('update', data.x, data.y)
            socket.player.x = data.x
            socket.player.y = data.y
            // todo not loop throught sockets, but maybe make another object with only id, x and y, like player map
            // io.emit('move', socket.player)
        })

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });

    socket.on('test', function () {
        console.log('test recieved')
    })

    socket.on('up', () => {
        console.log('up')
    })

    setInterval(function(){

        var players = []

        Object.keys(io.sockets.connected).forEach(function (socketID) {
            var player = io.sockets.connected[socketID].player
            if (player != undefined) players.push(player);
            // if (player != selfPlayer)
        })

        socket.emit('otherlocation', players);
        // console.log('otherlocation', players)
    }, 80); //todo

})



function getAllPlayers(selfPlayer) {
    var players = []

    Object.keys(io.sockets.connected).forEach(function (socketID) {
        var player = io.sockets.connected[socketID].player
        if (player != selfPlayer && player != undefined) players.push(player);
    })
    console.log("get all players", players)
    return players
}