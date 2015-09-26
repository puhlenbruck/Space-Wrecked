function world(){
	this.map = {};
	this.map["0,0"] = new room(0,0);
	
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
}

function room(x,y){
	this.loc = [x,y];
	this.description = "";
	this.lastVisited = 0;
	this.lastChanged = 0;
	this.changes = [];
}

function createCoordString(x,y){
	return x + "," + y;
}