//sprite.js
"use strict";
// if app exists use the existing copy
// else create a new object literal
var app = app || {};

app.sprite = (function () {
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
        
        
        //when in underwater gamestate
        if(app.main.expState == app.main.EXP_STATE.UNDERWATER){
            fish.update();
            fish.render();
            console.log("fish says blub");

        }
        
        //when in campfire gamestate
        if(app.main.expState == app.main.EXP_STATE.CAMPFIRE){
            fire.update();
            fire.render();
            console.log("fire says crackle");
        }
       
        
        //console.log("hello sprite");
    }
    
    //define the sprite object
    function sprite(options){
        var that = {},
            frameIndex = 0,
            tickCount = 0,
            ticksPerFrame = options.ticksPerFrame || 0,
            numberOfFrames = options.numberOfFrames || 1;
        
        that.context = options.context;
        that.sheetWidth = options.sheetWidth;
        that.sheetHeight = options.sheetHeight;
        that.image = options.image;
        that.xPos = options.xPos;
        that.yPos = options.yPos;
        
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
            that.context.clearRect(0,0, canvas.width, canvas.height);
            
            //draw the animation
            
            that.context.drawImage(that.image, frameIndex * that.sheetWidth / numberOfFrames, 0, that.sheetWidth / numberOfFrames, that.sheetHeight, that.xPos, that.yPos, that.sheetWidth/numberOfFrames, that.sheetHeight);
        };
        
        return that;
        
    }

    //get the canvas
    canvas = document.getElementById("spriteCanvas");
    canvas.width = 1280;
    canvas.height = 460;
    
    //create the sprite sheets
    alienImg = new Image();
    fishImg = new Image();
    fireImg = new Image();
    
    //create alien sprites
    alien = sprite({
        context: canvas.getContext("2d"),
        sheetWidth: 499,
        sheetHeight: 123,
        image: alienImg,
        xPos: canvas.width/2,
        yPos: canvas.height/2,
        numberOfFrames: 3,
        ticksPerFrame: 7
    });
    

    //create fish sprites
    fish = sprite({
        context: canvas.getContext("2d"),
        sheetWidth: 499,
        sheetHeight: 123,
        xPos: canvas.width/2,
        yPos: canvas.height/2,
        image: fishImg,
        numberOfFrames: 4,
        ticksPerFrame: 15
    });
    
    //create fire sprites
    fire = sprite({
        context: canvas.getContext("2d"),
        sheetWidth: 499,
        sheetHeight: 123,
        image: fireImg,
        xPos: canvas.width/2,
        yPos: canvas.height/2,
        numberOfFrames: 3,
        ticksPerFrame: 7
    });

    
    //load alien sprite sheet
    alienImg.addEventListener("load", gameLoop);
    alienImg.src="images/alienSprite.png";
    

    //load fish sprite sheet
    fishImg.addEventListener("load", gameLoop);
    fishImg.src="images/fishSprite.png";
    
    //load fire sprite sheet
    fireImg.addEventListener("load", gameLoop);
    fireImg.src="";


    return {
        //return objects to move/place later
        alien: alien,
        fish: fish,
        fire: fire,
    };
    
} ());