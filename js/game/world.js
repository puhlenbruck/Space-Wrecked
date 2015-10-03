var theWorld = {};
window.worldTemps = ["frozen", "cold", "temperate", "warm", "hot", "scorching"];
window.worldAtmospheres = ["none", "thin breathable", "thin unbreathable",
    "thin toxic", "normal breathable", "normal unbreathable", "normal " +
            "toxic", "dense breathable", "dense unbreathable", "dense toxic"];
window.worldVegitation = ["none", "sparse", "light", "heavy", "dense"];
window.worldWildlife = ["none", "small", "diverse", "sprawling"];

var workingShipSystems = {solarPanel: true, battery: true, airRecycler: true,
    waterRecycler: true, antenna: true, tranceiver: true, codec: true,
    fuel: true, engine: true, flightControl: true, environmentalSensors: true};
var questItemChance = 0.05;
var resourceChance = 0.1;
var batteryPower = 10;

function world() {
    this.map = {};
    this.map["0,0"] = new room(0, 0);
    this.map["0,0"].title = "Crash Site";
    this.map["0,0"].description = "Ground 0. My banged up shuttle is here.  I'll have to go repair it. I should be able to find the missing parts around";
    this.map["0,0"].contents = [];
    this.map["shuttle"] = new room(0, 0); // shuttle interior
    this.map["shuttle"].description = "Inside my Shuttle I'm pretty safe.  All my equipment is here as well as my only chance of getting off this rock.  Supplies won't last forever though, and this thing is going nowhere fast.  I'll have to explore go out and explore the planet to find a hope of surviving";
    this.map["shuttle"].title = "Shuttle Interior";
    this.map["shuttle"].contents = [];

    this.getRoom = function (x, y) {
        var key = createCoordString(x, y);
        if (key in this.map) {
            return this.map[key];
        } else {
            var newRoom = new room(x, y);
            this.map[key] = newRoom;
            return newRoom;
        }
    };

    this.getNorthRoom = function () {
        var startRoom = thePlayer.currentRoom;
        var newX = startRoom.loc[0];
        var newY = startRoom.loc[1] + 1;
        var newRoom = this.getRoom(newX, newY);
        return newRoom;
    };
    this.getEastRoom = function () {
        var startRoom = thePlayer.currentRoom;
        var newX = startRoom.loc[0] + 1;
        var newY = startRoom.loc[1];
        var newRoom = this.getRoom(newX, newY);
        return newRoom;
    };
    this.getSouthRoom = function () {
        var startRoom = thePlayer.currentRoom;
        var newX = startRoom.loc[0];
        var newY = startRoom.loc[1] - 1;
        var newRoom = this.getRoom(newX, newY);
        return newRoom;
    };
    this.getWestRoom = function () {
        var startRoom = thePlayer.currentRoom;
        var newX = startRoom.loc[0] - 1;
        var newY = startRoom.loc[1];
        var newRoom = this.getRoom(newX, newY);
        return newRoom;
    };
}

function room(x, y) {
    this.loc = [x, y];
    this.title = "Outside (" + x + "," + y + ")";
    this.lastVisited = "never";
    this.lastChanged = "never";
    this.contents = [];
    var questItem = generateQuestItem();
    if (typeof (questItem) !== "undefined") {
        this.contents[0] = questItem;
    }
    this.contents = this.contents.concat(generateResourceDrop());
    this.changes = [];
    this.description = fluff(this);

    this.enter = function () {
        thePlayer.currentRoom = this;
        action(movementTime);
        this.lastVisited = worldTime;
    }
    this.load = function () {
        displayRoomDescription(this);
        setRoomTitle(this.title);
        if (this.title === "Shuttle Interior") {
            setMovementOptions("<a onclick=exitShuttle()>Outside</a>.");
        } else if (this.title === "Crash Site") {
            setMovementOptions("<a onclick=moveNorth()>North</a>, <a onclick=moveSouth()>South</a>, <a onclick=moveEast()>East</a>, <a onclick=moveWest()>West</a>. <a onclick=enterShuttle()>Enter Shuttle</a>.");
        } else if (!thePlayer.isAlive) {
            setMovementOptions("");
        } else {
            setMovementOptions("<a onclick=moveNorth()>North</a>, <a onclick=moveSouth()>South</a>, <a onclick=moveEast()>East</a>, <a onclick=moveWest()>West</a>.");
        }
        showRoomContents(this.contents);
        updateLocalOptions();
    }
    this.removeItem = function (item) {
        var removed = jQuery.extend(true, {}, item);
        item.quantity--;
        if (item.quantity < 1) {
            var index = this.contents.indexOf(item);
            this.contents.splice(index, 1);
        }
        removed.quantity = 1;
        return removed;
    }

    this.addItem = function (item) {
        var unique = true;
        for (var index in this.contents) {
            if (this.contents[index].name === item.name) {
                this.contents[index].quantity += item.quantity;
                unique = false;
                break;
            }
        }
        if (unique) {
            this.contents.push(item);
        }
    };
}

