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
            start: { x: 65, y: 80 },
            // maybe other things later...?
        }, 
        "chambre": { 
            zonesOK: [
                { x: 16, y: 95, w: 35, h: 3 },       // bed-bottom
                { x: 35, y: 73, w: 12, h: 22 },      // bed-right + door to bathroom
                { x: 7, y: 66, w: 35, h: 9 }         // bed-top + door to spaceship
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
                "I'm in a sort of... SPACESHIP!?",
                "How the f*** is it possible?!",
                "I need to find out what I'm doing there,", 
                "and then get the hell out of here."
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
            done: false,
            start: function() {
                if (!actions.cistercian.puzzle.isSolved()) {
                    game.dialogs.push("I have nothing to wash.");
                    game.dialogs.say();
                    game.endgame("water");
                    return;
                }
                this.puzzle.game = game;
                if (!this.puzzle.isSolved()) {
                    game.dialogs.push("Something seems to be broken in there.", "The water is cut, I should try to fix it."); 
                    game.dialogs.say(() => this.puzzle.start());
                }
                else {
                    this.puzzle.start();
                }
            }, 
            end: function() {
                if (this.done == false && this.puzzle.isSolved()) {
                    this.done = true;
                    game.dialogs.push("Yes! It worked!", "And I now get the key of the bathroom!", "I can exit the room.");
                    game.dialogs.say();
                }
            }
        },
        "vomit": { 
            type: "thought", 
            poi: { x: 65, y: 68, w: 8, h: 6 },
            isActive: function() {
                return true;   
            },
            start: function() { 
                game.dialogs.push("Ouch. I hope this isn't mine...", "This is disgusting."); 
                game.dialogs.say(); 
            } 
        }, 
        "shower": {
            type: "game",
            poi: { x: 81, y: 88, w: 2, h: 8 },
            puzzle: new DetailGame(document.getElementById("bcDetail")),
            isActive: function() {
                return true;   
            },
            start: function() {
                this.puzzle.game = game;
                game.dialogs.push("That shower curtain has some funny patterns on it."); 
                game.dialogs.say(() => this.puzzle.start("shower"));
            }
        },
        "towel": {
            type: "game",
            poi: { x: 76, y: 68, w: 2, h: 3 },
            puzzle: new DetailGame(document.getElementById("bcDetail")),
            isActive: function() {
                return true;   
            },
            start: function() {
                this.puzzle.game = game;
                game.dialogs.push("That towel has a funny pattern on it."); 
                game.dialogs.say(() => this.puzzle.start("towel", actions.cistercian.puzzle.getCode()));
            }
        },
        "cistercian": {
            type: "game",
            poi: { x: 57, y: 73, w: 4, h: 2 },
            puzzle: new CistercianGame(document.getElementById("bcCistercian")),
            isActive: function() {
                return true;
            },
            start: function() {
                this.puzzle.game = game;
                game.dialogs.push("There is a locker on the toilet bowl."); 
                game.dialogs.say(() => this.puzzle.start());
            },
            done: false,
            end: function() {
                if (this.puzzle.isSolved() && !this.done) {
                    this.done = true;
                    game.dialogs.push("There is something in the toilet bowl.", "It's a key!", "But it is...quite dirty...", "I should wash it if I want to use it.");
                    game.dialogs.say();
                }
            }
        },
        // Room
        "guitar": {
            type: "game",
            poi: { x: 40, y: 68, w: 8, h: 6 },
            puzzle: new GuitarGame(document.getElementById("bcGuitar")),
            isActive: function() {
                return !this.puzzle.isSolved();   
            },
            start: function() {
                this.puzzle.game = game;
                game.dialogs.push("That guitar has a broken string...", "Well, that reminds me some music..."); 
                game.dialogs.say(() => this.puzzle.start()); 
            },
            end: function() {
                if (this.puzzle.isSolved()) {
                    document.querySelector("main").classList.add("nolight");
                    game.dialogs.push("Ouch!", "The lights are out!", "Maybe there is a flashlight somewhere...");
                    game.render();  // remove POI
                }
                else {
                    game.dialogs.push("Hum... that's difficult...", "but I need to try harder to find the melody.");
                }
                game.dialogs.say();
            }
        },
        "lamp": {
            type: "pickup",
            poi: { x: 6, y: 73, w: 6, h: 3 },
            done: false,
            mainElt: document.querySelector("main"),
            isActive: function() {
                return !this.done && this.mainElt.classList.contains("nolight");  
            },
            start: function() {
                this.done = true;  
                this.mainElt.classList.add("light");
                this.mainElt.classList.remove("nolight");
            }
        }, 
        "radio": {
            type: "game",
            poi: { x: 12, y: 95, w: 5, h: 3 },
            puzzle: new RadioGame(document.getElementById("bcRadio")),
            isActive: function() {
                return true;
            },
            start: function() {
                this.puzzle.game = game;
                this.puzzle.start();   
            }
        },
        "disjunct": {
            type: "game", 
            poi: { x: 6, y: 65, w: 5, h: 3 },
            puzzle: new LinkyGame(document.getElementById("bcLinky")),   
            isActive: function() {
                return true;
            }, 
            start: function() {
                this.puzzle.game = game;
                this.puzzle.start(actions.sourpent.puzzle.getCode(), actions.guitar.puzzle.isSolved());   
            }
        },
        "sourpent": {
            type: "game", 
            poi: { x: 14, y: 65, w: 3, h: 3 },
            puzzle: new RatGame(document.getElementById("bcRat")),
            mainElt: document.querySelector("main"), 
            isActive: function() {
                return this.mainElt.classList.contains("light");    
            },
            start: function() {
                this.puzzle.game = game;
                this.puzzle.start();   
            }
        },
        "bed": {
            type: "thought", 
            poi: { x: 34, y: 76, w: 2, h: 17 },
            isActive: function() {
                return true;
            }, 
            start: function() {
                game.dialogs.push("Hum...", "It looks like someone had some fun right here...", "But I don't remember anything...", "...or anyone.");
                game.dialogs.say();
            }
        },
        "colorlock": {
            type: "game",
            poi: { x: 20, y: 65, w: 10, h: 2 },
            puzzle: new LockGame(document.getElementById("bcLockColor")),
            isActive: function () {
                return this.puzzle.isSolved() < 0;
            },
            start: function() {
                this.puzzle.game = game;
                this.puzzle.start(actions.radio.puzzle.getCode(), actions.water.puzzle.getCode(), actions.guitar.puzzle.isSolved());
            },
            end: function() {
                if (this.puzzle.isSolved() > 0) {
                    document.querySelector('#bcBackground').classList.remove('masked-2');
                    game.hero.setPosition(22, 46);
                    game.render();
                    game.dialogs.push(...scenes.spaceship.text);
                    game.dialogs.say();
                    return;
                }
                if (this.puzzle.isSolved() == -1) {
                    game.dialogs.push("Oops, I need to disable the alarm.");
                    game.dialogs.say();
                    return;
                }
                if (this.puzzle.isSolved() == -2) {
                    game.dialogs.push("That didn't work.");
                    game.dialogs.say();
                    return;
                }
                if (this.puzzle.isSolved() == -3) {
                    game.dialogs.push("The code seems to be correct, ", "but maybe it's in the wrong order.");
                    game.dialogs.say();
                    return;
                }
                
            }
        },        
        "bathroom-exit-door": {
            type: "door",
            poi: { x: 57, y: 80, w: 2, h: 8 },
            firstTime: true,
            isActive: function () {
                return true;
            },
            start: function () {
                if (DEBUG || actions.water.puzzle.isSolved()) {
                    document.querySelector('#bcBackground').classList.remove('masked-1')
                    document.querySelector('#bcBackground').classList.add('masked-2')
                    game.hero.setPosition(46, 84);
                    game.render();
                    if (this.firstTime) {
                        game.dialogs.push(...scenes.chambre.text);
                        game.dialogs.say();
                        this.firstTime = false;
                    }
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
                return !actions.colorlock.isActive();
            },
            start: function () {
                game.hero.setPosition(22, 46);
                game.render();
            }
        },
        "bedroom-entry-door": {
            type: "door",
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
            type: "door",
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