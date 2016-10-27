/*
main.js
*/

"use strict";

var app = app || {};

app.main = {
    // --- Variables
    // canvases
    WIDTH: 1280,
    HEIGHT: 460,
    canvas: undefined,
    ctx: undefined,
    interface: undefined,
    intCtx: undefined,
    lastTime: 0,
    debug: false,
    paused: false,
    animationID: 0,
    
    // experience states
    // 1. begin
    // 2. home
    // 3. space
    // 4. underwater
    expState: undefined,
    EXP_STATE: Object.freeze({
        BEGIN: 0,
        HOME: 1,
        SPACE: 2,
        UNDERWATER: 3,
        INFO: 4
    }),
    
    // sounds
    sound: undefined,

    // scene scrolling
    speed: 50,
    quickSpeed: false,
    DIRECTION: Object.freeze({
        STATIC: 0,
        LEFT: 1,
        RIGHT: 2
    }),


    // --- Methods
    // initialise main
    init: function() {
        console.log("main.js init called");
        
		// initialise scroll canvas properties
		this.canvas = document.querySelector('#scrollCanvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
        console.log(this.canvas.width + ", " + this.canvas.height);
		this.ctx = this.canvas.getContext('2d');
        
		// initialise ui canvas properties
		this.interface = document.querySelector('#uiCanvas');
		this.interface.width = 680;
		this.interface.height = this.HEIGHT;
        console.log(this.interface.width + ", " + this.interface.height);
		this.intCtx = this.interface.getContext('2d');
        
        // initialise experience
        this.expState = this.EXP_STATE.BEGIN;
        //this.expState = this.EXP_STATE.SPACE;
        
        // initialise audio
        this.bgAudio = document.querySelector("#bgAudio");
        this.bgAudio.volume = 0.25;
        this.effectAudio = document.querySelector("#effectAudio");
        this.effectAudio.volume = 0.3;
        
        
        //-------SPRITES--------
        // populate sprites
        //create sprite
        this.alienSprite; 
        //clear last sprite drawn
        this.ctx.clearRect(0,0,150,150);
        
        this.alienSprite.update();
        
        //draw sprite at certain point
        this.alienSprite.draw(100,100);
        
        
        //-------SOUND----------
        // start with no audio
        this.sound.stopBGAudio();
        
		// start the animation loop
		this.update();
    },
    
    // animation loop
    update: function() {
        // schedule call to update()
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        // check for pause state
        if (this.paused) {
            // draw pause screen?
            return;
        }
        
        // check for time passed
        var dt = this.calculateDeltaTime();
    },
    
    // debug
	calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
		return 1/fps;
	},
    
    // play/pause
    pause: function() {
        // set boolean to true
        this.paused = true;
        
        // stop animation loop
        cancelAnimationFrame(this.animationID);
        
        // call update() once to draw paused screen
        this.update();
        
        // stop audio
        this.stopBGAudio();
    },
    
    resume: function() {
        // stop animation loop in case it's running
        cancelAnimationFrame(this.animationID);
        
        // set boolean to false
        this.paused = false;
        
        // restart loop
        this.update();
        
        // play audio
        this.sound.playBGAudio();
    },
    
    // UI & screens
    drawUI: function(ctx) {
        // intro
        
        
        // home
        
        
        // space
        
        
        // underwater
    },
    
    // audio
    stopBGAudio: function() {
        this.sound.stopBGAudio();
    },
    
    playEffect: function() {
        this.effectAudio.src = "assets/sounds/" + this.effectSounds[this.currentEffect];
        this.effectAudio.play();
        
        this.currentEffect += this.currentDirection;
        if (this.currentEffect == this.effectSounds.length || this.currentEffect == -1) {
            this.currentDirection *= -1;
            this.currentEffect += this.currentDirection;
        }
    },
    
    // mouse events
    doMouseDown: function(e) {
        // play audio
        this.sound.playBGAudio();
        
        // unpause on a click
        // just to make sure we never get stuck in a paused state
        if (this.paused) {
            this.paused = false;
            this.update();
            
            return;
        };
        
        // title screen
        if (this.gameState == this.GAME_STATE.BEGIN) {
            this.gameState = this.GAME_STATE.DEFAULT;
            
            return;
        }
        
        var mouse = getMouse(e);
    },
    
	
    
};  // end app.main