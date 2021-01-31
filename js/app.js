"use strict";

document.addEventListener("DOMContentLoaded", function(e) {
    
    // SCENES
    var scenes = { 
        "sdb": { 
            zonesOK: [ 
                { x: 65, y: 27, w: 11, h: 30 },
                { x: 6, y: 41, w: 98, h: 34 },
                { x: 56, y: 75, w: 25, h: 20 }
            ], 
            text: [ 
                "Ouch, what a headache!", 
                "Where am I?", 
                "Hum it looks like the door is closed.", 
                "I need to find a way to get out of here...",
                "and find out what I'm doing there." 
            ]
            // maybe other things later...?
        }, 
        "chambre": { 
            zonesOK: [
                
            ],
            text: [
                "OK it looks like a room.", 
                "Quite familiar...",
                "...but I'm definitely not in my home."
            ]
        }, 
        "spaceship": {
            zonesOK: [
            
            ],
            text: [
                "OK... that's unusual...", 
                "I'm in a sort of... spaceship ?!?",
                "How the f*** is it possible?"
            ]
        }
    };
    
    
    // Possible actions / POI
    var actions = {
        "water": { 
            type: "game", 
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
        "bathroom-door": {
            type: "action",
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
            type: "action",
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