var express = require('express');
var app = express();

app.use(express.static(__dirname + '/'));

var server = app.listen(3000, function () {
    console.log("Server running on port 3000..");
});

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

    acceptUser(socket, user);

    // listen message event
    socket.on('message', function (data) {

        date = new Date(data.date);
        data.date = pad(date.getHours()) + ':' + pad(date.getMinutes());

        io.emit('message', data);
    });

    // listen disconnect event
    socket.on('disconnect', function () {
        
        console.log(user.username + ' disconnected.');
        sendSysteemMessage(socket, user.username + ' disconnected.');

        //updateStatus(user, 'offline');

        // remove user from users array
        users.splice(users.indexOf(user), 1);

        console.log(users);
        io.emit('users', users);
    });

});


function acceptUser(socket, user) {

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
        io.to(socket.id).emit('user_validation', {
            success: true
        });

        // send systeem message to clients
        sendSysteemMessage(socket, user.username + ' joined chat.');

        // send users to all clients
        io.emit('users', users);        
        console.log(user.username + ' joined chat..');
        console.log("users: ", users);

    } else {
        io.to(socket.id).emit('user_validation', {
            success: false
        });

        socket.disconnect();
    }
}

function sendSysteemMessage(socket, message) {
    
    var date = new Date();
    var systemMessage = {
        username: 'system',
        message: message,
        type: 'info',
        date: pad(date.getHours()) + ':' + pad(date.getMinutes())
    };
    socket.broadcast.emit('message', systemMessage);
}

function updateStatus(user, status) {
    for (var i = 0; i < users.length; i++) {
        if (users[i]['username'] == user.username) {
            users[i]['status'] = status;
        }
    }
}

function pad(value) {
    return value.toString().length > 1 ? value : '0' + value;
}