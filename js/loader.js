/*
loader.js
variable 'app' is in global scope - i.e. a property of window.
app is our single global object literal - all other functions and properties of 
the game will be properties of app.
*/

"use strict";

// --- Create app
// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

// --- Load main app
window.onload = function(){
	//console.log("window.onload called");
    
    // hook up the sound
    app.sound.init();
    app.main.sound = app.sound;
    
    // hook up the scene
    //app.scene.loop();
    app.main.scene = app.scene;
    
    // load main app
	app.main.init();
}

// --- Pausing/unpausing
window.onblur = function() {
    console.log("blur at " + Date());
    
    app.main.pause();
}

window.onfocus = function() {
    console.log("focus at " + Date());
    
    app.main.resume();
}