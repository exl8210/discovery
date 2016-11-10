//emitter.js

"use strict";


// --- Create app
// if app exists use the existing copy
// else create a new empty object literal
var app = app || {};

app.Emitter = function(){
    
    function Emitter(){
        //public
        this.numParticles = 25;
        this.useCircles = true;
        this.useSquares = false;
        this.xRange = 4;
        this.yRange = 4;
        this.minXspeed = -1;
        this.minYspeed = 2;
        this.maxXspeed = 1;
        this.maxYspeed = 4;
        this.startRadius = 1;
        this.expansionRate = 0.3;
        this.decayRate = 2.5;
        this.lifetime = 100;
        this.color = 'white';
    
        //private
        this._particles = undefined;
    };
    
    //public methods
    var p = Emitter.prototype;
    
    p.createParticles = function(emitterPoint){
        //initalize array
        this._particles = [];
        
        //create exhaust particles
        for(var i = 0; i < this.numParticles; i++){
        //create a particle object and add to array
            
            var p = {};
            
            this._particles.push(_initParticle(this, p, emitterPoint));
            
        }
    
    };
    
    p.updateAndDraw = function(ctx, emitterPoint) {
        //move and draw particles
        //loop through particle array
        for(var i = 0; i<this._particles.length; i++){
            var p = this._particles[i];
            
            p.age += this.decayRate;
            p.r += this.expansionRate;
            p.x += p.xSpeed;
            p.y += p.ySpeed;
            var alpha = 1 - p.age/this.lifetime;
            
            if(this.useSquares){
                //fill a rectangle
                ctx.fillStyle = "white";
                ctx.fillRect(p.x, p.y, p.r, p.r);
            }
            
            if(this.useCircles){
                ctx.fillStyle = "white";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.y, Math.PI * 2, false);
                ctx.closePath();
                ctx.fill();
            }
            
            //if particle is too old, reuse it
            if(p.age >= this.lifetime){
                _initParticle(this, p, emitterPoint);
            }      
        }//end for loop 
    }//end updateAndDraw
    
    //private method
    function _initParticle(obj, p, emitterPoint){
        
        //random age when created
        p.age = getRandom(0, obj.lifetime);
        
        p.x = emitterPoint.x + getRandom(-obj.xRange, obj.xRange);
        p.y = emitterPoint.y + getRandom(0, obj.yRange);
        p.r = getRandom(obj.startRadius/2, obj.startRadius);
        p.xSpeed = getRandom(obj.minXspeed, obj.maxXspeed);
        p.ySpeed = getRandom(obj.minYspeed, obj.maxYspeed);
        return p;
    
    };
    
    return Emitter;

}();