var thePlayer = {};

var waterStatus = ["Parched","Dry","Damp","Moist","Saturated"].reverse();
var airStatus = ["No Air!","Thin","Fresh"].reverse();
var foodStatus = ["Starving","Hungry","Peckish","Full","Sated"].reverse();
var sleepStatus = ["Exausted","Tired","Drowsy","Awake","Rested"].reverse();

var statusClass = ["ideal", "good", "okay", "suffering", "danger"];
var airStatusClass = ["ideal", "suffering", "danger"];

var airRatio = 1;
var waterRatio = 10;
var foodRatio = 20;
var sleepRatio = 15;

var eatingRate = 10;
var drinkingRate = 3;


function player(){
	this.currentRoom = {};
	this.carryCapacity = 10;
	this.encumbrance = 0;
	this.inventory = [];
	
	this.isSleeping = false;
	this.isAlive = true;
	this.timeWithoutAir = 0;
	this.timeWithoutWater = 0;
	this.timeWithoutFood = 0;
	this.timeWithoutSleep = 0;
	
	this.useResources = function(){
		if(this.isSleeping){
			this.timeWithoutSleep = 0;
			this.breathe();
			this.timeWithoutWater++;
			this.timeWithoutFood++;
		} else {
			this.timeWithoutSleep++;
			this.breathe();
			this.drink();
			this.eat();
		}
	}
	
	
	this.breathe = function(){
		if(theWorld.atmosphere.match(/ breath/)) {
		} else {
			this.timeWithoutAir++;
		}
	}
	
	this.drink = function(){
		if(this.hasWater()){
			this.timeWithoutWater = 0;
			this.depleteWater();
		}else{
			this.timeWithoutWater++;
		}
	}
	
	this.eat = function(){
		if(this.hasFood() && this.timeWithoutFood > eatingRate){
			this.timeWithoutFood = 0;
			this.depleteFood();
		}else{
			this.timeWithoutFood++;
		}
	}
	
	this.pickup = function(i){
		if(i.size + this.encumbrance > this.carryCapacity){
			messages.push("You are carrying too much");
			action(0);
		}else{
			this.addToInventory(this.currentRoom.removeItem(i));
			action(i["pickupTime"]);
		}
	}
	
	this.has = function(itemName){
		for(index in this.inventory){
			if(this.inventory[index].name===itemName){
				return true;
			}
		}
		return false;
	}
	
	this.addToInventory = function(i){
		var unique = true;
		for(var index in this.inventory){
			if (this.inventory[index].name === i.name){
				this.inventory[index].quantity += i.quantity;
				unique = false;
				break;
			}
		}
		if(unique){
			this.inventory.push(i);
		}
		this.encumbrance += i.size*i.quantity;
	}
	
	this.removeFromInventory = function(i){
		var removed = jQuery.extend(true, {}, i);
		i.quantity--;
		if(i.quantity < 1){
			var index = this.inventory.indexOf(i);
			this.inventory.splice(index,1);
		}
		removed.quantity = 1;
		this.encumbrance -= i.size;
		return removed;
	}
	
	this.hasWater = function(){
		var available = false;
		for(var i in this.inventory){
			var currItem = this.inventory[i].name
			if(currItem === "Water Bottle" || currItem === "Half-Empty Bottle"){
				available = true;
				break;
			}
		}
		return available;
	}
	
	this.depleteWater = function(){
		var bottle = this.selectBottleToDrink();
		if(!("drinks" in bottle)){
			bottle["drinks"] = 0;
		}
		if (bottle["drinks"]+1 >= drinkingRate){
			bottle["drinks"] = 0;
			this.removeFromInventory(bottle);
			newBottle = {};
			if(bottle["name"] === "Half-Empty Bottle"){
				newBottle = new Item();
				newBottle["name"] = "Empty Bottle";
			} else {
				newBottle = new Item();
				newBottle["name"] = "Half-Empty Bottle";
			}
			newBottle["drinks"] = 0;
			this.addToInventory(newBottle);
		} else {
			bottle["drinks"]++;
		}
	}
	
	this.selectBottleToDrink = function(){
		var bottle = {};
		for(var i in this.inventory){
			if (this.inventory[i].name === "Half-Empty Bottle"){
				bottle = this.inventory[i];
				break;
			}else if(this.inventory[i].name === "Water Bottle"){
				bottle = this.inventory[i];
			}
		}
		return bottle;
	}
	
	this.hasFood = function(){
		var available = false;
		for(var i in this.inventory){
			var currItem = this.inventory[i].name
			if(currItem === "Ration"){
				available = true;
				break;
			}
		}
		return available;
	}
	
	this.depleteFood = function(){
		for(var i in this.inventory){
			var currItem = this.inventory[i].name
			if(currItem === "Ration"){
				this.removeFromInventory(this.inventory[i]);
				break;
			}
		}
	}
}

