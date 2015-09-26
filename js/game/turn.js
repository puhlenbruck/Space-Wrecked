var worldTime = 0;
var ticksInEarthDay = 48;
var gameDays = 0;
var movementTime = 1;

function tick(){
	worldTime++;
}

function action(time){
	if(time === "undefined"){time = 1;}
	for (t=0;t<time;t++){
		tick();
	}
	update();
}


function update(){
	gameDays = Math.floor(worldTime/ticksInEarthDay);
	$('#daycount').html("Day " + gameDays);
}

function checkDeath(){
}

function checkVictory(){
}