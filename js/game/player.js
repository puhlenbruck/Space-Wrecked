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


function player(){
	this.currentRoom = {};
	this.carryCapacity = 10;
	this.inventory = {};
	
	this.air = 5;
	this.water = 0;
	this.food = 0;
	this.timeWithoutAir = 0;
	this.timeWithoutWater = 0;
	this.timeWithoutFood = 0;
	this.timeWithoutSleep = 0;
	
	this.useResources = function(){
		this.timeWithoutSleep++;

		if(theWorld.atmosphere.match(/ breath/)) {
			this.air++;
		}
		if(this.air > 0) {
			this.air--;
		} else {
			this.timeWithoutAir++;
		}

		if(this.water>0){this.water--;}else{this.timeWithoutWater++;}
		if(this.food>0){this.ood++;}else{this.timeWithoutFood++;}
	}
	
	this.pickup = function(item){
		
	}
}

function updateResourceIndicators(){
	var airThreshold = Math.ceil(thePlayer.timeWithoutAir/airRatio);
	var waterThreshold = Math.ceil(thePlayer.timeWithoutWater/waterRatio);
	var foodThreshold = Math.ceil(thePlayer.timeWithoutFood/foodRatio);
	var sleepThreshold = Math.ceil(thePlayer.timeWithoutSleep/sleepRatio);

	if(airThreshold > airStatus.length-1) {
		killPlayer("You Have Suffocated");
	} else {
		$('#air-status').html(airStatus[airThreshold]);
		$('#air-status').removeClass('ideal good okay suffering danger');
		$('#air-status').addClass(airStatusClass[airThreshold]);
	}

	if(waterThreshold > waterStatus.length-1){
		killPlayer("You Have Died Of Thirst");
	}else{
		$('#water-status').html(waterStatus[waterThreshold]);
		$('#water-status').removeClass('ideal good okay suffering danger');
		$('#water-status').addClass(statusClass[waterThreshold]);
	}
	if(foodThreshold > foodStatus.length-1){
		killPlayer("You Have Suffocated");
	}else{
		$('#food-status').html(foodStatus[foodThreshold]);
		$('#food-status').removeClass('ideal good okay suffering danger');
		$('#food-status').addClass(statusClass[foodThreshold]);
	}
	if(sleepThreshold > sleepStatus.length-1){
		sleepPlayer();
	}else{
		$('#sleep-status').html(sleepStatus[sleepThreshold]);
		$('#sleep-status').removeClass('ideal good okay suffering danger');
		$('#sleep-status').addClass(statusClass[sleepThreshold]);
	}
}

function killPlayer(msg){
	messages.push(msg);
}

function sleepPlayer(){
}

function initPlayer(){
	thePlayer = new player();
	theWorld.map["shuttle"].enter();
}
