// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//returns a display name mathing an internal item name
function nameOfItem(str) {
    if (str === "") {
        return "";
    }
    if (str === "solarPanel") {
        return "Solar Panel";
    }
    if (str === "battery") {
        return "Battery";
    }
    if (str === "airRecycler") {
        return "Air Recycler";
    }
    if (str === "waterRecycler") {
        return "Water Recycler";
    }
    if (str === "antenna") {
        return "Antenna";
    }
    if (str === "tranceiver") {
        return "Tranceiver";
    }
    if (str === "codec") {
        return "Communications Codec";
    }
    if (str === "fuel") {
        return "Fuel Cell";
    }
    if (str === "engine") {
        return "Engine";
    }
    if (str === "flightControl") {
        return "Flight Control";
    }
    if (str === "environmentalSensors") {
        return "Environmental Sensors";
    }
    return str;
}