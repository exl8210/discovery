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
                case app.main.EXP_STATE.CAMPFIRE:
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
                    
                    var earth = new Image();
                    earth.src = "images/earth.png";
                    ctx.drawImage(earth, getRandom(0, this.width/5-100), 100);
                    
                    var jupiter = new Image();
                    jupiter.src = "images/jupiter.png";
                    ctx.drawImage(jupiter, getRandom(this.width/5-190, 2*(this.width/5)-190), 100);
                    
                    var moon = new Image();
                    moon.src = "images/moon.png";
                    ctx.drawImage(moon, getRandom(2*(this.width/5)-60, 3*(this.width)-60), 100);
                    
                    var potato = new Image();
                    potato.src = "images/potato.png";
                    ctx.drawImage(potato, getRandom(3*(this.width/5)-100, 4*(this.width)-100), 100);
                    
                    var saturn = new Image();
                    saturn.src = "images/saturn.png";
                    ctx.drawImage(saturn, getRandom(4*(this.width/5)-115, 5*(this.width)-115), 100);
                    
                    break;
                    
                case app.main.EXP_STATE.UNDERWATER:
                    var intervalSize = 300;
                    var intervalNum = this.width/intervalSize;
                    var third = this.height/3;
                    
                    ctx.fillStyle = "#6aeaef";		    
                    ctx.fillRect(0, 0, this.width, this.height);
                    ctx.lineWidth = 3;
                    
                    // middle
                    ctx.fillStyle = "#53e4ea";
                    
                    ctx.beginPath();
                    ctx.moveTo(0, third);
                    /*
                    ctx.quadraticCurveTo(200, third-30, 400, third);
                    ctx.quadraticCurveTo(600, third+30, 800, third);
                    ctx.quadraticCurveTo(1000, third-30, 1200, third);
                    ctx.quadraticCurveTo(1400, third+30, 1600, third);
                    */
                    for (var i = 1; i <= intervalNum+1; i += 2) {
                        ctx.quadraticCurveTo((i*intervalSize)-intervalSize/2, third-30, i*intervalSize, third);
                        
                        ctx.quadraticCurveTo(((i+1)*intervalSize)-intervalSize/2, third+30, (i+1)*intervalSize, third);
                    }
                    ctx.quadraticCurveTo(this.width, third*2, this.width, this.height);
                    ctx.quadraticCurveTo(this.width/2, this.height, 0, this.height);
                    ctx.closePath();
                    ctx.fill();
                    
                    // bottom
                    ctx.fillStyle = "#4adce2";
                    
                    ctx.save();
                    
                    ctx.translate(-intervalSize/2, 0);
                    
                    ctx.beginPath();
                    ctx.moveTo(0, third*2);
                    
                    for (var i = 1; i <= intervalNum+1; i += 2) {
                        ctx.quadraticCurveTo((i*intervalSize)-intervalSize/2, third*2-30, i*intervalSize, third*2);
                        
                        ctx.quadraticCurveTo(((i+1)*intervalSize)-intervalSize/2, third*2+30, (i+1)*intervalSize, third*2);
                    }
                    ctx.quadraticCurveTo(this.width+intervalSize, third*2, this.width+intervalSize, this.height);
                    ctx.quadraticCurveTo(this.width/2, this.height, 0, this.height);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.restore();
                    
                    // seabed
                    var seabedLoc = this.height - 30;
                    ctx.fillStyle = "#dec596";
                    
                    ctx.save();
                    
                    intervalSize = 400;
                    ctx.translate(-3*intervalSize/4, 0);
                    
                    ctx.beginPath();
                    ctx.moveTo(0, seabedLoc);
                    
                    for (var i = 1; i <= intervalNum+1; i += 2) {
                        ctx.quadraticCurveTo((i*intervalSize)-intervalSize/2, seabedLoc-10, i*intervalSize, seabedLoc);
                        
                        ctx.quadraticCurveTo(((i+1)*intervalSize)-intervalSize/2, seabedLoc+10, (i+1)*intervalSize, seabedLoc);
                    }
                    ctx.quadraticCurveTo(this.width+intervalSize, seabedLoc, this.width+intervalSize, this.height);
                    ctx.quadraticCurveTo(this.width/2, this.height, 0, this.height);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.restore();
                    
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