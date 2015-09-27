var worldTime = 0;
var ticksInEarthDay = 48;
var gameDays = 0;
var movementTime = 1;
var messages = [];

function tick(){
	worldTime++;
	thePlayer.useResources();
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
	updateResourceIndicators();
	updateWorkingSystems();
	updateMessages();
	updateInventory();
}

function updateMessages(){
	var output = "";
	for(msg in messages){
		output += messages[msg] + "<br>";
	}
	$('#message').html(output);
	messages = [];
}

function checkDeath(){
}

function checkVictory(){
}