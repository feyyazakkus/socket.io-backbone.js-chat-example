var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

var server = app.listen(3000, function () {
    console.log("Server running on port 3000..");
})

var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
});

var users = [];

io.on('connection', function (socket) {

    var user = {
        username: socket.handshake.query['username'],
        status: 'online'
    };

    addUser(user);
    console.log(user.username + ' joined chat..');

    socket.on('message', function (data) {

        var date = new Date(data.date);
        var time = pad(date.getHours()) + ':' + pad(date.getMinutes());
        data.date = time;
        io.emit('message', data);
    });

    socket.on('disconnect', function () {
        console.log(user.username + ' disconnected.' );

        updateStatus(user, 'offline');
        io.emit('users', users);
    });

    // send users to all clients
    io.emit('users', users);
});


function pad(value) {
    return value.toString().length > 1 ? value : '0' + value;
}

function updateStatus(user, status) {
    for (var i = 0; i < users.length; i++) {
        if (users[i]['username'] == user.username) {
            users[i]['status'] = status;
        }
    }
}

function addUser(user) {
    var userFound = false;
    if (users) {
        for (var i = 0; i < users.length; i++) {
            if (users[i]['username'] == user.username) {
                users[i]['status'] = 'online';
                userFound = true;
            }
        }
    }
    if (!userFound) {
        users.push(user)
    }
}
