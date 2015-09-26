var worldTime = 0;
function tick(){
    worldTime++;
    update();
    checkDeath();
	checkVictory();
}