function fillBottle(){
	var inv = thePlayer.inventory;
	bottleIndex = 0;
	for(index in inv){
		if(inv[index].name === "Empty Bottle"){
			bottleIndex = index;
			break;
		}else if(inv[index].name === "Half-Empty Bottle"){
			bottleIndex = index;
		}
	}
	thePlayer.removeFromInventory(inv[bottleIndex]);
	var newBottle = new Item();
	newBottle["name"] = "Water Bottle";
	thePlayer.addToInventory(newBottle);
	action(1);
}

function updateInventory(){
	var displayString = "";
	for(var i in thePlayer.inventory){
		var itemStr = ""
		var name = thePlayer.inventory[i].name;
		var amount = thePlayer.inventory[i].quantity;
		itemStr += "<li><a onclick='drop(this)' objectname='"+name+"'>" + name;
		if(amount > 1){
			itemStr += " (" + amount + ")"
		}
		itemStr += "</a></li>";
		displayString += itemStr;
	}
	$('#inventory').html(displayString);
}

function updateResourceIndicators(){
	var airThreshold = Math.ceil(thePlayer.timeWithoutAir/airRatio);
	var waterThreshold = Math.ceil(thePlayer.timeWithoutWater/waterRatio);
	var foodThreshold = Math.ceil(thePlayer.timeWithoutFood/foodRatio);
	var sleepThreshold = Math.ceil(thePlayer.timeWithoutSleep/sleepRatio);
	
	if(airThreshold > airStatus.length-1) {
		killPlayer("You have suffocated");
		airThreshold = airStatus.length-1;
	} 
	$('#air-status').html(airStatus[airThreshold]);
	$('#air-status').removeClass('ideal good okay suffering danger');
	$('#air-status').addClass(airStatusClass[airThreshold]);
	
	
	if(waterThreshold > waterStatus.length-1){
		killPlayer("You have died of thirst.");
		waterThreshold = waterStatus.length-1;
	}
	$('#water-status').html(waterStatus[waterThreshold]);
	$('#water-status').removeClass('ideal good okay suffering danger');
	$('#water-status').addClass(statusClass[waterThreshold]);
	
	if(foodThreshold > foodStatus.length-1){
		killPlayer("You have starved to death.");
		foodThreshold = foodStatus.length-1;
	}
	$('#food-status').html(foodStatus[foodThreshold]);
	$('#food-status').removeClass('ideal good okay suffering danger');
	$('#food-status').addClass(statusClass[foodThreshold]);
	
	if(sleepThreshold > sleepStatus.length-1){
		passOut = true;
	}else{
		$('#sleep-status').html(sleepStatus[sleepThreshold]);
		$('#sleep-status').removeClass('ideal good okay suffering danger');
		$('#sleep-status').addClass(statusClass[sleepThreshold]);
	}
	
}

function drop(element){
	var attrs = element.attributes;
	var stuff = thePlayer.inventory;
	var name = attrs["objectname"];
	for(item in stuff){
		if(stuff[item].name === name.value){
			thePlayer.currentRoom.addItem(thePlayer.removeFromInventory(stuff[item]));
			break;
		}
	}
	action(0);
}
	
function killPlayer(msg){
	messages.push(msg);
	thePlayer.isAlive = false;
}

function sleepPlayer(msg){
	messages.push(msg);
	messages.push("You slept for 8 hours");
	thePlayer.isSleeping = true;
	action(16);
	thePlayer.isSleeping = false;
}

function initPlayer(){
	thePlayer = new player();
	initInventory();
	thePlayer.currentRoom = theWorld.map["shuttle"];
	displayRoomDescription(thePlayer.currentRoom.description);
	setRoomTitle(thePlayer.currentRoom.title);
	setMovementOptions("<a onclick=exitShuttle()>Outside</a>.");
	showRoomContents(thePlayer.currentRoom.contents);
	this.lastVisited = worldTime;
}

function initInventory(){
	var bottles = new Item();
	bottles["name"] = "Water Bottle";
	bottles["quantity"] = 10;
	bottles["drinks"] = 0;
	bottles["pickupTime"];
	thePlayer.addToInventory(bottles);
	var rations = new Item();
	rations["name"] = "Ration";
	rations["size"] = 5;
	rations["quantity"] = 2;
	thePlayer.addToInventory(rations);
}
