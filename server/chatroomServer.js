var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8001, function() {
    console.log((new Date()) + ' Server is listening on port 8001');
});

let wsServer = new WebSocketServer({
    httpServer: server,
    // You should not use autoAcceptConnections for production
    // applications, as it defeats all standard cross-origin protection
    // facilities built into the protocol and the browser.  You should
    // *always* verify the connection's origin and decide whether or not
    // to accept it.
    autoAcceptConnections: true
});


wsServer.on('connection', function connection(ws) {
    let message = []
    let index = 0
    wsServer.on('message', function incoming(msg) {
        console.log('received: %s', msg);
        message.push(msg)
        index++
    });

    wsServer.send(message[index]);
});