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
			newRoom = new room(x,y);
			this.map[key] = newRoom;
			return newRoom;
		}
	}
	
	this.getNorthRoom(startRoom){
		newX = startRoom.loc[0];
		neyY = startRoom.loc[1] + 1;
		newRoom = getRoom(newX,newY);
		return newRoom;
	}
	this.getEastRoom(startRoom){
		newX = startRoom.loc[0] + 1;
		neyY = startRoom.loc[1];
		newRoom = getRoom(newX,newY);
		return newRoom;
	}
	this.getSouthRoom(startRoom){
		newX = startRoom.loc[0];
		neyY = startRoom.loc[1] - 1;
		newRoom = getRoom(newX,newY);
		return newRoom;
	}
	this.getWestRoom(startRoom){
		newX = startRoom.loc[0] - 1;
		neyY = startRoom.loc[1];
		newRoom = getRoom(newX,newY);
		return newRoom;
	}
}

function room(x,y){
	this.loc = [x,y];
	this.description = "Room at (" + x + "," + y + ")";
	this.lastVisited = 0;
	this.lastChanged = 0;
	this.changes = [];
}

function createCoordString(x,y){
	return x + "," + y;
}