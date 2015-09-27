var worldTime = 0;
var ticksInEarthDay = 48;
var gameDays = 0;
var movementTime = 1;
var messages = [];
var passOut = false;

function tick(){
	worldTime++;
	thePlayer.useResources();
}

function action(time){
	if(thePlayer.isAlive){
		if(time === "undefined"){time = 1;}
		for (t=0;t<time;t++){
			tick();
		}
		update();
		return true;
	} else {
		return false;
	}
}


function update(){
	gameDays = Math.floor(worldTime/ticksInEarthDay);
	$('#daycount').html("Day " + gameDays);
	updateResourceIndicators();
	updateWorkingSystems();
	updateMessages();
	updateInventory();
	thePlayer.currentRoom.load();
	if(passOut){
		passOut = false;
		sleepPlayer("You collapsed from exhaustion");
		
	}
}

function updateMessages(){
	var output = "";
	for(msg in messages){
		output += messages[msg] + "<br>";
	}
	$('#message').html(output);
	messages = [];
}

function checkVictory(){
}