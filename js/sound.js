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
	var currentEffect = 0;
	var currentDirection = 1;
	var effectSounds = ["1.mp3","2.mp3","3.mp3","4.mp3","5.mp3","6.mp3","7.mp3","8.mp3"];
	
    // -- FUNCTIONS
	function init(){
        // bg sounds
		bgAudio = document.querySelector("#bgAudio");
		bgAudio.volume = 0.25;
        currentBGAudio = bgSounds[0];
        
        // sound effects
		effectAudio = document.querySelector("#effectAudio");
		effectAudio.volume = 0.3;
	}
		
    function playBGAudio() {
        //bgAudio.src = "sounds/" + bgSounds[app.main.expState - 1];
        bgAudio.play();
    }
		
	function stopBGAudio(){
		bgAudio.pause();
		//bgAudio.currentTime = 0;
	}
    
    function changeBGAudio() {
        bgAudio.pause();
        bgAudio.src = "sounds/" + bgSounds[app.main.expState - 1];
        bgAudio.play();
    }
	
	function playEffect(){
		effectAudio.src = "sounds/" + effectSounds[currentEffect];
		effectAudio.play();
        
		currentEffect += currentDirection;
		if (currentEffect == effectSounds.length || currentEffect == -1){
			currentDirection *= -1;
			currentEffect += currentDirection;
		}
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
        changeBGAudio: changeBGAudio,
        playEffect: playEffect,
        soundTest: soundTest,
    };
    
}());