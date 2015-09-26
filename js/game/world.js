var theWorld = {};
window.worldTemps = ["frozen", "cold", "cool", "warm", "hot", "scorching"];
window.worldAtmospheres = ["none", "thin breathable", "thin unbreathable", "thin toxic", "normal breathable", "normal unbreathable", "normal toxic", "dense breathable", "dense unbreathable", "dense toxic"];
window.worldVegitation = ["none","sparse","light","heavy","dense"];
window.worldWildlife = ["none","small","diverse","sprawling"];

function world(){
	this.map = {};
	this.map["0,0"] = new room(0,0);
	this.map["0,0"].description = "Crash Site"
	this.map["shuttle"] = new room(0,0); // shuttle interior
	this.map["shuttle"].description = "Inside The Shuttle";
	
	this.getRoom = function(x,y){
		var key = createCoordString(x,y);
		if(key in this.map){
			return this.map[key];
		} else{
			var newRoom = new room(x,y);
			this.map[key] = newRoom;
			return newRoom;
		}
	}
	
	this.getNorthRoom = function(){
		var startRoom = thePlayer.currentRoom;
		var newX = startRoom.loc[0];
		var newY = startRoom.loc[1] + 1;
		var newRoom = this.getRoom(newX,newY);
		return newRoom;
	}
	this.getEastRoom = function(){
		var startRoom = thePlayer.currentRoom;
		var newX = startRoom.loc[0] + 1;
		var newY = startRoom.loc[1];
		var newRoom = this.getRoom(newX,newY);
		return newRoom;
	}
	this.getSouthRoom = function(){
		var startRoom = thePlayer.currentRoom;
		var newX = startRoom.loc[0];
		var newY = startRoom.loc[1] - 1;
		var newRoom = this.getRoom();
		return newRoom;
	}
	this.getWestRoom = function(){
		var startRoom = thePlayer.currentRoom;
		var newX = startRoom.loc[0] - 1;
		var newY = startRoom.loc[1];
		var newRoom = this.getRoom(newX,newY);
		return newRoom;
	}
}

function room(x,y){
	this.loc = [x,y];
	this.description = "Room at (" + x + "," + y + ")";
	this.lastVisited = "never";
	this.lastChanged = "never";
	this.contents = [];
	this.changes = [];
        
	this.enter = function(){
		displayRoomDescription(this.description)
		this.lastVisited = worldTime;
		thePlayer.currentRoom = this;
	}
}

function createCoordString(x,y){
	return x + "," + y;
}

function initWorld(){
	theWorld = new world();
	theWorld.temperature = window.worldTemps[getRandomInt(0,window.worldTemps.length)];
	theWorld.atmosphere = window.worldAtmospheres[getRandomInt(0,window.worldAtmospheres.length)];
	delete window.worldTemps;
	delete window.worldAtmospheres;
	delete window.worldVegitation;
	delete window.worldWildlife;
}

function displayRoomDescription(desc) {
	$('#narration').html(desc);
}

function setRoomTitle(str) {
	$('#area-title').html(str);
}
