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

document.querySelector("#spaceState").onchange = function(e){
    switchState(e, 1);
};

document.querySelector("#campState").onchange = function(e){
    switchState(e, 2);
};

document.querySelector("#underwaterState").onchange = function(e){
    switchState(e, 3);
};

function switchState(e, state) {
    if(e.target.checked == true){
        // change state
        app.main.expState = state;
        
        // regenerate room
        app.main.room.map.generate(app.main.expState);
        
        // reset camera
        app.main.camReset();
        
        // change sound
        app.sound.changeAudio();
    }
    
    slideBack();
}