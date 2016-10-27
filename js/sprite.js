//sprite.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

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
    
            ctx.drawImage(image, col * frameWidth, row * frameHeight, frameWidth, frameHeight, x, y, frameWidth, frameHeight);
        };
        
};

var alienSprite = new DrawSprite("assets/sprite/alienSprite.png", 170, 124, 3, 3);
//var fireSprite = new DrawSprite();
//var fishSprite = new DrawSprite();
