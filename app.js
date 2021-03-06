const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { joinUser, removeUser } = require('./users');
let path = require('path');


var indexRouter = require('./routes/index');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', indexRouter);

let thisRoom="";
io.sockets.on('connection', function(socket) {
    socket.on('join room', (data) => {
        let newUser = joinUser(socket.id, data.username, data.roomName)
        socket.emit('send data', {id: socket.id, username: newUser.username, roomName: newUser.roomname});
        thisRoom = newUser.roomname;
        socket.join(newUser.roomname);
    });

    socket.on('leave room', () => {
       const user = removeUser(socket.id);
       socket.leave(user.roomname);
    });

    socket.on('chat_message', function(message) {
        io.to(thisRoom).emit("chat_message", {data: message, id : socket.id});
    });

});

const server = http.listen(8080, function() {
    console.log('listening on *:8080');
});

module.exports = app;