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
            start: { x: 12, y: 27 },
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
                { x: 6, y: 25, w: 35, h: 30 },       // bed-bottom
            ],
            text: [
                "OK... that's unusual...", 
                "I'm in a sort of... spaceship ?!?",
                "How the f*** is it possible?"
            ]
        }
    };
    
    
    var icons = {
        "game": "🤔",
        "thought": "💭",
        "pickup": "🧲",
        "door": "🚪",
    }

    // Possible actions / POI
    var actions = {
        "water": { 
            type: "game", 
            icon: icons["game"],
            poi: { x: 83, y: 41, w: 11, h: 3 },
            puzzle: new WaterGame(document.getElementById("bcWater")),
            isActive: function() {
                return true;   
            },
            start: function() {
                this.puzzle.start();
            }
        },
        "vomit": { 
            type: "thought", 
            icon: icons["thought"],
            poi: { x: 65, y: 27, w: 8, h: 16 },
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
            icon: icons["game"],
            poi: { x: 0, y: 0, w: 0, h: 0 },
            puzzle: new GuitarGame(document.getElementById("bcGuitar")),
            isActive: function() {
                return !this.puzzle.isSolved();   
            },
            start: function() {
                this.puzzle.start();   
            }
        },
        "lamp": {
            type: "pickup",
            icon: icons["pickup"],
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
            icon: icons["game"],
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
            icon: icons["thought"],
            poi: { x: 0, y: 0, w: 0, h: 0 },
            isActive: function() {
                return true;
            }, 
            start: function() {
                game.dialogs.push("Hum...", "It looks like someone had some fun right here...", "But I don't remember anything...", "or anyone.");
                game.dialogs.say();
            }
        },
        "bathroom-door": {
            type: "door",
            icon: icons["door"],
            poi: { x: 56, y: 80, w: 5, h: 8 },
            isActive: function () {
                return true
            },
            start: function () {
                document.querySelector('#bcBackground').classList.remove('masked-1')
                document.querySelector('#bcBackground').classList.add('masked-2')
            }
        },
        "bedroom-door": {
            type: "door",
            icon: icons["door"],
            poi: { x: 20, y: 64, w: 10, h: 4 },
            isActive: function () {
                return true
            },
            start: function () {
                document.querySelector('#bcBackground').classList.remove('masked-2')
            }
        },
        // to be continued...
    };

    var game = new Game(scenes, actions);
        
    game.start();
    
});