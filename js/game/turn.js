var worldTime = 0;
var ticksInEarthDay = 48;
var gameDays = 0;
var movementTime = 1;

function tick(){
	update();
	checkDeath();
	checkVictory();
}

function update(){
	gameDays = Math.floor(worldTime/ticksInEarthDay);
	$('#daycount').html("Day " + gameDays);
}

function checkDeath(){
}

function checkVictory(){
}