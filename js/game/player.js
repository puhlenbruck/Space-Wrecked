var thePlayer = {};

function player(){
    this.currentRoom = {};
}

function initPlayer(){
        thePlayer = new player();
        theWorld.map["shuttle"].enter();
}
