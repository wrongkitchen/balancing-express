var sm = new SectionManager({
	sections: {
		intro: new introBase({ el: $('.section.intro') }),
		ready: new ReadyBase({ el: $('.section.ready') }),
		game: new GameBase({ el: $('.section.game') }),
		result: new ResultBase({ el: $('.section.result') })
	},
	active: 'intro'
});
var max= { x: 40.985033055684625, y: 25.01647041258421 };
var min =  { x: -20.488619542804322, y: -25.21522610937548 };
// var socket = io.connect('http://10.0.1.2:3000');
var socket = io.connect('http://192.168.1.61:3000');
var ratio = {};
	ratio.x = (max.x + Math.abs(min.x)) / 8;
	ratio.y = (max.y + Math.abs(min.y)) / 8;

var mode = 'idle';
var scoreArray = [];

socket.on('position', function (data) {
	if(mode == 'game'){
		var dir = (Math.abs(data.x) > Math.abs(data.y)) ? 'x' : 'y';
		var level = Math.floor(Math.abs(data[dir]) / ratio[dir]) + 1;
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
		ratio.x = (max.x + Math.abs(min.x)) / 8;
		ratio.y = (max.y + Math.abs(min.y)) / 8;
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

$('.section.intro').on('click', function(){
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
					$('.gameCountdown').countdown({
						until: '+30s',
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
									sm.changeSection('intro');
								}, 8000);
							});
						}
					});
				});
			}
		});
	});
});
