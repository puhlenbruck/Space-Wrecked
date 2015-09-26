var theWorld = {};

function world(){
	this.map = {};
	this.map["0,0"] = new room(0,0);
	this.map["0,0"].description = "Crash Site"
	this.map["shuttle"] = new room(0,0); // shuttle interior
	this.map["shuttle"].description = "Inside The Shuttle";
	
	this.getRoom = function(x,y){
		key = createCoordString(x,y);
		if(key in this.map){
			return this.map[key];
		} else{
			var newRoom = new room(x,y);
			this.map[key] = newRoom;
			return newRoom;
		}
	}
	
	this.getNorthRoom = function(startRoom){
		newX = startRoom.loc[0];
		neyY = startRoom.loc[1] + 1;
		var newRoom = getRoom(newX,newY);
		return newRoom;
	}
	this.getEastRoom = function(startRoom){
		newX = startRoom.loc[0] + 1;
		neyY = startRoom.loc[1];
		var newRoom = getRoom(newX,newY);
		return newRoom;
	}
	this.getSouthRoom = function(startRoom){
		newX = startRoom.loc[0];
		neyY = startRoom.loc[1] - 1;
		var newRoom = getRoom(newX,newY);
		return newRoom;
	}
	this.getWestRoom = function(startRoom){
		newX = startRoom.loc[0] - 1;
		neyY = startRoom.loc[1];
		var newRoom = getRoom(newX,newY);
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
        
	this.enter() = function(){
		if(lastVisited === "never"){
			displayRoomDescription(this.description);
		}
		lastVisited = worldTime;
	}
}

function createCoordString(x,y){
	return x + "," + y;
}

function initWorld(){
	theWorld = new world();
}