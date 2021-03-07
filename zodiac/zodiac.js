"use strict";

function ZodiacGame(element, code) {
    
    var that = this;
    
    this.code = code;
    
    element.querySelector(".btnBack").addEventListener("click", function() {
        that.stop(); 
    });
    
    var bcContent = element.querySelector("#bcZodiacContent");
    
    // init game content: 
    var all_signs = ["aries", "cancer", "taurus", "sagittarius", "leo", "scorpio", "aquarius", "virgo", "capricorn", "pisces", "gemini", "libra"];
    
    // signs
    var signs = [...all_signs];
    var posX = ["- 25vw", "- 32vw", "- 36vw", "- 36vw", "- 32vw", "- 25vw", "+ 25vw", "+ 32vw", "+ 36vw", "+ 36vw", "+ 32vw", "+ 25vw" ];
    var posY = ["- 30vh", "- 20vh", "- 7vh", "+ 7vh", "+ 20vh", "+ 30vh", "- 30vh", "- 20vh", "- 7vh", "+ 7vh", "+ 20vh", "+ 30vh" ];
    var i=0;
    var signPos = {};
    while (signs.length > 0) {
        var divSign = document.createElement("div");
        var s = signs.splice(Math.random() * signs.length | 0, 1)[0];
        divSign.className = "sign " + s;
        divSign.style.left = "calc(50% " + posX[i] + ")";
        divSign.style.top = "calc(50% " + posY[i] + ")";
        bcContent.insertBefore(divSign, bcContent.firstChild);
        signPos[s] = i;
        i++;
    }    
    
    
    var riddle = {
        // last update
        lastU: Date.now(),
        // interval between updates
        delta: 1000, 
        // sequence of actions
        sequence: [],
        // created symbols
        created: [],
        // reset riddle 
        reset: function() {
            while (this.created.length > 0) {
            var d = this.created.splice(0, 1);   
                bcContent.removeChild(d[0].what);
            }
            this.lastU = Date.now();
        },
        // update display
        update: function(now) {
            if (now < this.lastU + this.delta) {
                return;   
            }
            this.lastU = now;   
            // start last added
            if (this.created.length > 0) {
                var lastOne = this.created[this.created.length - 1];
                if (lastOne.todo != null) {
                    lastOne.what.style.left = "50%";
                    lastOne.what.style.top = (lastOne.todo == "enter") ? "60%" : "90%";
                    lastOne.todo = null;
                }
            }
            // remove expired ones
            while (this.created.length > 0 && this.created[0].expires < now) {
                var d = this.created.splice(0, 1);   
                bcContent.removeChild(d[0].what);
            }
            // exit if nothing more to do in the sequence
            if (this.sequence.length == 0) {
                return;
            }
            // determine what to do
            var act = this.sequence.splice(0, 1);
            act = act[0];

            var div = document.createElement("div");
            if (act.enter !== undefined) {
                var i = signPos[act.enter];
                div.setAttribute("class", "sign " + act.enter);
                div.style.left = "calc(50% " + posX[i] + ")";
                div.style.top = "calc(50% " + posY[i] + ")";
                act = "enter";
            }
            else if (act.exit !== undefined) {
                div.setAttribute("class", "sign " + act.exit);
                div.style.left = "50%";
                div.style.top = "60%";
                act = "exit";
            }
            this.created.push({ expires: now + 2500, what: div, todo: act }); 
            bcContent.insertBefore(div, bcContent.firstChild);
        },
           
    }
    
    
    var seq = (function() {
        var signes = [...all_signs];
        var entrees = {};
        var sorties = {};
        for (var s in code) {
            sorties[s] = Math.random() * 3 | 0;
            entrees[s] = code[s] + sorties[s];
        }
        for (var k of signes) {
            if (!code[k]) {
                entrees[k] = Math.random() * 5 | 0;
                sorties[k] = Math.random() * entrees[k] | 0
            }
        }
        var sequence = [];
        
        for (var k in entrees) {
            for (var i=0; i < entrees[k]; i++) {
                sequence.push({enter : k});
            }
        }
        shuffle();

        for (var k in sorties) {
            for (var i=0; i < sorties[k]; i++) {
                insertExitAtRandom(k)   
            }
        }
                
        return sequence; 
        
        function shuffle() {
            // not very random, but testing
            for (var i=0; i < sequence.length * 2; i++) {
                var k1 = Math.random() * sequence.length | 0;   
                var k2 = Math.random() * sequence.length | 0;   
                var temp = sequence[k1];
                sequence[k1] = sequence[k2];
                sequence[k2] = temp;                
            }
        }
        
        function insertExitAtRandom(sign) {
            var lastDec = 0;
            var nextInc = -1;
            for (var i=0; i < sequence.length; i++) {
                if (sequence[i].enter == sign && i > lastDec && nextInc == -1) {
                    nextInc = i;   
                }
                else if (sequence[i].exit == sign) {
                    lastDec = i;
                    nextInc = -1;
                }
            }
            var max = Math.max(lastDec, nextInc) + 1;
            var rand = (Math.random() * (sequence.length - max) + max) | 0;   
            sequence.splice(rand, 0, { exit: sign });
        }
        
    })();
    
    function verifSeq(sequensse) {
        var t = {};
        for (var a=0; a < sequensse.length; a++) {
            var act = sequensse[a];
            if (act.enter !== undefined) {
                t[act.enter] = t[act.enter] !== undefined ? t[act.enter]+1 : 1;
            }   
            else if (act.exit !== undefined) {
                if (t[act.exit] === undefined || t[act.exit] == 0) {
                    return a;   
                }
                t[act.exit]--;
            }
        }
         return -1;
    }
    
    this.getCode = function() {
        return this.code;   
    }
    
    this.start = function() {
        riddle.reset();
        riddle.sequence = [...seq];
        element.classList.add("show");
    }
    
    this.stop = function() {
        riddle.reset();
        element.classList.remove("show");
        if (this.game) {
            this.game.endgame("zodiac");   
        }
    }
    
    this.update = function(now) {
        riddle.update(now);
    }
    
}