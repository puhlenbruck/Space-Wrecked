var worldTime = 0;
var ticksInEarthDay = 48;
var gameDays = 0;
var movementTime = 1;
var messages = [];
var passOut = false;

function tick() {
    worldTime++;
    fluffTimes.flora += getRandomInt(1, 150);
    thePlayer.useResources();
}

function action(time) {
    if (thePlayer.isAlive) {
        if (time === "undefined") {
            time = 1;
        }
        for (t = 0; t < time; t++) {
            tick();
        }
        update();
        return true;
    } else {
        return false;
    }
}

function update() {
    gameDays = Math.floor(worldTime / ticksInEarthDay);
    $('#daycount').html("Day " + gameDays);
    updateResourceIndicators();
    updateWorkingSystems();
    updateMessages();
    updateInventory();
    checkVictory();
    thePlayer.currentRoom.load();
    if (passOut) {
        passOut = false;
        sleepPlayer("You collapsed from exhaustion");

    }
}

function updateMessages() {
    var output = "";
    for (msg in messages) {
        output += messages[msg] + "<br>";
    }
    $('#message').html(output);
    messages = [];
}

function checkVictory() {
    if (workingShipSystems.fuel && workingShipSystems.engine && workingShipSystems.flightControl) {
        escapeVictory();
    } else if (workingShipSystems.antenna && workingShipSystems.tranceiver && workingShipSystems.codec) {
        contactVictory();
    }
}
function escapeVictory() {
    thePlayer.isAlive = false;
    victoryRoom = new room(0, 0);
    theWorld.map["shuttle"] = victoryRoom;
    victoryRoom["title"] = "Escaping The Planet";
    victoryRoom["description"] = "I've repaired my ship enough that I can take off and fly home.";
    thePlayer.currentRoom = victoryRoom;
    updateWorkingSystems();
    victoryRoom.load();
}
function contactVictory() {
    thePlayer.isAlive = false;
    victoryRoom = new room(0, 0);
    theWorld.map["shuttle"] = victoryRoom;
    victoryRoom["title"] = "Contacting Help";
    victoryRoom["description"] = "I've repaired my communications array and a rescue team will be here soon.";
    thePlayer.currentRoom = victoryRoom;
    updateWorkingSystems();
    victoryRoom.load();
}