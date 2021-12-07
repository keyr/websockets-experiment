const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};
let num = 0;

const getUniqueID = () => {
   num += 1;
   return num;
}

const sendMessage = (json) => {
    Object.keys(clients).map(client => {
        clients[client].sendUTF(json);
    })
}

wsServer.on('request', (request) => {
    const userID = getUniqueID();
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    connection.on('message', (message) => {
        const data = JSON.parse(message.utf8Data);
        const json = {};
        json.data = {content: data.content, user: data.user};
        console.log(json);
        sendMessage(JSON.stringify(json));
    })
})
