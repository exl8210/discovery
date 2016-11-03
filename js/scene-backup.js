/*
scene.js
*/

"use strict";

var app = app || {};

// wrapper for our game "classes", "methods" and "objects"
//window.Game = {};

// === define the .scene module
app.scene = (function() {
    // --- Variables
    // scene scrolling
    var speed = 5;
    var quickSpeed = false;
    var quickMultiplier = 2;
    var DIRECTION = Object.freeze({
        LEFT: 1,
        RIGHT: 2
    });
    var direction = undefined;

    // === Viewport
    console.log("hello viewport");

    // --- Viewport constructor
    // - sets the sizes and parameters for the viewport
    function Viewport(left, top, width, height){
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
    }
/*
    var viewport = {
        // dimensions
        left: 0,
        top: 0,
        width: 1280,
        height: 460,
        right: this.left + this.width,
        bottom: this.top + this.height,

        // functions
        within: function(x) {
            return (x.left <= this.left &&
                x.right >= this.right &&
                x.top <= this.top &&
                x.bottom >= this.bottom);
        },
        overlaps: function(x) {
            return (this.left < x.right &&
                x.left < this.right &&
                this.top < x.bottom &&
                x.top < this.bottom);
        },
    };
    // --- Method for setting viewport parameters
*/
    Viewport.prototype.set = function(left, top, width, height){
        this.left = left;
        this.top = top;
        this.width = width || this.width;
        this.height = height || this.height
        this.right = (this.left + this.width);
        this.bottom = (this.top + this.height);
    }

    // --- Method for checking whether an object is within boundaries
    Viewport.prototype.within = function(r) {
        return (r.left <= this.left &&
                r.right >= this.right &&
                r.top <= this.top &&
                r.bottom >= this.bottom);
    }

    // --- Method for checking whether an object is overlapping the boundaries
    Viewport.prototype.overlaps = function(r) {
        return (this.left < r.right &&
                r.left < this.right &&
                this.top < r.bottom &&
                r.top < this.bottom);
    }

    // add "class" Viewport to our Game object
    //app.main.Viewport = Viewport;

    // === Camera
    console.log("hello camera");
/*
    // Camera constructor
    function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)
    {
        // position of camera (left-top coordinate)
        this.xView = xView || 0;
        this.yView = yView || 0;

        // viewport dimensions
        this.wView = canvasWidth;
        this.hView = canvasHeight;

        // rectangle that represents the viewport
        this.screenView = new app.scene.Viewport(this.xView, this.yView, this.wView, this.hView);

        // rectangle that represents the world's boundary (room's boundary)
        this.worldRect = new app.scene.Viewport(0, 0, worldWidth, worldHeight);

    }
    */
    var camera = {
        // camera position
        xView: 0,
        yView: 0,

        // rect representing the viewport
        screenView: undefined,
        worldRect: undefined,

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
    };

    function changeDirection(dir) {
        if (this.dir == "r") {
            this.direction = 2;
        }

        if (this.dir == "l") {
            this.direction = 1;
        }
    }

    function toggleQuick() {
        if (this.quickSpeed == false) {
            this.quickSpeed = true;
        }
        else {
            this.quickSpeed == false;
        }

        this.goQuickly();
    }

    function goQuickly() {
        this.speed *= this.quickMultiplier;
    }
/*
    Camera.prototype.update = function(step)
    {
        // move speed in pixels per second
        //this.speed = 200;

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

    // add "class" Camera to our Game object
    //app.main.Camera = Camera;


    // === Map
    console.log("hello map");
/*
    function Map(width, height){
        // map dimensions
        this.width = width;
        this.height = height;

        // map texture
        this.image = null;
    }
    */
    var map = {
        // dimensions
        width: 3000,
        height: 460,

        // map texture
        image: null,

        // functions
        generate: function() {
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

    };
/*
    // generate an example of a large map
    Map.prototype.generate = function(){
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
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    // draw the map adjusted to camera
    Map.prototype.draw = function(context, xView, yView){
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
    }
    */
    function sceneTest() {
        console.log("scene: function test");
    }

    // add "class" Map to our Game object
    //app.main.Map = Map;

    return {
        Viewport: Viewport,
        Camera: Camera,
        Map: Map,
        sceneTest: sceneTest,
    };

    /*
    // === Game
    // prepare canvas
    var canvas = document.querySelector("#scrollCanvas");
    var ctx = canvas.getContext("2d");

    // game settings:
    var FPS = 30;
    var INTERVAL = 1000/FPS; // milliseconds
    var STEP = INTERVAL/1000 // seconds

    // setup an object that represents the room
    var room = {
        width: 1280,
        height: 460,
        map: new app.scene.Map(3000, 460)
    };

    // generate a large image texture for the room
    room.map.generate();

    // setup the magic camera !!!
    var camera = new app.scene.Camera(0, 0, canvas.width, canvas.height, room.width, room.height);

    // Game draw function
    var draw = function(){
        // clear the entire canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // redraw all objects
        room.map.draw(ctx, camera.xView, camera.yView);
    }

    // Game Loop
    var loop = function(){
        requestAnimationFrame(loop());

        camera.update(STEP);
        draw();
    }

/*
    // <-- configure play/pause capabilities:

    // I'll use setInterval instead of requestAnimationFrame for compatibility reason,
    // but it's easy to change that.

    var runningId = -1;

    app.scene.play = function(){
        if(runningId == -1){
            runningId = setInterval(function(){
                loop();
            }, INTERVAL);
            console.log("play");
        }
    }

    app.scene.togglePause = function(){
        if(runningId == -1){
            app.scene.play();
        }
        else
        {
            clearInterval(runningId);
            runningId = -1;
            console.log("paused");
        }
    }

        // -->


    // <-- configure Game controls:
/*
    app.scene.controls = {
        left: false,
        up: false,
        right: false,
        down: false,
    };

    window.addEventListener("keydown", function(e){
        switch(e.keyCode)
        {
            case 37: // left arrow
                app.scene.controls.left = true;
                break;
            case 38: // up arrow
                app.scene.controls.up = true;
                break;
            case 39: // right arrow
                app.scene.controls.right = true;
                break;
            case 40: // down arrow
                app.scene.controls.down = true;
                break;
        }
    }, false);

    window.addEventListener("keyup", function(e){
        switch(e.keyCode)
        {
            case 37: // left arrow
                app.scene.controls.left = false;
                break;
            case 38: // up arrow
                app.scene.controls.up = false;
                break;
            case 39: // right arrow
                app.scene.controls.right = false;
                break;
            case 40: // down arrow
                app.scene.controls.down = false;
                break;
            case 80: // key P pauses the game
                app.scene.togglePause();
                break;
        }
    }, false);

    // -->
    // start the game when page is loaded
    window.onload = function(){
        app.scene.loop();
    }
*/
}());
