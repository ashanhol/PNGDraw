// node variables
var express = require('express'); 
var fs = require('fs'); 
var app = express(); 
var server = require('http').createServer(app); 
var io = require('socket.io').listen(server);
var port = process.env.PORT || 3000;

server.listen(port);

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
    fs.readFile('image1.JPG', function(err, buffer){
        socket.emit('image', { buffer: buffer });
    });
});

