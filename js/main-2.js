// sound.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// define the .sound module and immediately invoke it in an IIFE
app.main = {
    // --- Variables
    // canvases
    WIDTH: 680,
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
    
    // scene
    //scene: undefined,
    room: {
        width: 680,
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
        
        // directions
        speed: 5,
        quickSpeed: false,
        quickMultiplier: 2,
        DIRECTION: Object.freeze({
            STATIC: 0,
            LEFT: 1,
            RIGHT: 2
        }),
        direction: undefined,
        
        // functions
        update: function(step) {
            // update screenView
            if(direction == DIRECTION.LEFT)
                this.xView -= this.speed * step;
            if(direction == DIRECTION.RIGHT)
                this.xView += this.speed * step;

            this.screenView.set(this.xView, this.yView);

            // don't let camera leaves the world's boundary
            if(!this.screenView.within(this.worldRect))
            {
                if(this.screenView.left < this.worldRect.left)
                    this.xView = this.worldRect.left;
                if(this.screenView.top < this.worldRect.top)					
                    this.yView = this.worldRect.top;
                if(this.screenView.right > this.worldRect.right)
                    this.xView = this.worldRect.right - this.wView;
                if(this.screenView.bottom > this.worldRect.bottom)					
                    this.yView = this.worldRect.bottom - this.hView;
            }
        }
    },
    
    // map
    map: {
        // dimensions
        width: 3000,
        height: 460,
        
        // map texture
        image: null,
        
        // functions
        generate: function() {
            console.log("hello map");
            
            var ctx = document.createElement("canvas").getContext("2d");		
            ctx.canvas.width = this.width;
            ctx.canvas.height = this.height;		

            ctx.save();			
            ctx.fillStyle = "#232323";		    
            ctx.fillRect(0, 0, this.width, this.height);

            for (var i = 0; i < this.width*0.25; i++) {
                ctx.fillStyle = "rgba(255, 255, 255, " + getRandom(0, 1) + ")";
                ctx.beginPath();
                ctx.arc(getRandom(0, this.width), getRandom(0, this.height), getRandom(1, getRandom(1, 3)), 0, Math.PI*2, false);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();	

            // store the generate map as this image texture
            this.image = new Image();
            this.image.src = ctx.canvas.toDataURL("image/png");					

            // clear context
            ctx = null;
        },
        draw: function(context, xView, yView) {
            var cx, cy, dx, dy;
            var cWidth, cHeight, dWidth, dHeight;

            // offset point to crop the image
            cx = xView;
            cy = yView;

            // dimensions of cropped image			
            cWidth =  context.canvas.width;
            cHeight = context.canvas.height;

            // if cropped image is smaller than canvas we need to change the source dimensions
            if(this.image.width - cx < cWidth){
                cWidth = this.image.width - cx;
            }
            if(this.image.height - cy < cHeight){
                cHeight = this.image.height - cy; 
            }

            // location on canvas to draw the cropped image
            dx = 0;
            dy = 0;
            // match destination with source to not scale the image
            dWidth = cWidth;
            dHeight = cHeight;									

            context.drawImage(this.image, cx, cy, cWidth, cHeight, dx, dy, dWidth, dHeight);
        },
    },
    
    /*
    // scene scrolling
    speed: 5,
    quickSpeed: false,
    DIRECTION: Object.freeze({
        STATIC: 0,
        LEFT: 1,
        RIGHT: 2
    }),
    direction: this.DIRECTION.STATIC,
    */
    

    // --- Methods
    // initialise main
    init: function() {
        console.log("main-2.js init called");
        
		// --- initialise scroll canvas properties
		this.canvas = document.querySelector('#scrollCanvas');
		this.canvas.width = this.WIDTH;
		this.canvas.height = this.HEIGHT;
        //console.log(this.canvas.width + ", " + this.canvas.height);
		this.ctx = this.canvas.getContext('2d');
        
		// --- initialise ui canvas properties
		this.interface = document.querySelector('#uiCanvas');
		this.interface.width = 680;
		this.interface.height = this.HEIGHT;
        //console.log(this.interface.width + ", " + this.interface.height);
		this.intCtx = this.interface.getContext('2d');
        
        // --- initialise experience
        this.expState = this.EXP_STATE.BEGIN;
        //this.expState = this.EXP_STATE.SPACE;
        
        // hook up events
        this.interface.onmousedown = this.canvas.onmousedown = this.doMouseDown.bind(this);
        
        // --- initialise audio
        this.bgAudio = document.querySelector("#bgAudio");
        this.bgAudio.volume = 0.25;
        this.effectAudio = document.querySelector("#effectAudio");
        this.effectAudio.volume = 0.3;
        
        // --- initialise scene
        // map
        this.room.map = this.scene.map;
        
        // generate large image texture
        this.room.map.generate();
        
        // set up camera
        //this.camera = this.scene.Camera(0, 0, this.canvas.width, this.canvas.height, this.room.width, this.room.height);
        
        // direction
        this.camera.direction = this.camera.DIRECTION.STATIC;
        
        // viewport rectangle
        this.camera.screenView = new this.scene.Viewport(this.camera.xView, this.camera.yView, this.camera.wView, this.camera.hView);
        
        // world boundary rectangle
        this.camera.worldRect = new this.scene.Viewport(0, 0, this.room.width, this.room.height);
        
        console.dir(this.camera);
        
        this.scene.sceneTest();
        
        
        //-------SOUND----------
        // start with no audio
        this.sound.stopBGAudio();
        
		// start the animation loop
		this.update();
    },
    
    // animation loop
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
        
        // update camera
        //this.camera.update(dt);
        
        // draw scene
        //console.log("drawing scene");
        this.drawScene(this.ctx);
        this.drawUI(this.ctx);
        
        /*
        //this.test();
        //console.log("testing: bg");
		this.ctx.fillStyle = "black"; 
		this.ctx.fillRect(0,0,this.WIDTH,this.HEIGHT); 
        
        //console.log("testing: circle");
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(200, 200, 50, 0, Math.PI*2, false);
        this.ctx.closePath(0);
        this.ctx.fillStyle = "red";
        this.ctx.fill();
        this.ctx.restore();
        */
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
    /*
    // canvas scrolling/panning
    sceneScroll: function() {
        if(this.direction == this.DIRECTION.LEFT)
            this.camera.xView -= this.speed * this.step;
        if(this.direction == this.DIRECTION.RIGHT)
            this.camera.xView += this.speed * this.step;

        this.camera.screenView.set(this.camera.xView, this.camera.yView);

        // don't let camera leaves the world's boundary
        if(!this.camera.screenView.within(this.worldRect))
        {
            if(this.camera.screenView.left < this.camera.worldRect.left)
                this.camera.xView = this.camera.worldRect.left;
            if(this.camera.screenView.top < this.camera.worldRect.top)
                this.camera.yView = this.camera.worldRect.top;
            if(this.camera.screenView.right > this.camera.worldRect.right)
                this.camera.xView = this.camera.worldRect.right - this.camera.wView;
            if(this.camera.screenView.bottom > this.camera.worldRect.bottom)					
                this.camera.yView = this.camera.worldRect.bottom - this.camera.hView;
        }
    },
    */
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
            if (this.expState == this.EXP_STATE.SPACE) {
                
            }
            
            // redraw all objects
            this.room.map.draw(ctx, this.camera.xView, this.camera.yView);	
        }
        
    },
    
    changeDirection: function(dir) {
        if (this.dir == "r") {
            console.log("move right");
            this.camera.direction = 2;
        }

        if (this.dir == "l") {
            console.log("move left");
            this.camera.direction = 1;
        }
    },

    toggleQuick: function() {
        if (this.camera.quickSpeed == false) {
            this.camera.quickSpeed = true;
        }
        else {
            this.camera.quickSpeed == false;
        }

        this.goQuickly();
    },

    goQuickly: function() {
        console.log("quack");
        this.camera.speed *= this.camera.quickMultiplier;
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