var express = require('express'),
	app = express(),
	config = require('./config/config');
var server = require('http').Server(app);
var io = require('socket.io')(server);

require('./config/express')(app, config);
require('./config/io')(io);

server.listen(config.port);


