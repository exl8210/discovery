// sound.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// define the .sound module and immediately invoke it in an IIFE
app.main = {
    // --- Variables
    // canvases
    WIDTH: 1280,
    HEIGHT: 460,
    canvas: undefined,
    ctx: undefined,
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
    
    // scene
    //scene: undefined,
    room: {
        width: 1280,
        height: 460,
        map: undefined,
    },
    STEP: undefined,
    
    // camera
    camera: {
        // camera position
        xView: 0,
        yView: 0,
        
        // viewport dimensions
        wView: 680,
        hView: 460,
        
        // rect representing the viewport
        screenView: undefined,
        worldRect: undefined,
    },
    
    // scene scrolling
    INIT_SPEED: 2,
    QUICK_SPEED: 10,
    speed: undefined,
    isMovingRight: false,
    isMovingLeft: false,
    isMovingQuickly: false,
    

    // --- Methods
    // initialise main
    init: function() {
        // --- initialise scroll canvas properties
		this.canvas = document.querySelector('#scrollCanvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
        //console.log(this.canvas.width + ", " + this.canvas.height);
		this.ctx = this.canvas.getContext('2d');
        
        // --- initialise experience
        this.expState = this.EXP_STATE.BEGIN;
        //this.expState = this.EXP_STATE.SPACE;
        
        // hook up events
        this.canvas.onmousedown = this.doMouseDown.bind(this);
        
        // --- initialise audio
        this.bgAudio = document.querySelector("#bgAudio");
        this.bgAudio.volume = 0.25;
        this.effectAudio = document.querySelector("#effectAudio");
        this.effectAudio.volume = 0.3;
        
        // --- initialise scene
        // map
        this.room.map = this.scene.map;
        
        // generate large image texture --> the first one should be HOME
        this.room.map.generate(this.EXP_STATE.HOME);
        // *** EVERY TIME ANOTHER SCENE IS SELECTED, WE HAVE TO REGENERATE THE MAP ***
        // capture selection --> pass into generate using: 
        // this.room.map.generate(this.expState);
        
        // movement
        this.speed = this.INIT_SPEED;
        
        // viewport rectangle
        this.camera.screenView = new this.scene.Viewport(this.camera.xView, this.camera.yView, this.camera.wView, this.camera.hView);
        
        // world boundary rectangle
        this.camera.worldRect = new this.scene.Viewport(0, 0, this.room.width, this.room.height);
        
        console.dir(this.camera);
        
        //-------SOUND----------
        // start with no audio
        this.sound.stopBGAudio();
        
		// start the animation loop
		this.update();
    },
    
    // --- animation loop
    update: function() {
        //console.log("update loop called");
        
        // schedule call to update()
        this.animationID = requestAnimationFrame(this.update.bind(this));
        
        // check for pause state
        if (this.paused) {
            this.drawPauseScreen(this.ctx);
            return;
        }
        
        // check for time passed
        var dt = this.calculateDeltaTime();
        
        // check keypress for scrolling
        var cam = this.camera;
        
        if (this.expState != this.EXP_STATE.BEGIN) {
            if (this.isMovingQuickly) {
                this.speed = this.QUICK_SPEED;
            }
            else {
                this.speed = this.INIT_SPEED;
            }
            
            if (this.isMovingRight) {
                if (cam.xView < (this.room.map.width - this.WIDTH)) {
                    cam.xView += this.speed;
                    console.log(this.camera.xView);
                }
            }
            
            if (this.isMovingLeft) {
                if (cam.xView > 0) {
                    cam.xView -= this.speed;
                    console.log(this.camera.xView);
                }
            }
        }
        
        // draw scene
        this.drawScene(this.ctx);
        this.drawUI(this.ctx);
    },
    
    // debug
	calculateDeltaTime: function(){
		var now,fps;
		now = performance.now(); 
		fps = 1000 / (now - this.lastTime);
		fps = clamp(fps, 12, 60);
		this.lastTime = now; 
        this.STEP = 1/fps;
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
    
    // set up scene
    drawScene: function(ctx) {
        // clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.expState != this.EXP_STATE.BEGIN) {
            // redraw all objects
            this.room.map.draw(ctx, this.camera.xView, this.camera.yView);	
        }
        
    },
    
    moveLeft: function() {
        var cam = this.camera;
        console.log("move left");
        
        cam.xView -= this.speed;
        cam.screenView.set(cam.xView, cam.yView);
        
    },

    moveRight: function() {
        var cam = this.camera;
        console.log("move right");

        cam.xView += this.speed;
        cam.screenView.set(cam.xView, cam.yView);
        
        console.log(this.speed, cam.xView);
    },
    
    // === TESSSSTTTTTT
    test: function() {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.canvas.width/2, this.canvas.height/2, 50, 0, Math.PI*2, false);
        this.ctx.closePath(0);
        this.ctx.fillStyle = "red";
        this.ctx.fill();
        this.ctx.restore();
    },
    
    // UI & screens
    drawUI: function(ctx) {
        // intro
        if (this.expState == this.EXP_STATE.BEGIN) {
            ctx.save();
            ctx.fillStyle = "pink";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            ctx.fillText(this.ctx, "D I S C O V E R Y", 200, 200, "32pt helvetica", "#FFFFFF");
            ctx.fillText(this.ctx, "Click anywhere to start!", this.canvas.width/2, this.canvas.height/2 + 100, "16pt helvetica", "#232323");
            ctx.restore();
        }
    },
    
    // pause
    drawPauseScreen: function(ctx) {
        ctx.save();
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "white";
        ctx.fillText(this.ctx, "paused.", this.WIDTH/2, this.HEIGHT/2, "40pt helvetica", "white");
        ctx.restore();
        //console.log("paused drawn");
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
        if (this.expState == this.EXP_STATE.BEGIN) {
            this.expState = this.EXP_STATE.SPACE;
            
            return;
        }
        
        var mouse = getMouse(e);
    },
    
};