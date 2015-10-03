var thePlayer = {};

var waterStatus = ["Saturated", "Moist", "Damp", "Parched", "Dry"];
var airStatus = ["Fresh", "Thin", "No Air!"];
var foodStatus = ["Sated", "Full", "Peckish", "Hungry", "Starving"];
var sleepStatus = ["Rested", "Awake", "Drowsy", "Tired", "Exausted"];

var statusClass = ["ideal", "good", "okay", "suffering", "danger"];
var airStatusClass = ["ideal", "suffering", "danger"];

var airRatio = 1;
var waterRatio = 10;
var foodRatio = 20;
var sleepRatio = 15;

var eatingRate = 15;
var drinkingRate = 12;
var breathingRate = 12;


function player() {
    this.currentRoom = {};
    this.carryCapacity = 20;
    this.encumbrance = 0;
    this.inventory = [];

    this.isSleeping = false;
    this.isAlive = true;
    this.timeWithoutAir = 0;
    this.timeWithoutWater = 0;
    this.timeWithoutFood = 0;
    this.timeWithoutSleep = 0;

    this.useResources = function () {
        if (this.isSleeping) {
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
    };


    this.breathe = function () {
        if (thePlayer.currentRoom == theWorld.map["shuttle"]) {
        } else {
            this.depleteAir();
            if (theWorld.atmosphere.match(/ breath/) || thePlayer.has(AirCanister().name)) {
            } else {
                this.timeWithoutAir++;
            }
        }
    };

    this.drink = function () {
        if (this.hasWater()) {
            this.timeWithoutWater = 0;
            this.depleteWater();
        } else {
            this.timeWithoutWater++;
        }
    };

    this.eat = function () {
        if (this.hasFood() && this.timeWithoutFood > eatingRate) {
            this.timeWithoutFood = 0;
            this.depleteFood();
        } else {
            this.timeWithoutFood++;
        }
    };

    this.pickup = function (item) {
        if (item.size + this.encumbrance > this.carryCapacity) {
            messages.push("You are carrying too much");
            action(0);
        } else {
            this.addToInventory(this.currentRoom.removeItem(item));
            action(item["pickupTime"]);
        }
    };

    this.has = function (itemName) {
        for (index in this.inventory) {
            if (this.inventory[index].name === itemName) {
                return true;
            }
        }
        return false;
    };

    this.hasQuestItem = function () {
        for (index in this.inventory) {
            if (this.inventory[index].isQuestItem) {
                return this.inventory[index];
            }
        }
    };

    this.addToInventory = function (item) {
        var unique = true;
        for (var index in this.inventory) {
            if (this.inventory[index].name === item.name) {
                this.inventory[index].quantity += item.quantity;
                unique = false;
                break;
            }
        }
        if (unique) {
            this.inventory.push(item);
        }
        this.encumbrance += item.size * item.quantity;
    };

    this.removeFromInventory = function (item) {
        var removed = jQuery.extend(true, {}, item);
        item.quantity--;
        if (item.quantity < 1) {
            var index = this.inventory.indexOf(item);
            this.inventory.splice(index, 1);
        }
        removed.quantity = 1;
        this.encumbrance -= item.size;
        return removed;
    };

    this.hasWater = function () {
        var available = false;
        for (var i in this.inventory) {
            var currItem = this.inventory[i].name;
            if (currItem === WaterBottle().name || currItem === HalfEmptyBottle().name) {
                available = true;
                break;
            }
        }
        return available;
    };

    this.depleteWater = function () {
        var bottle = this.selectBottleToDrink();
        if (!("drinks" in bottle)) {
            bottle["drinks"] = 0;
        }
        if (bottle["drinks"] + 1 >= drinkingRate) {
            bottle["drinks"] = 0;
            this.removeFromInventory(bottle);
            newBottle = {};
            if (bottle["name"] === HalfEmptyBottle().name) {
                newBottle = EmptyBottle();
            } else if(bottle["name"] === WaterBottle().name){
                newBottle = HalfEmptyBottle();
            }
            this.addToInventory(newBottle);
        } else {
            bottle["drinks"]++;
        }
    };

    this.selectBottleToDrink = function () {
        var bottle = {};
        for (var i in this.inventory) {
            if (this.inventory[i].name === HalfEmptyBottle().name) {
                bottle = this.inventory[i];
                break;
            } else if (this.inventory[i].name === WaterBottle().name) {
                bottle = this.inventory[i];
            }
        }
        return bottle;
    };

    this.hasFood = function () {
        var available = false;
        for (var i in this.inventory) {
            var currItem = this.inventory[i].name;
            if (currItem === Ration.name) {
                available = true;
                break;
            }
        }
        return available;
    };

    this.depleteFood = function () {
        for (var i in this.inventory) {
            var currItem = this.inventory[i].name;
            if (currItem === Ration().name) {
                this.removeFromInventory(this.inventory[i]);
                break;
            }
        }
    };
    this.depleteAir = function () {
        if (this.has("Air Canister")) {
            for (var index in this.inventory) {
                if (this.inventory[index].name === AirCanister().name) {
                    if (!("uses" in this.inventory[index])) {
                        this.inventory[index].uses = 0;
                    }
                    if (this.inventory[index].uses + 1 >= breathingRate) {
                        this.inventory[index].uses = 0;
                        this.removeFromInventory(this.inventory[index]);
                        this.addToInventory(EmptyCanister());
                    } else {
                        this.inventory[index].uses++;
                    }
                }
            }
        }
    };
}

function fillBottle() {
    var inv = thePlayer.inventory;
    var bottleIndex = 0;
    for (var index in inv) {
        if (inv[index].name === EmptyBottle().name) {
            bottleIndex = index;
            break;
        } else if (inv[index].name === HalfEmptyBottle().name) {
            bottleIndex = index;
        }
    }
    thePlayer.removeFromInventory(inv[bottleIndex]);
    thePlayer.addToInventory(WaterBottle());
    action(1);
}

function fillCanister() {
    var inv = thePlayer.inventory;
    var canisterIndex = 0;
    for (var index in inv) {
        if (inv[index].name === EmptyCanister().name) {
            canisterIndex = index;
            break;
        }
    }
    thePlayer.removeFromInventory(inv[canisterIndex]);
    thePlayer.addToInventory(AirCanister());
    action(1);
}

function updateInventory() {
    var displayString = "";
    for (var i in thePlayer.inventory) {
        var itemStr = "";
        var name = thePlayer.inventory[i].name;
        var amount = thePlayer.inventory[i].quantity;
        itemStr += "<li><a onclick='drop(this)' objectname='" + name + "'>" + nameOfItem(name);
        if (amount > 1) {
            itemStr += " (" + amount + ")";
        }
        itemStr += "</a></li>";
        displayString += itemStr;
    }
    $('#inventory').html(displayString);
}

function updateResourceIndicators() {
    var airThreshold = Math.ceil(thePlayer.timeWithoutAir / airRatio);
    var waterThreshold = Math.ceil(thePlayer.timeWithoutWater / waterRatio);
    var foodThreshold = Math.ceil(thePlayer.timeWithoutFood / foodRatio);
    var sleepThreshold = Math.ceil(thePlayer.timeWithoutSleep / sleepRatio);

    if (airThreshold > airStatus.length - 1) {
        killPlayer("You have suffocated");
        airThreshold = airStatus.length - 1;
    }
    $('#air-status').html(airStatus[airThreshold]);
    $('#air-status').removeClass('ideal good okay suffering danger');
    $('#air-status').addClass(airStatusClass[airThreshold]);


    if (waterThreshold > waterStatus.length - 1) {
        killPlayer("You have died of thirst.");
        waterThreshold = waterStatus.length - 1;
    }
    $('#water-status').html(waterStatus[waterThreshold]);
    $('#water-status').removeClass('ideal good okay suffering danger');
    $('#water-status').addClass(statusClass[waterThreshold]);

    if (foodThreshold > foodStatus.length - 1) {
        killPlayer("You have starved to death.");
        foodThreshold = foodStatus.length - 1;
    }
    $('#food-status').html(foodStatus[foodThreshold]);
    $('#food-status').removeClass('ideal good okay suffering danger');
    $('#food-status').addClass(statusClass[foodThreshold]);

    if (sleepThreshold > sleepStatus.length - 1) {
        passOut = true;
    } else {
        $('#sleep-status').html(sleepStatus[sleepThreshold]);
        $('#sleep-status').removeClass('ideal good okay suffering danger');
        $('#sleep-status').addClass(statusClass[sleepThreshold]);
    }

}

function drop(element) {
    var attrs = element.attributes;
    var stuff = thePlayer.inventory;
    var name = attrs["objectname"];
    for (var item in stuff) {
        if (stuff[item].name === name.value) {
            thePlayer.currentRoom.addItem(thePlayer.removeFromInventory(stuff[item]));
            break;
        }
    }
    action(0);
}

function killPlayer(msg) {
    messages.push(msg);
    thePlayer.isAlive = false;
}

function sleepPlayer(msg) {
    messages.push(msg);
    messages.push("You slept for 8 hours");
    thePlayer.isSleeping = true;
    action(16);
    thePlayer.isSleeping = false;
}

function initPlayer() {
    thePlayer = new player();
    initInventory();
    thePlayer.currentRoom = theWorld.map["shuttle"];
    displayRoomDescription(thePlayer.currentRoom);
    setRoomTitle(thePlayer.currentRoom.title);
    setMovementOptions("<a onclick=exitShuttle()>Outside</a>.");
    showRoomContents(thePlayer.currentRoom.contents);
    this.lastVisited = worldTime;
}

function initInventory() {
    var bottles = WaterBottle();
    bottles["quantity"] = 5;
    thePlayer.addToInventory(bottles);
    var rations = Ration();
    rations["quantity"] = 5;
    thePlayer.addToInventory(rations);
    var canisters = new AirCanister();
    canisters["quantity"] = 5;
    thePlayer.addToInventory(canisters);
}