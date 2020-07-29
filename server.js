let express = require('express');
let app = express();

// for app.use, to send html and other files
var options = {
    dotfiles: 'ignore',
    etag: false,
    extensions: ['html'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function (res, path, stat) {
        res.set('x-timestamp', Date.now())
    }
}

// todo add some add.use
// like: app.use('/assets',express.static(__dirname + '/assets'));
app.use(express.static('public'))

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

app.listen(process.env.PORT || 8081, () => {
    console.log('Listening on ' + app.name);
})