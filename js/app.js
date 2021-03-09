"use strict";

document.addEventListener("DOMContentLoaded", function(e) {
    
    var puzzleDetail = new DetailGame(document.getElementById("bcDetail"));
    
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
            //start: { x: 25, y: 25 },
            // maybe other things later...?
        }, 
        "chambre": { 
            zonesOK: [
                { x: 16, y: 95, w: 35, h: 3 },       // bed-bottom
                { x: 35, y: 73, w: 12, h: 22 },      // bed-right + door to bathroom
                { x: 7, y: 66, w: 35, h: 9 }         // bed-top + door to spaceship
            ],
            text: [
                "OK it looks like a bedroom.", 
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
    
    
    var codes = {
        cistercian: Math.random() * 10000 | 0, 
        water: null,
        guitar: null,
        linky: null,
        radio: null,
        zodiac: {},
        aliens: null,
        init: function() {
            // Water: 
            
            
            // Zodiac: 
            var signes = ["aries", "cancer", "taurus", "sagittarius", "leo", "scorpio", "aquarius", "virgo", "capricorn", "pisces", "gemini", "libra"];
            for (var i=1; i <= 4; i++) {
                var k = Math.random() * signes.length | 0;
                var s = signes[k]; 
                this.zodiac[s] = i;
                signes.splice(k, 1);
            }
        }
    }
    codes.init();
    console.log(codes.zodiac);

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
                if (!actions.dirtykey.done) {
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
                    game.dialogs.push("Yes! It worked!", "And I can use the key to exit the room.");
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
            puzzle: puzzleDetail,
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
            puzzle: puzzleDetail,
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
                return !this.done;
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
                    game.dialogs.push("There is something in the toilet bowl.");
                    game.dialogs.say();
                    game.render();
                }
            }
        },
        "dirtykey": {
            type: "pickup",
            poi: { x: 57, y: 73, w: 4, h: 2 },
            isActive: function() {
                return actions.cistercian.done && !this.done;
            },
            done: false,
            start: function() {
                this.done = true;  
                game.dialogs.push("It's a key!", "But it is...quite dirty...", "I should wash it if I want to use it."); 
                game.dialogs.say();
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
                game.dialogs.push("What the hell is this... thing?"); 
                game.dialogs.say(() => this.puzzle.start());   
            }
        },
        "constellations_map": {
            type: "game", 
            poi: { x: 34, y: 65, w: 6, h: 2 },
            puzzle: puzzleDetail,
            isActive: function() {
                return true;    
            },
            start: function() {
                this.puzzle.game = game;
                this.puzzle.start("constellations");   
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
                return DEBUG == false && this.puzzle.isSolved() < 0;
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
        // Spaceship
        "photos": {
            type: "game",
            poi: {x : 73, y: 35, w: 2, h: 6 },
            isActive: function() {
                return actions["lockZ"].done;    // TODO need to unlock file   
            },
            puzzle: puzzleDetail,
            done: false,
            start: function() {
                this.puzzle.game = game;
                if (!this.done) {
                    game.dialogs.push("OK let's see what's in this...", "Oh my God!");
                }
                else {
                    game.dialogs.push("Do we really need to watch this again?");
                }
                game.dialogs.say(() => this.puzzle.start("photos"));
            },
            end: function() {
                if (!this.done) {
                    game.dialogs.push("This is insane!", "Now I understand why I feel so dizzy...", "I need to escape quickly!");
                    this.done = true;
                }
                else {
                    game.dialogs.push("I think I'm about to puke...", "again.");
                }
                game.dialogs.say();
            }
        },
        "cups": {
            type: "thought",
            poi: {x : 34, y: 40, w: 2, h: 5 },
            isActive: function() {
                return true;   
            },
            start: function() {
                if (actions["photos"].done) {
                    game.dialogs.push("It looks like those who did this to me", "participated to the GGJ 2021 in Besancon...");
                }
                else {
                    game.dialogs.push("These are nice mugs from the GGJ 2021 in Besancon");   
                }
                game.dialogs.say();
            }
        },    
        "emergency_meeting": {
            type: "thought",
            poi: {x : 50, y: 44, w: 6, h: 1 },
            isActive: function() {
                return true;   
            },
            start: function() {
                if (actions["photos"].done) {
                    game.dialogs.push("I don't want to call these creatures.", "My first encounter was sufficient.");
                }
                else {
                    game.dialogs.push("I'm not sure it is a good idea to call for a meeting...", "besides, the button is unplugged.");   
                }
                game.dialogs.say();
            }
        },     
        "telescope": {
            type: "game",
            poi: {x : 55, y: 20, w: 10, h: 2 },
            isActive: function() {
                return true;
            },
            puzzle: new TelescopeGame(document.getElementById("bcTelescope"), codes.zodiac),
            start: function() {
                this.puzzle.game = game;
                game.dialogs.push("This telescope points to the stars.", "I can adjust the focus by swiping up and down.");
                game.dialogs.say(() => this.puzzle.start());
            }
        },
        "lockZ": {
            type: "game",
            poi: {x : 73, y: 35, w: 2, h: 6 },
            done: false,
            isActive: function() {
                return !this.done;
            },
            puzzle: new LockZGame(document.getElementById("bcLockZ"), codes.zodiac),
            start: function() {
                this.puzzle.game = game;
                game.dialogs.push("It looks like there is combination to open this file.");
                game.dialogs.say(() => this.puzzle.start(actions["zodiac_game"].puzzle.getCode()));
            },
            end: function() {
                if (!this.done) {
                    if (this.puzzle.isSolved()) {
                        this.done = true;
                        game.startgame("photos");   
                    }
                    else {
                        game.dialogs.push("It looks like only some of the tabs are useful...");
                        game.dialogs.say();
                    }
                }
            }
        },
        "zodiac_game": {
            type: "game",
            poi: {x : 23, y: 23, w: 5, h: 2 },
            isActive: function() {
                return true;
            },
            puzzle: new ZodiacGame(document.getElementById("bcZodiac"), codes.zodiac),
            start: function() {
                this.puzzle.game = game;
                this.puzzle.start();
            }
        },
        "gobelet": {
            type: "game",
            poi: {x : 12, y: 23, w: 5, h: 2 },
            isActive: function() {
                return true;
            },
            puzzle: new GobeletGame(document.getElementById("bcGobelet")),
            start: function() {
                this.puzzle.game = game;
                this.puzzle.start();
            }
        },
        "lockF": {
            type: "game",
            poi: { x: 5, y: 25, w: 2, h: 8 },
            isActive: function() {
                return true;
            },
            puzzle: new LockFGame(document.getElementById("bcLockF")),
            start: function() {
                this.puzzle.game = game;
                this.puzzle.start(actions["photos"].puzzle.getCode(), actions["gobelet"].puzzle.getCode());
            },
            end: function() {
                if (this.puzzle.isSolved()) {
                    game.startgame("nes");   
                }
            }
        },
        "nes": {
            type: "game",
            poi: { x: 5, y: 25, w: 0, h: 0 },
            isActive: function() {
                return false;   
            },
            puzzle: new NesGame(document.getElementById("bcNes")),
            start: function() {
                this.puzzle.game = game;
                game.dialogs.push("Hurray! The doors are opening!", "But, wait a minute...");
                game.dialogs.say(() => this.puzzle.start());
            },
            end: function() {
                
            }
        },
     
        
        // Doors
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
                return DEBUG || !actions.colorlock.isActive();
            },
            start: function () {
                document.querySelector('#bcBackground').classList.remove('masked-2')
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