var sm = new SectionManager({
	sections: {
		intro: new introBase({ el: $('.section.intro') }),
		ready: new ReadyBase({ el: $('.section.ready') }),
		game: new GameBase({ el: $('.section.game') }),
		result: new ResultBase({ el: $('.section.result') })
	},
	active: 'intro'
});
var max = {x: 40.45110861199078, y: 35.24720242731452};
var min =  {x: -34.21204067493303, y: -26.105010320114967};
// var socket = io.connect('http://10.0.1.2:3000');
var socket = io.connect('http://192.168.1.125:3000');

var mode = 'idle';
var scoreArray = [];
var gameTime = 30;

socket.on('buttonPress', function() {
	if(!gameStarted){
		startGame();
	} else if(gameCounterInst) {
		var timeArray = gameCounterInst.countdown('getTimes');
		if(timeArray){
			var time = timeArray[timeArray.length - 1];
			if(time > gameTime - 5){
				restartGame();
			}
		}
	}
});
socket.on('position', function(data) {
	if(mode == 'game'){
		var dir = (Math.abs(data.x) > Math.abs(data.y)) ? 'x' : 'y';
		// var level = Math.floor(Math.abs(data[dir]) / ratio[dir]) + 1;
		var ratio = (data[dir] > 0) ? max[dir] / 4 : Math.abs(min[dir]) / 4;
		var level = Math.floor(Math.abs(data[dir]) / ratio);
			level += 1;
		console.log(level);
		$('.rig').removeClass('level1 level2 level3 level4').addClass('level' + ((level > 4) ? '4' : level));
		scoreArray.push(level);
	} else if(mode == 'setting'){
		if(data.x > max.x) max.x = data.x;
		if(data.y > max.y) max.y = data.y;
		if(data.x < min.x) min.x = data.x;
		if(data.y < min.y) min.y = data.y;
	}
});

var setMaxMin = function(){
	console.log('Max & Min setup...');
	mode = 'setting';
	setTimeout(function(){
		mode = 'game';
		showCurrentMaxMin();
	}, 8000);
};

var showCurrentMaxMin = function(){
	console.log('max: ');
	console.log(max);
	console.log('min: ');
	console.log(min);
};

var getTotalScore = function(){
	var score = 0;
	for(var i=0; i<scoreArray.length; i++){
		score += (scoreArray[i] <= 3) ? (1/scoreArray[i]) : 0;
	}
	return Math.floor((score / scoreArray.length) * 100);
};

var gameStarted = false;
var gameCounterInst = false;

var restartGame = function(){
	window.gameCounterInst.countdown('destroy');
	sm.changeSection('intro', function(){
		gameStarted = false;
		gameCounterInst = false;
	});
};

var startGame = function(){
	gameStarted = true;
	window.scoreArray = [];
	sm.changeSection('ready', function(){
		$('.readyCountdown').countdown({
			until: '+6s',
			compact: true, 
			layout: $('#readyCountdownLayout').html(),
			onExpiry: function(){
				$('.readyCountdown').countdown('destroy');
				sm.changeSection('game', function(){
					window.mode = 'game';
					window.gameCounterInst = $('.gameCountdown').countdown({
						until: '+' + window.gameTime + 's',
						compact: true, 
						layout: $('#imageLayout').html(),
						onExpiry: function(){
							window.mode = 'idle';
							var score = window.getTotalScore().toString();
							if(score.length < 3)
								$('.result .score').html("<span class='image image"+score[0]+"'></span><span class='image image"+score[1]+"'></span>");
							else 
								$('.result .score').html("<span class='image image"+score[0]+"'></span><span style='margin-right:5px;' class='image image"+score[1]+"'></span><span class='image image"+score[2]+"'></span>");
							$('.scoreContain .level').removeClass('level1 level2 level3 level4').addClass('level' + (Math.floor(score / 25) + 1));
							sm.changeSection('result', function(){
								$('.gameCountdown').countdown('destroy');
								setTimeout(function(){
									sm.changeSection('intro', function(){
										gameStarted = false;
									});
								}, 8000);
							});
						}
					});
				});
			}
		});
	});
};

$('.section.intro').on('click', function(){
	if(!gameStarted)
		startGame();
});
