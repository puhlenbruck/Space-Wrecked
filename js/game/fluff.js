var fluffTimes = {
	terrain: 0,
	weather: 0,
	flora: 0,
	fauna: 0,
	psych: 0
};

function fluff(room) {
	return "";
}

function moveWords(room) {
	var airThreshold = Math.ceil(thePlayer.timeWithoutAir/airRatio);
	var waterThreshold = Math.ceil(thePlayer.timeWithoutWater/waterRatio);
	var foodThreshold = Math.ceil(thePlayer.timeWithoutFood/foodRatio);
	var sleepThreshold = Math.ceil(thePlayer.timeWithoutSleep/sleepRatio);

	if(room.loc[0] === 0 && room.loc[1] === 0) { return ""; }

	phrase = "You ";
	switch(sleepThreshold) {
		case 0: phrase += " hike"; break;
		case 1: phrase += " walk"; break;
		case 2: phrase += " wander"; break;
		case 3: phrase += " stumble"; break;
		case 4: phrase += " crawl"; break;
	}
	if (theWorld.temperature == "frozen" && theWorld.vegetation == "none") {
		phrase += " through the tundra's snow banks";
	} else if(theWorld.temperature == "frozen" && theWorld.vegetation == "sparse") {
		phrase += " across the taiga";
	} else if(theWorld.temperature == "frozen" && theWorld.vegetation == "light") {
		phrase += " across the frozen plains";
	} else if(theWorld.temperature == "frozen" && theWorld.vegetation == "heavy") {
		phrase += " under the snowy canopy";
	} else if(theWorld.temperature == "frozen" && theWorld.vegetation == "dense") {
		phrase += " through the icy tree needles";
	} else if(theWorld.temperature == "cold" && theWorld.vegetation == "none") {
		phrase += " across the frozen wasteland";
	} else if(theWorld.temperature == "cold" && theWorld.vegetation == "sparse") {
		phrase += " over the icy steppes";
	} else if(theWorld.temperature == "cold" && theWorld.vegetation == "light") {
		phrase += " across the icy prairie";
	} else if(theWorld.temperature == "cold" && theWorld.vegetation == "heavy") {
		phrase += " through the giant fungus stalks";
	} else if(theWorld.temperature == "cold" && theWorld.vegetation == "dense") {
		phrase += " through the freezing forest";
	} else if(theWorld.temperature == "temperate" && theWorld.vegetation == "none") {
		phrase += " across the lifeless dirt";
	} else if(theWorld.temperature == "temperate" && theWorld.vegetation == "sparse") {
		phrase += " across the plains";
	} else if(theWorld.temperature == "temperate" && theWorld.vegetation == "light") {
		phrase += " through alien meadows";
	} else if(theWorld.temperature == "temperate" && theWorld.vegetation == "heavy") {
		phrase += " through the swamp";
	} else if(theWorld.temperature == "temperate" && theWorld.vegetation == "dense") {
		phrase += " through the Earth-like jungle";
	} else if(theWorld.temperature == "warm" && theWorld.vegetation == "none") {
		phrase += " across the salt flats";
	} else if(theWorld.temperature == "warm" && theWorld.vegetation == "sparse") {
		phrase += " across the wasteland";
	} else if(theWorld.temperature == "warm" && theWorld.vegetation == "light") {
		phrase += " through the rocky hills";
	} else if(theWorld.temperature == "warm" && theWorld.vegetation == "heavy") {
		phrase += " over the savanna";
	} else if(theWorld.temperature == "warm" && theWorld.vegetation == "dense") {
		phrase += " through the otherworldly oasis";
	} else if(theWorld.temperature == "hot" && theWorld.vegetation == "none") {
		phrase += " across the endless dunes";
	} else if(theWorld.temperature == "hot" && theWorld.vegetation == "sparse") {
		phrase += " across the desert";
	} else if(theWorld.temperature == "hot" && theWorld.vegetation == "light") {
		phrase += " through the prickling underbrush";
	} else if(theWorld.temperature == "hot" && theWorld.vegetation == "heavy") {
		phrase += " through the subtropics";
	} else if(theWorld.temperature == "hot" && theWorld.vegetation == "dense") {
		phrase += " through the rainforest";
	} else if(theWorld.temperature == "scorching" && theWorld.vegetation == "none") {
		phrase += " over the burning rock";
	} else if(theWorld.temperature == "scorching" && theWorld.vegetation == "sparse") {
		phrase += " through the ashen scrub";
	} else if(theWorld.temperature == "scorching" && theWorld.vegetation == "light") {
		phrase += " through the burning plains";
	} else if(theWorld.temperature == "scorching" && theWorld.vegetation == "heavy") {
		phrase += " through the iron forest";
	} else if(theWorld.temperature == "scorching" && theWorld.vegetation == "dense") {
		phrase += " beneath the watchful monoliths";
	}

	if(fluffTimes.flora > 100) {
		fluffTimes.flora = 0;
		switch(theWorld.vegetation) {
			case "none":
				switch(theWorld.temperature) {
					case "frozen":
					case "cold":
						phrase += ", a blinding snowstorm building its banks.";
						break;
					case "temperate":
						phrase += " drenched in ";
						if(theWorld.atmosphere.match(/toxic/)) { phrase += "acid " };
						phrase += "rain.";
						break;
					case "hot":
						phrase += ". A dust devil swirls around your feet.";
						break;
					case "burning":
						phrase += ", ash and embers falling from the sky.";
						break;

				}
				break;
			case "sparse":
				switch(theWorld.temperature) {
					case "frozen":
						phrase += ". Ice clings to a lone, spindly plant.";
						break;
					case "cold":
					case "temperate":
					case "hot":
						phrase += ". A branch cracks beneath your weight.";
						break;
					case "scorching":
						phrase += ". Once-living flora disintigrates in the breeze.";
						break;
				}
				break;
			case "light":
				phrase += ". You feel like you've seen this plant-thing before.";
				break;
			case "heavy":
				switch(theWorld.temperature) {
					case "frozen":
					case "cold":
						phrase += ". The frozen extremity of a plant snaps, landing nearby.";
						break;
					case "temperate":
					case "hot":
						phrase += ", branches rattling in the wind.";
						break;
					case "scorching":
						phrase += ". You pull your leg free of the alien vine curling around it.";
						break;
				}
				break;
			case "dense":
				phrase += ". You snap whatever protrudes into your path in hopes of finding your way back.";
				break;
		}
	} else { phrase += "." };

	return phrase;
}
