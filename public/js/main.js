var socket = io.connect('http://localhost:3000');
	socket.on('news', function (data) {
		socket.emit('my other event', { my: 'data' });
	});

var startTheGame = function(){
	$(".mainTitle").animate({ top:"-94px" });
	$(".content").animate({ bottom:"-300px" });
};
