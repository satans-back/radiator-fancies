const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const { joinUser, removeUser, updateRoom, getCurrentRoom } = require('./users');
let path = require('path');
var port = process.env.PORT || 3000;


var indexRouter = require('./routes/index');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', indexRouter);

let thisRoom="";

console.log("Connection to server is quite stable.")

io.sockets.on('connection', function(socket) {
    socket.on('join room', (data) => {
        let newUser = joinUser(socket.id, data.username, data.roomName)
        socket.emit('send data', {id: socket.id, username: newUser.username, roomName: newUser.roomname});
        thisRoom = newUser.roomname;
        socket.join(newUser.roomname);
        console.log("User " + data.username + " JOINED the ROOM " + thisRoom)
    });

    socket.on('leave', (data) => {
        let new_room = data.new_room;
        socket.join(data.new_room);
        console.log("User JOINED the ROOM " + data.new_room);
        socket.leave(data.room);
        updateRoom(socket.id, data.new_room);
        console.log("User LEFT the ROOM " + data.room);
    });

    socket.on('chat_message', function(message) {
        io.to(getCurrentRoom(socket.id)).emit("chat_message", {data: message, id : socket.id});
        console.log(message.user + " wrote to: " + getCurrentRoom(socket.id));
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);
        console.log(user);
        if(user) {
            console.log(user.username + ' has left');
        }
        console.log("disconnected");
    });

});

const server = http.listen(port, function() {
    console.log('listening on *:8080');
});

module.exports = app;