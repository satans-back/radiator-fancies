let users = [];

function joinUser(socketId, userName, roomName) {
    const user = {
        socketID: socketId,
        username: userName,
        roomname: roomName
    }
    users.push(user);
    return user;
}

function removeUser(id) {
    const getID = users => users.socketID === id;
    const index = users.findIndex(getID);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

function updateRoom(id, roomName) {
    const getID = users => users.socketID === id;
    const index = users.findIndex(getID);
    if(index != -1) {
        return users[index].roomname = roomName;
    }
    return -1;
}

function getCurrentRoom(id) {
    const getID = users => users.socketID === id;
    const index = users.findIndex(getID);
    if(index != -1) {
        return users[index].roomname;
    }
    return -1;
}

module.exports = {
    joinUser,
    removeUser,
    updateRoom,
    getCurrentRoom
};