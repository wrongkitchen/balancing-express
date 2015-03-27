var express = require('express'),
	app = express(),
	config = require('./config/config');
var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./config/express')(app, config);

io.on('connection', function (socket) {
	console.log('Server IO connected');
	socket.on('sensor-buttonPress', function(){
		console.log('app.js: button pressed');
		io.sockets.emit('buttonPress');
  	});
	socket.on('sensor-position', function(pPos){
		io.sockets.emit('position', pPos);
  	});
	// var interval = setInterval(function(){
	// 	getPosition(function(pPos){
	// 		socket.emit('position', pPos);
	// 	});
	// }, 100);
	// button.watch(function(err, value) {
	// 	if(value == 1)
	// 		socket.emit('buttonPress');
	// });
});

console.log('Listening port: ' + config.port);
server.listen(config.port);
