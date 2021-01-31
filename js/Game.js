"use strict";

const DEBUG = true;


function Game(scenes, actions) {

    // main (and only) character
    var hero = new Character(document.getElementById("bcCharacter"));
    hero.setZonesOK(scenes);

    this.hero = hero;
    
    // dialog manager
    this.dialogs = new Dialog();

    // background and bounding box (dynamically set by CSS) 
    var background = document.getElementById("bcBackground");
    var rect = background.getBoundingClientRect();

    // action button
    var btnAction = document.getElementById("btnAction");

    // debug
    if (DEBUG) {
        displayZones(scenes, actions);
    }

    // starts the game 
    this.start = function () {
        hero.setPosition(scenes.sdb.start.x, scenes.sdb.start.y);
        //        this.dialogs.push(...scenes.sdb.text);
        render();
        mainloop();
        //        this.dialogs.say();    
    }
    
    this.render = function() {
        render();
    }

    var current = null;


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

        if (DEBUG) {
            // point used to debug character position
            var point = document.getElementById("point");
            point.style.left = xPxHero + "px";
            point.style.top = yPxHero + "px";
        }

        // view centering on the character
        var deltaX = (window.innerWidth / 2) - xPxHero;
        var deltaY = window.innerHeight * 0.8 - yPxHero;
        background.style.left = deltaX + "px";
        background.style.top = deltaY + "px";

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


    // Virtual joystick management 

    var stick = document.querySelector("#joystick > div");

    // movement on the joystick
    document.getElementById("joystick").addEventListener("touchmove", function (e) {
        e.preventDefault();

        var x = e.changedTouches[0].clientX;
        var y = e.changedTouches[0].clientY;

        var centerX = 10 * window.innerHeight / 100;
        var centerY = 90 * window.innerHeight / 100;

        var dist = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));

        hero.vec.x = (x - centerX) / dist;
        hero.vec.y = (y - centerY) / dist;

        stick.style.left = (hero.vec.x * 50 + 50) + "%";
        stick.style.top = (hero.vec.y * 50 + 50) + "%";
    });
    // release on the joystick
    document.getElementById("joystick").addEventListener("touchend", function (e) {
        e.preventDefault();
        hero.vec.x = 0;
        hero.vec.y = 0;
        stick.style.left = "50%";
        stick.style.top = "50%";
    });

    // click/touch on actions
    document.getElementById("btnAction").addEventListener("click", function (e) {
        var act = this.dataset.poi;
        if (actions[act]) {
            actions[act].start();
            current = actions[act].puzzle;
        }
    });

    // déplacements au clavier 
    document.addEventListener("keydown", function (e) {
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
                    if (actions[act]) {
                        actions[act].start();
                        current = actions[act].puzzle;
                    }
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
    var that = this;

    function mainloop() {
        requestAnimationFrame(mainloop);
        var now = Date.now();

        if (!that.dialogs.ended()) {
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

    // GUI 
    document.getElementById("talk").addEventListener("click", function (e) {
        this.say();
    }.bind(this));

    var texts = [];

    // add dialog lines --> should it automatically run the dialog?
    this.push = function (...args) {
        texts = args;
    }

    // say dialog lines
    this.say = function () {
        document.getElementById("talk").innerHTML = (texts.length > 0) ? texts.splice(0, 1) : "";
    }

    // check if current dialog is over
    this.ended = function () {
        return texts.length == 0;
    }

}
