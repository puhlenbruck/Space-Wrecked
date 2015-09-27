var thePlayer = {};

var waterStatus = ["Parched","Dry","Damp","Moist","Saturated"];
var airStatus = ["No Air!","Thin","Fresh"];
var foodStatus = ["Starving","Hungry","Peckish","Full","Sated"];
var sleepStatus = ["Exausted","Tired","Drowsy","Awake","Rested"];

var airRatio = 1;
var waterRatio = 10;
var foodRatio = 20;
var sleepRatio = 15;

function player(){
    this.currentRoom = {};
	this.air = 0;
	this.water = 0;
	this.food = 0;
	this.timeWithoutAir = 0;
	this.timeWithoutWater = 0;
	this.timeWithoutFood = 0;
	this.timeWithoutSleep = 0;
	this.useResources = function(){
		this.timeWithoutSleep++;
		if(this.air>0){this.air--;}else{this.timeWithoutAir++;}
		if(this.water>0){this.water--;}else{this.timeWithoutWater++;}
		if(this.food>0){this.ood++;}else{this.timeWithoutFood++;}
	}
}

function updateResourceIndicators(){
	var airThreshold = Math.ceil(thePlayer.timeWithoutAir/airRatio);
	var waterThreshold = Math.ceil(thePlayer.timeWithoutWater/waterRatio);
	var foodThreshold = Math.ceil(thePlayer.timeWithoutFood/foodRatio);
	var sleepThreshold = Math.ceil(thePlayer.timeWithoutSleep/sleepRatio);
	if(airThreshold < airStatus.length-1){
		killPlayer("You Have Suffocated");
	}else{
		$('#air-status').html(airStatus[airThreshold]);
		}
	if(waterThreshold < waterStatus.length-1){
		killPlayer("You Have Died Of Thirst");
	}else{
		$('#water-status').html(waterStatus[waterThreshold]);
		}
	if(foodThreshold < foodStatus.length-1){
		killPlayer("You Have Suffocated");
	}else{
		$('#food-status').html(foodStatus[foodThreshold]);
		}
	if(sleepThreshold < sleepStatus.length-1){
		sleepPlayer();
	}else{
		$('#sleep-status').html(sleepStatus[sleepThreshold]);
		}
}

function killPlayer(msg){
}

function sleepPlayer(){
}

function initPlayer(){
        thePlayer = new player();
        theWorld.map["shuttle"].enter();
}
