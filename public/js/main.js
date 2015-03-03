var socket = io.connect('http://localhost:3000');
	socket.on('position', function (data) {
		console.log(data);
	});

var startTheGame = function(){
	$(".mainTitle").animate({ top:"-94px" });
	$(".content").animate({ bottom:"-300px" });
};
