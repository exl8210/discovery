//sprite.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

/*
// sprite function constructor
var DrawSprite = function(path, frameWidth, frameHeight, frameSpeed, endFrame){
        //create the image and set its path
        //since different sprite sheets have different frame width and height, we won't hardcode them
        
        this.image = new Image();
        this.framesPerRow;
        
        image.onload = function(){
            framesPerRow = Math.floor(image.width / frameWidth);
        };
        
        image.src = path;
        
        this.currentFrame = 0;   //the current frame to draw
        this.counter = 0;        //keep track of frame rate
        
        //update the animation
        this.update = function(){
            if (counter ==(frameSpeed - 1))
                counter = (currentFrame + 1) % endFrame;    //modulo operate creates a continuous loop
            
            //update the counter
            counter = (counter + 1) % frameSpeed;
        };
    
        //calculate the coordinates of the frame to draw
        this.draw = function(x,y) {
            //get the row of the frame
            this.row = Math.floor(currentFrame / framesPerRow);
            this.col = Math.floor(currentFrame % framesPerRow);
    
            this.ctx.drawImage(image, col * frameWidth, row * frameHeight, frameWidth, frameHeight, x, y, frameWidth, frameHeight);
        };
        
};

var alienSprite = new DrawSprite("images/alienSprite.png", 170, 124, 3, 3);
//var fireSprite = new DrawSprite();
//var fishSprite = new DrawSprite();
*/

(function () {
    var alien,
        alienImg,
        canvas;
    
    function gameLoop(){
        window.requestAnimationFrame(gameLoop);
        
        alien.update();
        alien.render();
        
        console.log("hello sprite");
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
        
        //update the frames
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
        
        //draw the frames
        that.render = function(){
            //clear the canvas
            that.context.clearRect(0,0, that.width, that.height);
            
            //draw the animation
            that.context.drawImage(that.image, frameIndex * that.width / numberOfFrames, 0, that.width / numberOfFrames, that.height, 0, 0, that.width/numberOfFrames, that.height);
        };
        
        return that;
        
    }

    //get the canvas
    canvas = document.getElementById("spriteCanvas");
    canvas.width = 300;
    canvas.height = 123;
    
    //cerate the sprite sheet
    alienImg = new Image();
    
    //create sprite
    alien = sprite({
        context: canvas.getContext("2d"),
        width: 499,
        height: 123,
        image: alienImg,
        numberOfFrames: 3,
        ticksPerFrame: 7
    });
    
    //load sprite sheet
    alienImg.addEventListener("load", gameLoop);
    alienImg.src="images/alienSprite.png";


} ());