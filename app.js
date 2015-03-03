var express = require('express'),
	app = express(),
	config = require('./config/config');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var i2c = require('i2c');

require('./config/express')(app, config);
require('./config/accelerator')(i2c, function(pPos){
	io.on('connection', function (socket) {
		socket.emit('position', pPos);
	});
});

server.listen(config.port);


