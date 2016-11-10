// sound.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// define the .sound module and immediately invoke it in an IIFE
app.sound = (function(){
    // -- VARIABLES
	console.log("sound.js module loaded");
    
    // bg audio
	var bgAudio = undefined;
    var bgSounds = ["space.mp3", "campfire.mp3", "underwater.mp3"];
    var currentBGAudio = undefined;
    
    // effect audio
	var effectAudio = undefined;
	var effectSounds = ["alien.mp3","fire.mp3","bubble.mp3"];
	var currentEffect = undefined;
    
    // -- FUNCTIONS
	function init(){
        // bg sounds
		bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume = 0.2;
        currentBGAudio = bgSounds[0];
        
        // sound effects
		effectAudio = document.querySelector("#effectAudio");
		effectAudio.volume = 0.3;
	}
		
    function playBGAudio() {
        //bgAudio.src = "sounds/" + bgSounds[app.main.expState - 1];
        bgAudio.play();
    }
    
    function playEffect(){
		//effectAudio.src = "sounds/" + effectSounds[currentEffect];
		effectAudio.play();
        
	}
		
	function stopBGAudio(){
		bgAudio.pause();
		//bgAudio.currentTime = 0;
	}
    
    function stopEffect(){
        effectAudio.pause();
    }
    
    function changeAudio() {
        bgAudio.pause();
        effectAudio.pause();
        
        effectAudio.src="sounds/" + effectSounds[app.main.expState -1 ];
        bgAudio.src = "sounds/" + bgSounds[app.main.expState - 1];
        bgAudio.play();
        effectAudio.play();
    }
	
    
    function soundTest() {
        console.log("sound: function test");
    }
    
	// export a public interface to this module
    // the REVEALING MODULE PATTERN --> reveal public references to methods inside the module's scope
	return {
        init: init,
        playBGAudio: playBGAudio,
        stopBGAudio: stopBGAudio,
        changeAudio: changeAudio,
        stopEffect: stopEffect,
        playEffect: playEffect,
        soundTest: soundTest,
    };
    
}());