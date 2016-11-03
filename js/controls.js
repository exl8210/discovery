"use strict";

// --- Create controls 
var controls = {};

// --- Key codes
controls.KEYBOARD = Object.freeze({
	"KEY_LEFT": 37, 
	"KEY_UP": 38, 
	"KEY_RIGHT": 39, 
	"KEY_DOWN": 40,
	"KEY_SPACE": 32,
	"KEY_SHIFT": 16
});

// --- Left, right movement
var moveLeft = false;
var moveRight = false;
var quick = false;

// --- Key daemon
// controls.keydown array to keep track of which keys are down
// this is called a "key daemon"
// main.js will "poll" this array every frame
// this works because JS has "sparse arrays" - not every language does
controls.keydown = [];


// --- Event listeners
window.addEventListener("keydown",function(e){
	//console.log("keydown=" + e.keyCode);
	controls.keydown[e.keyCode] = true;
    
    // check for left right movement
    if (e.keyCode == controls.KEYBOARD.KEY_RIGHT) {
        // scroll to the right

        //console.log("right key pressed");
        moveRight = true;
        app.main.isMovingRight = true;
    }
    
    if (e.keyCode == controls.KEYBOARD.KEY_LEFT) {
        // scroll to the left
        
        //console.log("left key pressed");
        moveLeft = true;
        app.main.isMovingLeft = true;
    }
    
    if (e.keyCode == controls.KEYBOARD.KEY_SHIFT) {
        // scroll to the left
        
        //console.log("left key pressed");
        quick = true;
        app.main.isMovingQuickly = true;
    }
});
	
window.addEventListener("keyup",function(e){
	//console.log("keyup=" + e.keyCode);
	controls.keydown[e.keyCode] = false;
    
	var char = String.fromCharCode(e.keyCode);
	//console.log(char);
    
	// pausing and resuming
	if (char == "p" || char == "P"){
		if (app.main.paused){
			app.main.resume();
		} else {
			app.main.pause();
		}
	}
    
    
    if (e.keyCode == controls.KEYBOARD.KEY_SHIFT) {
        quick = false;
        app.main.isMovingQuickly = false;
    }
    
    if (e.keyCode == controls.KEYBOARD.KEY_LEFT) {
        moveLeft = false;
        app.main.isMovingLeft = false;
    }
    
    if (e.keyCode == controls.KEYBOARD.KEY_RIGHT) {
        moveRight = false;
        app.main.isMovingRight = false;
    }
});