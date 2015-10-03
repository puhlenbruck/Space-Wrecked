//Item Factories
function Item() {
    this.size = 1;
    this.quantity = 1;
    this.isQuestItem = false;
}

function WaterBottle() {
    var bottle = new Item();
    bottle.name = "Water Bottle";
    return bottle;
}
function HalfEmptyBottle() {
    var bottle = new Item();
    bottle.name = "Half-Empty Bottle";
    return bottle;
}
function EmptyBottle() {
    var bottle = new Item();
    bottle.name = "Empty Bottle";
    return bottle;
}

function Ration() {
    var ration = new Item();
    ration.name = "Ration";
    ration.size = 2;
    return ration;
}
function AirCanister() {
    var canister = new Item();
    canister.name = "Air Canister";
    return canister;
}
function EmptyCanister() {
    var canister = new Item();
    canister.name = "Empty Air Canister";
    return canister;
}

//End of Item Factories