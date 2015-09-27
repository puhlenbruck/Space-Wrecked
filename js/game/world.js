var theWorld = {};
window.worldTemps = ["frozen", "cold", "cool", "warm", "hot", "scorching"];
window.worldAtmospheres = ["none", "thin breathable", "thin unbreathable", "thin toxic", "normal breathable", "normal unbreathable", "normal toxic", "dense breathable", "dense unbreathable", "dense toxic"];
window.worldVegitation = ["none","sparse","light","heavy","dense"];
window.worldWildlife = ["none","small","diverse","sprawling"];

var workingShipSystems = {solarPanel:true, battery:true, airRecycler:true, waterRecycler:true, antenna:true, tranceiver:true, codec:true, fuel:true, engine:true, flightControl:true, environmentalSensors:true}
var questItemChance = 0.05;

function world(){
	this.map = {};
	this.map["0,0"] = new room(0,0);
	this.map["0,0"].title = "Crash Site";
	this.map["0,0"].description = "Ground 0.  My banged up shuttle is here.  I'll have to go repair it. I should be able to find the missing parts around"
	this.map["0,0"].contents = [];
	this.map["shuttle"] = new room(0,0); // shuttle interior
	this.map["shuttle"].description = "Inside my Shuttle I'm pretty safe.  All my equipment is here as well as my only chance of getting off this rock.  Supplies won't last forever though, and this thing is going nowhere fast.  I'll have to explore go out and explore the planet to find a hope of surviving";
	this.map["shuttle"].title = "Shuttle Interior";
	this.map["shuttle"].contents = [];
	
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
	var questItem = generateQuestItem();
	if (typeof(questItem) != "undefined" ){
		this.contents[0] = questItem;
	}
	this.changes = [];
	this.enter = function(){
		displayRoomDescription(this.description);
		setRoomTitle(this.title);
		if(this.title==="Shuttle Interior"){
			setMovementOptions("<a onclick=exitShuttle()>Outside</a>.");
		}else if(this.title==="Crash Site"){
			setMovementOptions("<a onclick=moveNorth()>North</a>, <a onclick=moveSouth()>South</a>, <a onclick=moveEast()>East</a>, <a onclick=moveWest()>West</a>. <a onclick=enterShuttle()>Enter Shuttle</a>.");
		} else {
			setMovementOptions("<a onclick=moveNorth()>North</a>, <a onclick=moveSouth()>South</a>, <a onclick=moveEast()>East</a>, <a onclick=moveWest()>West</a>.");
		}
		thePlayer.currentRoom = this;
		showRoomContents(this.contents);
		action(movementTime);
		this.lastVisited = worldTime;
		
	}
	this.removeItem = function(item){
		var removed = jQuery.extend(true, {}, item);
		item.quantity--;
		if(item.quantity < 1){
			var index = this.contents.indexOf(item);
			this.contents.splice(index,1);
		}
		removed.quantity = 1;
		return removed();
	}
}

function generateQuestItem(){
	if(Math.random() < questItemChance){
		possibleItems = [];
		for(var system in workingShipSystems){
			if (!workingShipSystems[system]){
				possibleItems.push(system);
			}
		}
		itemName = nameOfItem(possibleItems[getRandomInt(0,possibleItems.length)]);
		item = new item();
		item.name = itemName;
		item.size = 5;
		return item;
	}
}

function updateWorkingSystems(){
	var workingSystems = "<div>Working:<ul>"
	var brokenSystems = "<div>Broken:<ul>"
	for(var system in workingShipSystems){
		if (workingShipSystems[system]){
			workingSystems += "<li>" + nameOfItem(system) + "</li>";
		} else {
			brokenSystems += "<li>" + nameOfItem(system) + "</li>";
		}
	}
	theWorld.map["shuttle"].systems = [];
	theWorld.map["shuttle"].systems[0] = workingSystems + "</ul></div>";
	theWorld.map["shuttle"].systems[1] = brokenSystems + "</ul></div>";
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
function exitShuttle(){
	theWorld.getRoom(0,0).enter();
}
function enterShuttle(){
	theWorld.map["shuttle"].enter();
}

function initWorld(){
	theWorld = new world();
	theWorld.temperature = window.worldTemps[getRandomInt(0,window.worldTemps.length)];
	theWorld.atmosphere = window.worldAtmospheres[getRandomInt(0,window.worldAtmospheres.length)];
	theWorld.vegitation = window.worldVegitation[getRandomInt(0,window.worldAtmospheres.length)];
	theWorld.Wildlife = window.worldWildlife[getRandomInt(0,window.worldWildlife.length)];
	delete window.worldTemps;
	delete window.worldAtmospheres;
	delete window.worldVegitation;
	delete window.worldWildlife;
	breakSystems();
	updateWorkingSystems();
}

function breakSystems(){
	for (var system in workingShipSystems){
		if (Math.random()<0.8){
			workingShipSystems[system] = false;
		}
	}
	if(workingShipSystems.antenna && workingShipSystems.tranceiver && workingShipSystems.codec){
		workingShipSystems.antenna = false;
		workingShipSystems.tranceiver = false;
		workingShipSystems.codec = false;
	}
	if(workingShipSystems.fuel && workingShipSystems.engine && workingShipSystems.flightControl){
		workingShipSystems.fuel = false;
		workingShipSystems.engine = false;
		workingShipSystems.flightControl = false;
	}
}

function showRoomContents(contents){
	var itemsString = "";
	if(thePlayer.currentRoom == theWorld.map["shuttle"]){
		itemsString += theWorld.map["shuttle"].systems[0];
		itemsString += theWorld.map["shuttle"].systems[1];
	}
	if (contents.length == 0){
		itemsString += "<p>There is nothing of use here.</p>"
	} else {
		for(var item in contents){
			itemsString += "<p>" + nameOfItem(contents[item].name) + "</p>";
		}
	}
	$('#objects')[0].innerHTML = itemsString;
}

function displayRoomDescription(desc) {
	$('#narration').html(desc);
}

function setRoomTitle(str) {
	$('#area-title').html(str);
}

function setMovementOptions(str){
	$('#movement-options').html(str);
}
