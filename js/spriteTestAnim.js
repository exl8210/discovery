"use strict";

var app = app || {};

(function () {
    var alien,
        alienImg,
        canvas;
    
    function gameLoop(){
        window.requestAnimationFrame(gameLoop);
        
        alien.update();
        alien.render();
    }
    
    function sprite(options){
        var that = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1;
        
        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;
        
        that.update = function(){
            tickCount += 1;
            
            if(tickCount > ticksPerFrame) {
                tickCount = 0;
                
                //if the current frame index is in range
                if(frameIndex < numberOfFrames - 1) {
                    //go to the next frame
                    frameIndex += 1;
                } else {
                    frameIndex = 0;
                }
                
            }
        };
        
        that.render = function(){
            //clear the canvas
            that.context.clearRect(0,0, that.width, that.height);
            
            //draw the animation
            that.context.drawImage(that.image, frameIndex * that.width / numberOfFrames, 0, that.width / numberOfFrames, that.height, 0, 0, that.width/numberOfFrames, that.height);
        };
        
        return that;
        
    }

    //get the canvas
    canvas = document.getElementById("spriteAnimation");
    canvas.width = 170;
    canvas.height = 170;
    
    //cerate the sprite sheet
    alienImg = new Image();
    
    //create sprite
    alien = sprite({
        context: canvas.getContext("2d"),
        width: 1000,
        height: 100,
        image: alienImg,
        numberOfFrames: 3,
        ticksPerFrame: 4
    });
    
    //load sprite sheet
    alienImg.addEventListener("load", gameLoop);
    alienImg.src="images/alienSprite.png";


} ());