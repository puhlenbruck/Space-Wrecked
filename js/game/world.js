var theWorld = {};
window.worldTemps = ["frozen", "cold", "cool", "warm", "hot", "scorching"];
window.worldAtmospheres = ["none", "thin breathable", "thin unbreathable", "thin toxic", "normal breathable", "normal unbreathable", "normal toxic", "dense breathable", "dense unbreathable", "dense toxic"];
window.worldVegitation = ["none","sparse","light","heavy","dense"];
window.worldWildlife = ["none","small","diverse","sprawling"];

function world(){
	this.map = {};
	this.map["0,0"] = new room(0,0);
	this.map["0,0"].title = "Crash Site"
	this.map["0,0"].description = "Ground 0.  My banged up shuttle is here.  I'll have to go repair it. I should be able to find the missing parts around"
	this.map["shuttle"] = new room(0,0); // shuttle interior
	this.map["shuttle"].description = "Inside my Shuttle I'm pretty safe.  All my equipment is here as well as my only chance of getting off this rock.  Supplies won't last forever though, and this thing is going nowhere fast.  I'll have to explore go out and explore the planet to find a hope of surviving";
	this.map["shuttle"].title = "Shuttle Interior";
	
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
		var newRoom = this.getRoom(newX,newY);
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
	this.title = "(" + x + "," + y +")";
	this.description = "Room at (" + x + "," + y + ")";
	this.lastVisited = "never";
	this.lastChanged = "never";
	this.contents = [];
	this.changes = [];
        
	this.enter = function(){
		displayRoomDescription(this.description);
		setRoomTitle(this.title);
		this.lastVisited = worldTime;
		thePlayer.currentRoom = this;
	}
}

function createCoordString(x,y){
	return x + "," + y;
}

function moveNorth(){
	theWorld.getNorthRoom().enter();
}
function moveEast(){
	theWorld.getEastRoom().enter();
}
function moveSouth(){
	theWorld.getSouthRoom().enter();
}
function moveWest(){
	theWorld.getWestRoom().enter();
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
