var express = require('express'),
	app = express(),
	config = require('./config/config');
var server = require('http').Server(app);
var io = require('socket.io')(server);
var i2c = require('i2c');
// var Gpio = require('onoff').Gpio,
// 	button = new Gpio(17, 'in', 'both');
// button.watch(function(err, value) {
// 	console.log(value);
// });
var address = 0x68;
var wire = new i2c(address, {device: '/dev/i2c-1'});

var getPosition = function(pCallback){
	var x = null, y = null, z = null;
	var read_word_2c = function(adr, cCallback){
		var high = null;
		var low = null;
		var byteCal = function(){
			var tmpVal = (high << 8) + low;
			var val = null;
			if(tmpVal >= 0x8000)
				val = -((65535 - tmpVal) + 1);
			else
				val = tmpVal;
			cCallback(val / 16384.0);
		};
		wire.readBytes(adr, 8, function(err, res) {
			high = res.readUInt8(0);
			if(high && low) byteCal();
		});
		wire.readBytes(adr+1, 8, function(err, res) {
			low = res.readUInt8(0);
			if(high && low) byteCal();
		});
	};
	var cal = function(){
		var pos = {};
		var dist = function(a,b){
			return Math.sqrt((a*a)+(b*b));
		};
		var degrees = function(rad){
			return rad*(180/Math.PI);
		};
		var get_x = function(){
			return Math.atan2(y, dist(x,z));
		};
		var get_y = function(){
			return Math.atan2(x, dist(y,z)) * -1;
		};
		pos.x = degrees(get_x());
		pos.y = degrees(get_y());
		pCallback(pos);
	};
	read_word_2c(0x3b, function(pVal){
		x = pVal;
		if(x && y && z) cal();
	});
	read_word_2c(0x3d, function(pVal){
		y = pVal;
		if(x && y && z) cal();
	});
	read_word_2c(0x3f, function(pVal){
		z = pVal;
		if(x && y && z) cal();
	});
};

require('./config/express')(app, config);

io.on('connection', function (socket) {
	var interval = setInterval(function(){
		getPosition(function(pPos){
			socket.emit('position', pPos);
		});
	}, 100);
});

wire.writeBytes(0x6B, [0], function(err){
	if(!err){
		console.log('Listening port: ' + config.port);
		server.listen(config.port);
	} else {
		console.log(err);
	}
});


