"use strict";

document.addEventListener("DOMContentLoaded", function(e) {
    
    // SCENES
    var scenes = { 
        "sdb": { 
            zonesOK: [ 
                { x: 70, y: 69, w: 7, h: 5 },       // WC area
                { x: 58, y: 73.5, w: 38, h: 14 },   // starting area
                { x: 58, y: 86, w: 24, h: 10 }      // door/shower
            ], 
            text: [ 
                "Ouch, what a headache!", 
                "Where am I?", 
                "Hum it looks like the door is closed.", 
                "I need to find a way to get out of here...",
                "and find out what I'm doing there." 
            ],
            start: { x: 59, y: 75 },
            // maybe other things later...?
        }, 
        "chambre": { 
            zonesOK: [
                { x: 16, y: 95, w: 35, h: 3 },       // bed-bottom
                { x: 35, y: 73, w: 12, h: 22 },      // bed-right + door to bathroom
                { x: 6, y: 66, w: 35, h: 7 }         // bed-top + door to spaceship
            ],
            text: [
                "OK it looks like a room.", 
                "Quite familiar...",
                "...but I'm definitely not in my home."
            ]
        }, 
        "spaceship": {
            zonesOK: [
                { x: 6, y: 25, w: 22, h: 22 },           // final exit door
                { x: 25, y: 40, w: 10, h: 5 },          // bottom-left corner of the table
                { x: 16, y: 44.5, w: 64, h: 3.5 },       // bottom (door to bedroom)
                { x: 74, y: 21, w: 6, h: 26 },       // right-hand side
                { x: 6, y: 24, w: 34, h: 3 },       // top side
                { x: 40, y: 21, w: 34, h: 5 }       // top side
                
            ],
            text: [
                "OK... that's unusual...", 
                "I'm in a sort of... spaceship ?!?",
                "How the f*** is it possible?"
            ]
        }
    };
    
    
    var icons = {
       
    }

    // Possible actions / POI
    var actions = {
        "water": { 
            type: "game", 
            poi: { x: 85, y: 73, w: 11, h: 3 },
            puzzle: new WaterGame(document.getElementById("bcWater")),
            isActive: function() {
                return true;   
            },
            start: function() {
                if (!this.puzzle.isSolved()) {
                    game.dialogs.push("Something seems to be broken in there.", "I should try to fix it."); 
                    game.dialogs.say(() => this.puzzle.start());
                }
            }
        },
        "vomit": { 
            type: "thought", 
            poi: { x: 65, y: 68, w: 10, h: 8 },
            isActive: function() {
                return true;   
            },
            start: function() { 
                game.dialogs.push("Ouch. I hope this isn't mine...", "This is disgusting."); 
                game.dialogs.say(); 
            } 
        }, 
        "guitar": {
            type: "game",
            poi: { x: 42, y: 68, w: 8, h: 6 },
            puzzle: new GuitarGame(document.getElementById("bcGuitar")),
            isActive: function() {
                return !this.puzzle.isSolved();   
            },
            start: function() {
                game.dialogs.push("That guitar has a broken string...", "Well, that reminds me some music..."); 
                game.dialogs.say(() => this.puzzle.start()); 
            }
        },
        "lamp": {
            type: "pickup",
            poi: { x: 0, y: 0, w: 0, h: 0 },
            done: false,
            isActive: function() {
                return !this.done;  
            },
            start: function() {
                this.done = true;  
                // TODO update display
            }
        }, 
        "disjunct": {
            type: "game", 
            poi: { x: 0, y: 0, w: 0, h: 0 },
            puzzle: null,   // TODO
            isActive: function() {
                return true;
            }, 
            start: function() {
                this.puzzle.start();   
            }
        },
        "bed": {
            type: "thought", 
            poi: { x: 0, y: 0, w: 0, h: 0 },
            isActive: function() {
                return true;
            }, 
            start: function() {
                game.dialogs.push("Hum...", "It looks like someone had some fun right here...", "But I don't remember anything...", "or anyone.");
                game.dialogs.say();
            }
        },
        "bathroom-exit-door": {
            type: "door",
            poi: { x: 57, y: 80, w: 2, h: 8 },
            isActive: function () {
                return true;
            },
            start: function () {
                if (actions.water.puzzle.isSolved()) {
                    document.querySelector('#bcBackground').classList.remove('masked-1')
                    game.hero.setPosition(46, 84);
                    game.render();
                }
                else {
                    game.dialogs.push("Hum, I can't open that door, I don't have the key.");
                    game.dialogs.say();
                }
            }
        },
        "bathroom-entry-door": {
            type: "door",
            poi: { x: 46, y: 80, w: 3, h: 8 },
            isActive: function () {
                return true;
            },
            start: function () {
                game.hero.setPosition(58, 84);
                game.render();
            }
        },
        "bedroom-exit-door": {
            type: "door",
            poi: { x: 20, y: 65, w: 10, h: 2 },
            isActive: function () {
                return true;
            },
            start: function () {
                document.querySelector('#bcBackground').classList.remove('masked-2');
                game.hero.setPosition(22, 46);
                game.render();
            }
        },
        "bedroom-entry-door": {
            type: "action",
            poi: { x: 20, y: 46, w: 10, h: 2 },
            isActive: function () {
                return true;
            },
            start: function () {
                game.hero.setPosition(22, 66);
                game.render();
            }
        },
        "final-exit": {
            type: "action",
            poi: { x: 5, y: 25, w: 2, h: 8 },
            isActive: function () {
                return true;
            },
            start: function () {
                alert("Game over");
            }
        },
        // to be continued...
    };

    var game = new Game(scenes, actions);
        
    game.start();
    
});