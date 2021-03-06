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
    // hook up the sound
    app.sound.init();
    app.main.sound = app.sound;
    
    // hook up the scene
    app.main.scene = app.scene;
    
    //hook up sprites
    app.main.sprite = app.sprite;
    
    //hook up emitter
    app.main.Emitter = app.Emitter;
    
    // load main app
	app.main.init();
    
    document.querySelector("#fsButton").onclick = function(){
        var discoveryExperience = document.querySelector('#experience');
        requestFullscreen(discoveryExperience);
    }; 
}

// --- Pausing/unpausing
window.onblur = function() {
    //console.log("blur at " + Date());
    
    app.main.pause();
}

window.onfocus = function() {
    //console.log("focus at " + Date());
    
    app.main.resume();
}