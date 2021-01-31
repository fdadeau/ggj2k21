"use strict";

document.addEventListener("DOMContentLoaded", function(e) {
    
    // sizes of the scenes
    var scenes = { 
        "sdb": { width: 4592, height:  2598, zonesOK: [ 
            { x: 65, y: 27, w: 11, h: 30 },
            { x: 56, y: 41, w: 38, h: 34 },
            { x: 56, y: 75, w: 25, h: 20 }
        ], 
            text: ["Ouch, what a headache!", "Where am I?", "Hum it looks like the door is closed.", "I need to find a way to get out of here and remember what happened" ]
               }, 
        "chambre": { width: 4592, height: 2598 }
    };
    
                                                    
    
    var POI = {
        "water": { x: 83, y: 41, w: 11, h: 3 }, 
        "vomit": { x: 65, y: 27, w: 8, h: 16 }
    }
    
    var actions = {
        "water": new WaterGame(document.getElementById("bcWater")),
        "vomit": { start: function() { textsToSay = ["Ouch. I hope this isn't mine...", "This is disgusting." ]; say(); } }
    };
    
    // current mini-game
    var current = null;
    
    var currentScene = "sdb";
    
    // background 
    var background = document.getElementById("bcBackground");
    var rect = background.getBoundingClientRect();
    
    // ajout des zones OK dans le background
    for (var o of scenes[currentScene].zonesOK) {
        var d = document.createElement("div");
        d.className = "zonesOK";
        d.style.width = o.w + "%";
        d.style.height = o.h + "%";
        d.style.left = o.x + "%";
        d.style.top = o.y + "%";
        background.appendChild(d);
    }
    // ajout des POI dans le background
    for (var o in POI) {
        o = POI[o];
        var d = document.createElement("div");
        d.className = "POI";
        d.style.width = o.w + "%";
        d.style.height = o.h + "%";
        d.style.left = o.x + "%";
        d.style.top = o.y + "%";
        background.appendChild(d);
    }

    var hero = new Character(document.getElementById("bcCharacter"));
    hero.setZonesOK(scenes[currentScene].zonesOK);
    hero.setPOI(POI);
    
    var btnAction = document.getElementById("btnAction");
        
    function render() {
        
        var xPxHero = hero.position.x * rect.width / 100;
        var yPxHero = hero.position.y * rect.height / 100;

        var point = document.getElementById("point");
        point.style.left = xPxHero + "px";
        point.style.top = yPxHero + "px";
        
        var deltaX = (window.innerWidth / 2) - xPxHero;
        var deltaY = window.innerHeight / 2 - yPxHero;
        
        background.style.left = deltaX + "px";
        background.style.top = deltaY + "px";
    
        var poi = hero.isOnPOI();
        if (poi) {
            btnAction.dataset.poi = poi;
        }
        else {
            btnAction.removeAttribute("data-poi");
        }
        
    }
    render();
    
    
    var stick = document.querySelector("#joystick > div");
    
    document.getElementById("joystick").addEventListener("touchmove", function(e) {
        e.preventDefault();
        
        var x = e.changedTouches[0].clientX;
        var y = e.changedTouches[0].clientY;
        
        var centerX = 10 * window.innerHeight / 100;
        var centerY = 90 * window.innerHeight / 100;
        
        var dist = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));
        
        hero.vec.x = (x - centerX) / dist;
        hero.vec.y = (y - centerY) / dist;
        
        stick.style.left = (hero.vec.x * 50 + 50 )+ "%";
        stick.style.top = (hero.vec.y * 50 + 50)+ "%";
        
    });
    document.getElementById("joystick").addEventListener("touchend", function(e) {
        e.preventDefault();
        hero.vec.x = 0;
        hero.vec.y = 0;
        stick.style.left = "50%";
        stick.style.top = "50%";
    });
    
    
    document.getElementById("btnAction").addEventListener("click", function(e) {
        var act = this.dataset.poi;
        if (actions[act]) {
            actions[act].start();   
        }
    });
    

    var textsToSay = [...scenes.sdb.text];
    say();
    document.getElementById("talk").addEventListener("dblclick", function(e) {
        e.preventDefault();
    });
    document.getElementById("talk").addEventListener("click", function(e) {
        e.preventDefault();
        say();
    });
    function say() {
        document.getElementById("talk").innerHTML = (textsToSay.length > 0) ? textsToSay.splice(0, 1) : "";
    }
    
    document.body.addEventListener("dblclick", function(e) {
        e.preventDefault();
    });

    
    // main loop
    function mainloop() {
        requestAnimationFrame(mainloop);
        var now = Date.now();
        
        if (textsToSay.length > 0) {
            return;   
        }
        
        // update character
        if (hero.update(now)) {
            render();
        }        
        
        // update mini-game (if necessary)
        if (current && current.update) {
            current.update(now);
        }
    }
    mainloop();    
});

