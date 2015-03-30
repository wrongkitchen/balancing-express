var config = require('./config/config');
var io = require('socket.io-client');
var socket = io.connect('http://localhost:' + config.port, { reconnect: true });
var Gpio = require('onoff').Gpio,
	button = new Gpio(18, 'in', 'both');
	button.watch(function(err, value) {
		if(value == 1)
			socket.emit('sensor-buttonPress');
	});

// var i2c = require('i2c');
// var address = 0x68;
// var wire = new i2c(address, { device: '/dev/i2c-1' });

// var getPosition = function(pCallback){
// 	var x = null, y = null, z = null;
// 	var read_word_2c = function(adr, cCallback){
// 		var high = null;
// 		var low = null;
// 		var byteCal = function(){
// 			var tmpVal = (high << 8) + low;
// 			var val = null;
// 			if(tmpVal >= 0x8000)
// 				val = -((65535 - tmpVal) + 1);
// 			else
// 				val = tmpVal;
// 			cCallback(val / 16384.0);
// 		};
// 		wire.readBytes(adr, 8, function(err, res) {
// 			high = res.readUInt8(0);
// 			if(high && low) byteCal();
// 		});
// 		wire.readBytes(adr+1, 8, function(err, res) {
// 			low = res.readUInt8(0);
// 			if(high && low) byteCal();
// 		});
// 	};
// 	var cal = function(){
// 		var pos = {};
// 		var dist = function(a,b){
// 			return Math.sqrt((a*a)+(b*b));
// 		};
// 		var degrees = function(rad){
// 			return rad*(180/Math.PI);
// 		};
// 		var get_x = function(){
// 			return Math.atan2(y, dist(x,z));
// 		};
// 		var get_y = function(){
// 			return Math.atan2(x, dist(y,z)) * -1;
// 		};
// 		pos.x = degrees(get_x());
// 		pos.y = degrees(get_y());
// 		pCallback(pos);
// 	};
// 	read_word_2c(0x3b, function(pVal){
// 		x = pVal;
// 		if(x && y && z) cal();
// 	});
// 	read_word_2c(0x3d, function(pVal){
// 		y = pVal;
// 		if(x && y && z) cal();
// 	});
// 	read_word_2c(0x3f, function(pVal){
// 		z = pVal;
// 		if(x && y && z) cal();
// 	});
// };

// wire.writeBytes(0x6b, [0], function(err, value){
// 	if(!err){
// 		console.log('Sensor boot up');
// 		var interval = setInterval(function(){
// 			getPosition(function(pPos){
// 				socket.emit('sensor-position', pPos);
// 			});
// 		}, 100);
// 	} else {
// 		console.log(err);
// 	}
// });

var i2c = require('i2c-bus');
var MPU6050 = require('./node-i2c-mpu6050');
var address = 0x68;
var i2c1 = i2c.openSync(1);

var sensor = new MPU6050(i2c1, address);

var data = sensor.readSync();

socket.on('connect', function() {
    console.log('Sensor IO connected');
    var interval = setInterval(function(){
		// getPosition(function(pPos){
			socket.emit('sensor-position', sensor.readSync().rotation);
		// });
	}, 100);
});

process.on('SIGTERM',function(){
	console.log("SIGTERM");
	socket.disconnect();
});

process.on('SIGINT',function(){
	console.log("SIGINT");
	socket.disconnect();
});

process.on('exit',function(){
	console.log("EXIT");
	socket.disconnect();
});