function generateResourceDrop() {
    var drops = [];
    if (Math.random() < resourceChance) {
        drops.push(Ration());
    }
    if (Math.random() < resourceChance) {
        drops.push(WaterBottle());
    }
    if (Math.random() < resourceChance) {
        drops.push(AirCanister());
    }
    return drops;
}

function generateQuestItem() {
    if (Math.random() < questItemChance) {
        possibleItems = [];
        for (var system in workingShipSystems) {
            if (!workingShipSystems[system]) {
                possibleItems.push(system);
            }
        }
        itemName = possibleItems[getRandomInt(0, possibleItems.length)];
        item = new Item();
        item.name = itemName;
        item.size = 5;
        item.isQuestItem = true;
        return item;
    }
}

function updateWorkingSystems() {
    var workingSystems = "<div>Working:<ul>";
    var brokenSystems = "<div>Broken:<ul>";
    for (var system in workingShipSystems) {
        if (workingShipSystems[system]) {
            workingSystems += "<li>" + nameOfItem(system) + "</li>";
        } else {
            brokenSystems += "<li>" + nameOfItem(system) + "</li>";
        }
    }
    theWorld.map["shuttle"].systems = [];
    theWorld.map["shuttle"].systems[0] = workingSystems + "</ul></div>";
    theWorld.map["shuttle"].systems[1] = brokenSystems + "</ul></div>";
}

function updateLocalOptions() {
    var optionsString = "";
    var stuff = thePlayer.currentRoom.contents;
    for (item in stuff) {
        var time = 0;
        if ("pickupTime" in stuff) {
            time = stuff[item].pickupTime;
        }
        var str = "<span class='label radius secondary'>" + time + "</span> <a onclick='grabItem(this)' objectname='" + stuff[item].name + "' time='" + time + "'>Pick up " + nameOfItem(stuff[item].name) + "</a>";
        optionsString += str + "<br />";
    }
    if (thePlayer.currentRoom === theWorld.map["shuttle"]) {
        optionsString += shuttleOptions();
    }
    optionsString += "<span class='label radius secondary'>16</span> <a onclick='sleepPlayer(\"You decided to rest\")'>Sleep</a>";
    $('#local-options').html(optionsString);
}

function shuttleOptions() {
    var str = "";
    str += waterRefillOption();
    str += airRefillOption();
    str += environmentScanOption();
    str += shuttleRepairOptions();
    return str;
}

function  waterRefillOption() {
    var str = "";
    if (workingShipSystems.waterRecycler && shipHasPower() && (thePlayer.has(EmptyBottle().name) || thePlayer.has(HalfEmptyBottle().name))) {
        str += "<span class='label radius secondary'>1</span> <a onclick='fillBottle()'>Fill a Water Bottle</a><br />";
    }
    return str;
}
function airRefillOption() {
    var str = "";
    if (workingShipSystems.airRecycler && shipHasPower() && thePlayer.has(EmptyCanister().name)) {
        str += "<span class='label radius secondary'>1</span> <a onclick='fillCanister()'>Fill an Air Canister</a><br />";
    }
    return str;
}
function environmentScanOption() {
    var str = "";
    if (workingShipSystems.environmentalSensors && shipHasPower()) {
        str += "<span class='label radius secondary'>2</span> <a onclick='scanWorld()'>Scan the Atmosphere</a><br />";
    }
    return str;
}
function shuttleRepairOptions() {
    var str = "";
    var questItem = thePlayer.hasQuestItem()
    if (!(typeof (questItem) === "undefined")) {
        var str = "<span class='label radius secondary'>5</span> <a onclick='installItem(this)' objectname='" + questItem.name + "'>Install  " + nameOfItem(questItem.name) + "</a><br />";
    }
    return str;
}

