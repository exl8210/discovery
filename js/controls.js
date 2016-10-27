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

// --- Key daemon
// controls.keydown array to keep track of which keys are down
// this is called a "key daemon"
// main.js will "poll" this array every frame
// this works because JS has "sparse arrays" - not every language does
controls.keydown = [];


// --- Event listeners
window.addEventListener("keydown",function(e){
	console.log("keydown=" + e.keyCode);
	controls.keydown[e.keyCode] = true;
});
	
window.addEventListener("keyup",function(e){
	console.log("keyup=" + e.keyCode);
	controls.keydown[e.keyCode] = false;
    
	var char = String.fromCharCode(e.keyCode);
	
	// pausing and resuming
	if (char == "p" || char == "P"){
		if (app.main.paused){
			app.main.resumeGame();
		} else {
			app.main.pauseGame();
		}
	}
    
    // moving left and right
    if (char == "KEY_RIGHT") {
        // scroll to the right
        
        app.scene.changeDirection("r");
    }
    
    if (char == "KEY_LEFT") {
        // scroll to the left
        
        app.scene.changeDirection("l");
    }
    
    // moving quicker
    if (char == "KEY_SHIFT") {
        // turn on 'speedy' variable
        
        app.scene.toggleQuick();
    }
});

