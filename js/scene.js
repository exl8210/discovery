// scene.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

// define the .scene module and immediately invoke it in an IIFE
app.scene = (function(){
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
    /*
    // camera
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
*/
    
    // === Map
    var map = {
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
        
    };
    
    // === Viewport
    
    // --- Viewport constructor
    // - sets the sizes and parameters for the viewport
    function Viewport(left, top, width, height){
        console.log("hello viewport");
        
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
        
        console.log("viewport created: " + this.width + ", " + this.height);
    }
    // --- Method for setting viewport parameters

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
    
    // === Camera
    function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)
    {
        console.log("hello camera");
        
        // position of camera (left-top coordinate)
        this.xView = xView || 0;
        this.yView = yView || 0;

        // viewport dimensions
        this.wView = canvasWidth;
        this.hView = canvasHeight;	

        // rectangle that represents the viewport
        this.screenView = new this.Viewport(this.xView, this.yView, this.wView, this.hView);				

        // rectangle that represents the world's boundary (room's boundary)
        this.worldRect = new this.Viewport(0, 0, worldWidth, worldHeight);
    }
    
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
        console.log("quack");
        this.speed *= this.quickMultiplier;
    }

    
    // === test
    function sceneTest() {
        console.log("scene: function test");
    }
    
	return {
        //camera: camera,
        map: map,
        Viewport: Viewport,
        Camera: Camera,
        changeDirection: changeDirection,
        toggleQuick: toggleQuick,
        goQuickly: goQuickly,
        sceneTest: sceneTest,
    };
    
}());