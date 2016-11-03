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
    
    // === Map
    var map = {
        // dimensions
        width: 1280 * 2,    // 2560px wide
        height: 460,
        
        // map texture
        image: null,
        
        // functions
        generate: function(scene) {
            //console.log("hello map");
            
            var ctx = document.createElement("canvas").getContext("2d");		
            ctx.canvas.width = this.width;
            ctx.canvas.height = this.height;		

            ctx.save();			
            
            switch (scene) {
                case app.main.EXP_STATE.HOME:
                    ctx.fillStyle = "#b18c71";		    
                    ctx.fillRect(0, 0, this.width, this.height);
                    
                    break;
                    
                case app.main.EXP_STATE.SPACE:
                    ctx.fillStyle = "#232323";		    
                    ctx.fillRect(0, 0, this.width, this.height);

                    for (var i = 0; i < this.width*0.25; i++) {
                        ctx.fillStyle = "rgba(255, 255, 255, " + getRandom(0, 1) + ")";
                        ctx.beginPath();
                        ctx.arc(getRandom(0, this.width), getRandom(0, this.height), getRandom(1, getRandom(1, 3)), 0, Math.PI*2, false);
                        ctx.closePath();
                        ctx.fill();
                    }
                    
                    break;
                    
                case app.main.EXP_STATE.UNDERWATER:
                    ctx.fillStyle = "#6aeaef";		    
                    ctx.fillRect(0, 0, this.width, this.height);
                    
                    break;
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
        //console.log("hello viewport");
        
        this.left = left || 0;
        this.top = top || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.right = this.left + this.width;
        this.bottom = this.top + this.height;
        
        //console.log("viewport created: " + this.width + ", " + this.height);
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
    
    // === test
    function sceneTest() {
        console.log("scene: function test");
    }
    
	return {
        map: map,
        Viewport: Viewport,
        //sceneTest: sceneTest,
    };
    
}());