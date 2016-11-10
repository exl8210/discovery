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
    topCanvas: undefined,
    topCtx: undefined,
    lastTime: 0,
    debug: false,
    paused: false,
    animationID: 0,
    
    // experience states
    // 1. begin
    // 2. campfire
    // 3. space
    // 4. underwater
    expState: undefined,
    EXP_STATE: Object.freeze({
        BEGIN: 0,
        SPACE: 1,
        CAMPFIRE: 2,
        UNDERWATER: 3,
        INFO: 4
    }),
    
    // sounds
    sound: undefined,
    
    // scene
    room: {
        width: 1280,
        height: 460,
        map: undefined,
        offset: 0,  // used to check for object collision boundaries on scroll
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
    
    // follower
    follower: {
        // object dimensions
        width: 30,
        height: 20,
        
        // position properties
        xPos: undefined,
        yPos: undefined,
        xSpeed: undefined,
        ySpeed: undefined,
        step: 1,
        isFollowing: false,
        targetX: undefined,
        targetY: undefined,
    },
    
    
    Emitter: undefined,
    exhaust: undefined,
    

    // --- Methods
    // initialise main
    init: function() {
        // --- initialise scroll canvas properties
		this.canvas = document.querySelector('#scrollCanvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
		this.ctx = this.canvas.getContext('2d');
        
        // --- initialise top canvas properties
		this.topCanvas = document.querySelector('#topCanvas');
		this.topCanvas.width = this.WIDTH;
		this.topCanvas.height = this.HEIGHT;
		this.topCtx = this.topCanvas.getContext('2d');
        
        // --- initialise experience
        this.expState = this.EXP_STATE.BEGIN;
        //this.expState = this.EXP_STATE.SPACE;
        
        // hook up events
        this.topCanvas.onmousedown = this.canvas.onmousedown = this.doMouseDown.bind(this);
        
        // --- initialise audio
        this.bgAudio = document.querySelector("#bgAudio");
        this.bgAudio.volume = 0.2;
        this.effectAudio = document.querySelector("#effectAudio");
        this.effectAudio.volume = 0.3;
        
        // --- initialise scene
        // map
        this.room.map = this.scene.map;
        
        // generate large image texture --> the first one should be CAMPFIRE
        this.room.map.generate(this.EXP_STATE.SPACE);
        // *** EVERY TIME ANOTHER SCENE IS SELECTED, WE HAVE TO REGENERATE THE MAP ***
        // capture selection --> pass into generate using: 
        // this.room.map.generate(this.expState);
        
        // movement
        this.speed = this.INIT_SPEED;
        
        // viewport rectangle
        this.camera.screenView = new this.scene.Viewport(this.camera.xView, this.camera.yView, this.camera.wView, this.camera.hView);
        
        // world boundary rectangle
        this.camera.worldRect = new this.scene.Viewport(0, 0, this.room.width, this.room.height);
        
        //console.dir(this.camera);
        
        // follower
        this.follower.xPos = getRandom(0, this.canvas.width);
        this.follower.yPos = getRandom(0, this.canvas.height);
        this.follower.xSpeed = getRandom(-2.0, 2.0);
        this.follower.ySpeed = getRandom(-2.0, 2.0);
    
        //Emitter
        this.exhaust = new this.Emitter();
        this.exhaust.numParticles = 100;
        this.exhaust.createParticles({x:100, y:100});
    
        
        //-------SOUND----------
        // start with no audio
        this.sound.stopBGAudio();
        this.sound.stopEffect();
        
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
            this.drawPauseScreen(this.topCtx);
            return;
        }
        
        // check for time passed
        var dt = this.calculateDeltaTime();
        
        // set up sprite references
        var sprite = this.sprite;
        var activeSprite;
        
        switch(this.expState) {
            case this.EXP_STATE.CAMPFIRE:
                activeSprite = sprite.fire;
                break;

            case this.EXP_STATE.SPACE:
                activeSprite = sprite.alien;
                break;

            case this.EXP_STATE.UNDERWATER:
                activeSprite = sprite.fish;
                break;
        }
        
        // check keypress for scrolling
        // scroll background one direction and sprites in the other direction
        // (illusion of movement :P)
        var cam = this.camera;
        
        if (this.expState != this.EXP_STATE.BEGIN) {
            // toggle between quick and regular speed
            if (this.isMovingQuickly) {
                this.speed = this.QUICK_SPEED;
            }
            else {
                this.speed = this.INIT_SPEED;
            }
            
            // if right key is pressed...
            if (this.isMovingRight) {
                // check for right boundary
                if (cam.xView < (this.room.map.width - this.WIDTH)) {
                    // move camera
                    cam.xView += this.speed;
                    
                    // change world offset
                    this.room.offset++;
                    
                    // move sprits and objects
                    activeSprite.xPos -= this.speed;
                    this.follower.xPos -= this.speed;
                }
                else {
                    // reposition camera at edge
                    cam.xView = this.room.map.width - this.WIDTH;
                    
                    // make sure offset is an appropriate amount
                    this.room.offset = this.room.map.width - this.follower.width;
                }
            }
            
            // if left key is pressed...
            if (this.isMovingLeft) {
                // check for left boundary
                if (cam.xView > 0) {
                    // move camera
                    cam.xView -= this.speed;
                    
                    // change world offset
                    this.room.offset--;
                    
                    // move sprits and objects
                    activeSprite.xPos += this.speed;
                    this.follower.xPos += this.speed;
                }
                else {
                    // reposition camera at edge
                    cam.xView = 0;
                    
                    // make sure offset is an appropriate amount
                    this.room.offset = 0;
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
        this.stopEffectAudio();
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
        this.sound.playEffect();
    },
    
    // set up scene
    drawScene: function(ctx) {
        // clear the entire canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.topCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // refresh map
        if (this.expState != this.EXP_STATE.BEGIN) {
            this.room.map.draw(ctx, this.camera.xView, this.camera.yView);	
        }
        
        // draw follower
        this.drawFollower(ctx);
    },
    
    // follower moving to target (mouse click)
    drawFollower: function(ctx) {        
        var f = this.follower;
        
        if (f.isFollowing) {
            if (f.xPos < f.targetX - f.width/2) {  // according to obj's centre
                f.xPos += f.step;
            }
            else if (f.xPos > f.targetX - f.width/2) {
                f.xPos -= f.step;
            }
            
            if (f.yPos < f.targetY - f.height/2) {
                f.yPos += f.step;
            }
            else if (f.yPos > f.targetY - f.height/2) {
                f.yPos -= f.step;
            }
            
            if(this.isWithin(f.xPos, f.yPos, f)) {
                f.isFollowing = false;
                
                f.xSpeed *= -1;
                f.ySpeed *= -1;
            }
        }
        else {
            // move object
            f.xPos += f.xSpeed;
            f.yPos += f.ySpeed;
            
            // collision detection (relative to map)
            if (f.xPos <= 0 - this.room.offset) {
                f.xPos = 0;
                f.xSpeed *= -1;
            }
            
            if (f.xPos >= this.room.map.width - f.width) {
                f.xPos = this.room.map.width - f.width;
                f.xSpeed *= -1;
            }
            
            if (f.yPos <= 0) {
                f.yPos = 0;
                f.ySpeed *= -1;
            }
            
            if (f.yPos >= this.room.map.height - f.height) {
                f.yPos = this.room.map.height - f.height;
                f.ySpeed *= -1;
            }
        }
        
        ctx.fillStyle="white";
        ctx.fillRect(f.xPos, f.yPos, f.width, f.height);
    },
    
    // collision detection between follower and target
    isWithin: function(x, y, f) {
        var within = false;
        var xWithin = false;
        var yWithin = false;
        
        // distance formula
        var dx = (x - (f.targetX - f.width/2)) * (x - (f.targetX - f.width/2));
        var dy = (y - (f.targetY - f.height/2)) * (y - (f.targetY - f.height/2));
        var dist = Math.sqrt(dx + dy);
        
        if (dist < 3) {
            within = true;
        }
        
        return within;
    },
    
    // draw screen: intro
    drawUI: function(ctx) {
        // intro
        if (this.expState == this.EXP_STATE.BEGIN) {
            ctx.save();
            ctx.fillStyle = "pink";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            ctx.fillStyle = "white";
            ctx.font = "32pt Helvetica";
            ctx.fillText("D I S C O V E R Y", this.canvas.width/2, this.canvas.height/2 - 30);
            
            ctx.fillStyle = "#4a4a4a";
            ctx.font = "16pt Helvetica";
            ctx.fillText("click anywhere to start exploring!", this.canvas.width/2, this.canvas.height/2 + 30);
            ctx.restore();
        }
        
        
        if (this.expState == this.EXP_STATE.CAMPFIRE) {
            //if on campfire state, display "smoke"
            this.exhaust.updateAndDraw(this.ctx, {x:100, y:100});
        
        }
        
    },
    
    // pause
    drawPauseScreen: function(ctx) {
        this.topCtx.save();
        this.topCtx.fillStyle = "black";
        this.topCtx.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        
        this.topCtx.textAlign = "center";
        this.topCtx.textBaseline = "middle";
        
        this.topCtx.fillStyle = "white";
        this.topCtx.font = "40pt Helvetica";
        this.topCtx.fillText("you stepped away.", this.WIDTH/2, this.HEIGHT/2 - 30);
        
        this.topCtx.fillStyle = "#333";
        this.topCtx.font = "14pt Helvetica";
        this.topCtx.fillText("COME BACK SOON? :(", this.WIDTH/2, this.HEIGHT/2 + 30);
        this.topCtx.restore();
    },
    	
    // audio
    stopBGAudio: function() {
        this.sound.stopBGAudio();
    },
    
    stopEffectAudio: function(){
        this.sound.stopEffect();
    },
    
    
    // mouse events
    doMouseDown: function(e) {
        var mouse = getMouse(e);
        
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
            this.sound.playBGAudio();
            this.sound.playEffect();
            
            return;
        }
        
        // follower
        this.follower.targetX = mouse.x;
        this.follower.targetY = mouse.y;

        this.follower.isFollowing = true;
    },
    
};