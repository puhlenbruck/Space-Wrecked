var thePlayer = {};

function player(){
    this.currentRoom = {};
}

function initPlayer(){
        thePlayer = new player();
        thePlayer.currentRoom = theWorld.map["shuttle"];
}
