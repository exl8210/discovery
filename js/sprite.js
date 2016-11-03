//sprite.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

(function () {
    var alien,
        alienImg,
        fish,
        fishImg,
        fire,
        fireImg,
        canvas;
    
    function gameLoop(){
        window.requestAnimationFrame(gameLoop);
        
        //When in space gamestate
        if(app.main.expState == app.main.EXP_STATE.SPACE){ 
            alien.update();
            alien.render();
            console.log("alien says (@*#");
        }
        
        /*
        //when in underwater gamestate
        if(app.main.expState == app.main.EXP_STATE.UNDERWATER){
            fish.update();
            fish.render();
            console.log("fish says blub");
        }
        
        //when in home gamestate
        if(app.main.expState == app.main.EXP_STATE.HOME){
            fire.update();
            fire.render();
            console.log("fire says crackle");
        }
        */
        
        //console.log("hello sprite");
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
        
        //pause frames
        that.pause = function(){
            tickCount = 0;
            ticksPerFrame = 0;
            frameIndex = 0;
        }
        
        return that;
        
    }

    //get the canvas
    canvas = document.getElementById("spriteCanvas");
    canvas.width = 300;
    canvas.height = 123;
    
    //create the sprite sheets
    alienImg = new Image();
    fishImg = new Image();
    fireImg = new Image();
    
    //create alien sprites
    alien = sprite({
        context: canvas.getContext("2d"),
        width: 499,
        height: 123,
        image: alienImg,
        numberOfFrames: 3,
        ticksPerFrame: 7
    });
    
    /*
    //create fish sprites
    fish = sprite({
    });
    
    //create fire sprites
    fire = sprite({
    });
    */
    
    //load alien sprite sheet
    alienImg.addEventListener("load", gameLoop);
    alienImg.src="images/alienSprite.png";
    
    /*
    //load fish sprite sheet
    fishImg.addEventListener("load", gameLoop);
    fishImg.src="";
    
    //load fire sprite sheet
    fireImg.addEventListener("load", gameLoop);
    fireImg.src="";
    */

} ());