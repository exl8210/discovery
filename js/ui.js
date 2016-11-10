/*
ui.js
For the nav slide out menu, and any other ui controls
*/

"use strict";


function slideOut(){
    document.getElementById("sideNav").style.width = "100%";
    document.getElementById("sideNav").style.visibility = "visible";
}

function slideBack(){
    document.getElementById("sideNav").style.width = "0";
    document.getElementById("sideNav").style.visibility = "hidden";
}

document.querySelector("#campState").onchange = function(e){
    if(e.target.checked == true){
        // change state
        app.main.expState = app.main.EXP_STATE.CAMPFIRE;
        console.log("state changed to " + app.main.expState);
        
        // regenerate room
        app.main.room.map.generate(app.main.expState);
        
        // change sound
        app.sound.changeBGAudio();
    }
    
    slideBack();
}

document.querySelector("#spaceState").onchange = function(e){
    if(e.target.checked == true){
        // change state
        app.main.expState = app.main.EXP_STATE.SPACE;
        console.log("state changed to " + app.main.expState);
        
        // regenerate room
        app.main.room.map.generate(app.main.expState);
        
        // change sound
        app.sound.changeBGAudio();
    }
    
    slideBack();
}

document.querySelector("#underwaterState").onchange = function(e){
    if(e.target.checked == true){
        // change state
        app.main.expState = app.main.EXP_STATE.UNDERWATER;
        console.log("state changed to " + app.main.expState);
        
        // regenerate room
        app.main.room.map.generate(app.main.expState);
        
        // change sound
        app.sound.changeBGAudio();
    }
    
    slideBack();
}
