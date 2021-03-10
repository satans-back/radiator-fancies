/*   ROOM IDs
    'room-iron',
    'room-aluminium',
    'room-floor',
    'room-steel',
    'room-canal'
*/

let socket = io.connect('https://radiator-app.azurewebsites.net');
//let socket = io.connect('localhost:3000');

let username = "";
let ID = "";
let room = 'room-iron';
let new_room = '';
function chatLogin(){
    username = document.getElementById("nick").value;
    if(username.length < 5){
        let err = document.getElementById("login-error");
        err.style.display = "block";
        return;
    }

    let card = document.getElementById("login-card");
    let bg = document.getElementById("login-bg");

    socket.emit("join room", {username: username, roomName : room});
    card.style.display = "none";
    bg.style.display = "none";
}

function changeRoom(ROOM_ID) {
    document.getElementById(room).classList.remove('mdc-list-item--activated');
    socket.emit('leave', {room: room, new_room: ROOM_ID});
    room = ROOM_ID;
    document.getElementById(room).classList.add('mdc-list-item--activated');
    document.getElementById("messages").innerHTML = "";
}

$('#chatForm').submit(function(e){
    e.preventDefault(); // prevents page reloading
    console.log("SEND MESSAGE CLICKED");
    socket.emit('chat_message', {
        value: document.getElementById("txt").value,
        user: username
    });
    $('#txt').val('');
    return false;
});

socket.on('chat_message', (data) => {
    displayMessage(data);
});

socket.on('send data', (message) => {
    ID = message.id;
});

function displayMessage(data) {
    let divClass = "";
    if(data.id === ID) {
        divClass = "chat-message-sent sent-ribbon";
    }
    else {
        divClass = "chat-message-received received-ribbon"
    }

    const messages_li = document.createElement("li");

    const msg_div = document.createElement("div");
    msg_div.className = divClass;

    const author_p = document.createElement("p");
    author_p.className = "chat-message-author";

    const message_p = document.createElement("p");
    message_p.className = "chat-message-content";

    author_p.innerHTML= data.data.user;
    message_p.innerHTML = data.data.value;

    msg_div.appendChild(author_p);
    msg_div.appendChild(message_p);
    messages_li.appendChild(msg_div);

    $('#messages').append(messages_li);
    $("#messages").stop().animate({ scrollTop: $("#messages")[0].scrollHeight}, 1000);

}