"use strict";

const DEBUG = false;


function Game(scenes, actions) {

    // main (and only) character
    var hero = new Character(document.getElementById("bcCharacter"));
    hero.setZonesOK(scenes);

    this.hero = hero;
    
    // dialog manager
    this.dialogs = new Dialog();

    // background and bounding box (dynamically set by CSS) 
    var background = document.getElementById("bcBackground");
    background.classList.add("masked-1");
    background.classList.add("masked-2");

    var rect = background.getBoundingClientRect();

    // action button
    var btnAction = document.getElementById("btnAction");

    // debug
    if (DEBUG) {
        displayZones(scenes, actions);
        background.classList.remove("masked-1");
        background.classList.remove("masked-2");
    }
    
    this.startTime = 0;

    // starts the game 
    this.start = function () {
        hero.setPosition(scenes.sdb.start.x, scenes.sdb.start.y);
        this.dialogs.push(...scenes.sdb.text);
        this.startTime = Date.now();
        rect = background.getBoundingClientRect();
        render();
        ended = false;
        mainloop();
        this.dialogs.say();    
    }
    
    // has game ended?
    var ended = false;
    
    this.end = function() {
        ended = true;
    }
    
    this.render = function() {
        render();
    }
    
    // current puzzle
    var current = null;
    
    /** Should be called when the game is ended **/
    this.endgame = function(which) {
        if (DEBUG) console.log("end game: ", which);
        current = null;   
        if (actions[which] && actions[which].end) {
            actions[which].end();
        }
    }

    /** Called to start a game **/
    this.startgame = function(act) {
        if (actions[act]) {
            if (DEBUG) console.log("starting: " + act);
            current = actions[act].puzzle;
            actions[act].start();
        }
    }
    

    /** Check if the hero is on the POI */
    function isOnPOI(hero) {
        for (var i in actions) {
            var p = actions[i].poi;
            if (actions[i].isActive()) {
                if (hero.position.x >= p.x && hero.position.x <= p.x + p.w && hero.position.y >= p.y && hero.position.y <= p.y + p.h) {
                    return i;
                }
            }
        }
        return null;
    }


    // rendering function, used to update the view (show actions etc.)
    function render() {

        var xPxHero = hero.position.x * rect.width / 100;
        var yPxHero = hero.position.y * rect.height / 100;

        // view centering on the character
        var deltaX = (window.innerWidth / 2) - xPxHero;
        var deltaY = window.innerHeight * 0.8 - yPxHero;
        
        //background.style.left = deltaX + "px";
        //background.style.top = deltaY + "px";
        background.style.transform = "translate(" + deltaX + "px, " + deltaY + "px)";

        // check if player is on a POI and update the "action" button
        var poi = isOnPOI(hero);
        if (poi) {
            btnAction.dataset.poi = poi;
            btnAction.dataset.type = actions[poi].type;
        } else {
            btnAction.dataset.poi = "";
        }
    }


    /**** EVENT LISTENERS *****/

    var that = this;
    
    
    // Starting of the game
    document.getElementById("btnStart").addEventListener("click", GUIStart);
    document.querySelector("#titleScreen img").addEventListener("click", GUIStart);
                                                         
    function GUIStart() {
        document.body.style.opacity = 0;
        setTimeout(() => { 
            document.body.style.opacity = 1; 
            document.body.classList.remove("title");
            that.start();
        }, 2000);
    };

    // Credits button
    document.getElementById("btnCredits").addEventListener("click", function() {
        document.getElementById("titleScreen").classList.toggle("credits"); 
    });
    

    // Virtual joystick management 

    /*
    
    var stick = document.querySelector("#joystick > div");

    // movement on the joystick
    document.getElementById("joystick").addEventListener("touchmove", function (e) {
    */

    background.addEventListener("touchstart", moveCharacter, { passive: true });
    background.addEventListener("touchmove", moveCharacter, { passive: true });
                                 
    function moveCharacter(e) {
        
        if (! that.dialogs.ended())
            return;
        
        if (current != null)
            return;
        
        //e.preventDefault();

        var x = e.changedTouches[0].clientX;
        var y = e.changedTouches[0].clientY;

        var centerX = window.innerWidth / 2; //10 * window.innerHeight / 100;
        var centerY = window.innerHeight * 0.8; //90 * window.innerHeight / 100;

        var dist = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));

        hero.setDirection((x - centerX) / dist, (y - centerY) / dist);

        /*
        if (dist > window.innerHeight / 20) {
            stick.style.left = (hero.vec.x * 50 + 50) + "%";
            stick.style.top = (hero.vec.y * 50 + 50) + "%";
        }
        else {
            stick.style.left = (50 + x - centerX) + "%";
            stick.style.top = (50 + y - centerY) + "%"; 
        }
        */
    };
    // release on the joystick
    // document.getElementById("joystick").addEventListener("touchend", function (e) {
    background.addEventListener("touchend", function (e) {
        e.preventDefault();
        hero.setDirection(0, 0);
        // stick.style.left = "50%";
        // stick.style.top = "50%";
    });
    

    // click/touch on actions
    document.getElementById("btnAction").addEventListener("click", function (e) {
        if (current != null)
            return;
        var act = this.dataset.poi;
        that.startgame(act);
    });

    // déplacements au clavier 
    document.addEventListener("keydown", function (e) {
        
        if (! that.dialogs.ended()) {
            if (e.keyCode == 32) {
                that.dialogs.say(that.dialogs.callback);    
            }
            return;
        }
        
        if (current != null) {
            return;   
        }
        
        switch (e.keyCode)  {
            case 38: // up arrow
                hero.setDirection(hero.vec.x, -1);
                break;
            case 40: // down arrow
                hero.setDirection(hero.vec.x, 1);
                break;
            case 37: // left arrow
                hero.setDirection(-1, hero.vec.y);
                break;
            case 39: // right arrow
                hero.setDirection(1, hero.vec.y);
                break;
            case 32: // spacebar
                var act;
                if (act = btnAction.dataset.poi) {
                    that.startgame(act);
                }
        }
    });
    document.addEventListener("keyup", function (e) {
        switch (e.keyCode)  {
            case 38: // up arrow
                if (hero.vec.y < 0) {
                    hero.setDirection(hero.vec.x, 0);
                }
                break;
            case 40: // down arrow
                if (hero.vec.y > 0) {
                    hero.setDirection(hero.vec.x, 0);
                }
                break;
            case 37: // left arrow
                if (hero.vec.x < 0) {
                    hero.setDirection(0, hero.vec.y);
                }
                break;
            case 39: // right arrow
                if (hero.vec.x > 0) {
                    hero.setDirection(0, hero.vec.y);
                }
                break;
        }
    });


    /****************************************
                    MAIN LOOP 
    ****************************************/

    var tempo = 0;
    function mainloop() {
        if (!ended) {
            requestAnimationFrame(mainloop);
        }
        
        var now = Date.now();

        if (!that.dialogs.ended()) {
            return;
        }

        // update character
        tempo = (tempo + 1) % 4;
        if (hero.update(now)) {
            render();
        }

        // update mini-game (if necessary)
        if (current && current.update) {
            current.update(now);
        }
    }


    /****************************************
                    DEBUG ONLY 
    ****************************************/

    function displayZones(scenes, actions) {
        // ajout des zones OK dans le background
        for (var i in scenes) {
            for (var o of scenes[i].zonesOK) {
                var d = document.createElement("div");
                d.className = "zonesOK";
                d.style.width = o.w + "%";
                d.style.height = o.h + "%";
                d.style.left = o.x + "%";
                d.style.top = o.y + "%";
                background.appendChild(d);
            }
        }
        // ajout des POI dans le background
        for (var o in actions) {
            o = actions[o].poi;
            var d = document.createElement("div");
            d.className = "POI";
            d.style.width = o.w + "%";
            d.style.height = o.h + "%";
            d.style.left = o.x + "%";
            d.style.top = o.y + "%";
            background.appendChild(d);
        }
    }


};


/*********************************************
                    Dialog class
*********************************************/
function Dialog() {

    var talk = document.getElementById("talk");
    this.callback = null;
    
    // GUI 
    talk.addEventListener("click", function (e) {
        this.say(this.callback);
    }.bind(this));

    var texts = [];

    // add dialog lines --> should it automatically run the dialog?
    this.push = function (...args) {
        texts = args;
    }

    // say dialog lines
    this.say = function (callback) {
        this.callback = callback
        var execCallback = this.callback && texts.length <= 0

        talk.innerHTML = (texts.length > 0) ? texts.splice(0, 1) : "";

        if (execCallback) {
            this.callback()
        }
    }

    // check if current dialog is over
    this.ended = function () {
        return texts.length == 0 && talk.innerHTML.length == 0;
    }

}