function scanWorld() {
    messages.push("The atmosphere on this planet is " + theWorld.atmosphere);
    action(2);
}

function installItem(element) {
    var attrs = element.attributes;
    var name = attrs["objectname"];
    workingShipSystems[name.value] = true;
    var inv = thePlayer.inventory;
    for (var index in inv) {
        if (inv[index].name === name.value) {
            thePlayer.removeFromInventory(inv[index]);
            break;
        }
    }
    action(5);
}

function grabItem(element) {
    var attrs = element.attributes;
    var stuff = thePlayer.currentRoom.contents;
    var name = attrs["objectname"];
    for (item in stuff) {
        if (stuff[item].name === name.value) {
            thePlayer.pickup(stuff[item]);
            break;
        }
    }
}

function shipHasPower() {
    if (workingShipSystems.solarPanel) {
        return true;
    } else if (workingShipSystems.battery && batteryPower > 0) {
        batteryPower--;
        return true;
    } else {
        return false;
    }
}

function createCoordString(x, y) {
    return x + "," + y;
}

function moveNorth() {
    theWorld.getNorthRoom().enter();
}
function moveEast() {
    theWorld.getEastRoom().enter();
}
function moveSouth() {
    theWorld.getSouthRoom().enter();
}
function moveWest() {
    theWorld.getWestRoom().enter();
}
function exitShuttle() {
    theWorld.getRoom(0, 0).enter();
}
function enterShuttle() {
    theWorld.map["shuttle"].enter();
}

function initWorld() {
    theWorld = new world();
    theWorld.temperature = window.worldTemps[getRandomInt(0, window.worldTemps.length)];
    theWorld.atmosphere = window.worldAtmospheres[getRandomInt(0, window.worldAtmospheres.length)];
    theWorld.vegetation = window.worldVegitation[getRandomInt(0, window.worldVegitation.length)];
    theWorld.wildlife = window.worldWildlife[getRandomInt(0, window.worldWildlife.length)];
    delete window.worldTemps;
    delete window.worldAtmospheres;
    delete window.worldVegitation;
    delete window.worldWildlife;
    breakSystems();
    updateWorkingSystems();
    initStash();
}

function initStash() {
    var stash = [];
    var bottles = WaterBottle();
    bottles["quantity"] = 10;
    stash.push(bottles);
    var rations = Ration();
    rations["quantity"] = 10;
    stash.push(rations);
    var canisters = AirCanister();
    canisters["quantity"] = 10;
    stash.push(canisters);
    theWorld.map["shuttle"].contents = stash;
}

function breakSystems() {
    for (var system in workingShipSystems) {
        if (Math.random() < 0.8) {
            workingShipSystems[system] = false;
        }
    }
    if (workingShipSystems.antenna && workingShipSystems.tranceiver && workingShipSystems.codec) {
        workingShipSystems.antenna = false;
        workingShipSystems.tranceiver = false;
        workingShipSystems.codec = false;
    }
    if (workingShipSystems.fuel && workingShipSystems.engine && workingShipSystems.flightControl) {
        workingShipSystems.fuel = false;
        workingShipSystems.engine = false;
        workingShipSystems.flightControl = false;
    }
}

function showRoomContents(contents) {
    var itemsString = "";
    if (thePlayer.currentRoom == theWorld.map["shuttle"]) {
        itemsString += theWorld.map["shuttle"].systems[0];
        itemsString += theWorld.map["shuttle"].systems[1];
    }
    if (contents.length === 0) {
        itemsString += "<p>There is nothing of use here.</p>";
    } else {
        for (var item in contents) {
            itemsString += "<p>" + nameOfItem(contents[item].name);
            if (contents[item].quantity > 1) {
                itemsString += " (" + contents[item].quantity + ")";
            }
            itemsString += "</p>";
        }
    }
    $('#objects')[0].innerHTML = itemsString;
}

function displayRoomDescription(room) {
    moveDesc = "<p>" + moveWords(room) + "</p>" + room.description;
    $('#narration').html(moveDesc);
}

function setRoomTitle(str) {
    $('#area-title').html(str);
}

function setMovementOptions(str) {
    $('#movement-options').html(str);
}