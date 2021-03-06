/*   ROOM IDs
    'room-iron',
    'room-aluminium',
    'room-floor',
    'room-steel',
    'room-canal'
*/

let socket = io.connect('http://localhost:8080');

let username = "";
let ID = "";
let room = 'room-iron';

function chatLogin() {
    username = document.getElementById("nick").value;
    let card = document.getElementById("login-card");
    let bg = document.getElementById("login-bg");

    socket.emit("join room", {username: username, roomName : room});
    card.style.display = "none";
    bg.style.display = "none";
}

function changeRoom(ROOM_ID) {
    document.getElementById(room).classList.remove('mdc-list-item--activated');
    room = ROOM_ID;
    document.getElementById(room).classList.add('mdc-list-item--activated');
}

$('form').submit(function(e){
    e.preventDefault(); // prevents page reloading
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

socket.on('leave room', (data) => {
   console.log("USER LEFT CZAT");
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
}