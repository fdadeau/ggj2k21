"use strict";

function GobeletGame(element) {
    
    var that = this;
    element.querySelector(".btnBack").addEventListener("click", function() {
        that.stop(); 
    });
    
    
    var bcContent = element.querySelector("#bcGobeletContent");
    // initialize content
    var cards = ["hearts", "spades", "clubs", "diams"];
    var cardElements = {};
    for (var c in cards) {
        var bcCard = document.createElement("div");
        bcCard.className = "card " + cards[c];
        bcCard.style.left = (20 + c * 20) + "vw";
        bcCard.style.top = "60vh";
        cardElements[cards[c]] = bcCard; 
        bcContent.appendChild(bcCard);
    }
    
    // the code (order of the cards)    
    var code = [...cards];
    
    var swaps = {
        // last update 
        lastU: Date.now(),
        //
        delta: 2000,
        // current index in the sequence 
        current: -3,
        // sequence initialization
        sequence: (function() {
            var souapes = [];
            for (var i=0; i < 8; i++) {
                var k1 = Math.random() * 4 | 0;
                do {
                    var k2 = (Math.random() * 4 | 0);
                }
                while (k1 == k2);
                souapes.push({ fst: k1, snd: k2 });
                var tmp = code[k1];
                code[k1] = code[k2];
                code[k2] = tmp;
            }
            return souapes;
        })(),
        // reset
        reset: function() {
            console.log(this.sequence);
            this.lastU = Date.now();
            this.current = -2;
            this.code = [...cards];
            cards.forEach(function(c,i) { cardElements[c].style.left = (20 + i * 20) + "vw"; });
            bcContent.classList.remove("hidden");
        },
        // 
        hasNext: function() {
            return this.current < this.sequence.length - 1;   
        }, 
        code: [...cards],
        // 
        update: function(now) {
            if (now < this.lastU + this.delta) {
                return;
            }
            this.lastU = now;
            if (this.current >= this.sequence.length) {
                return;
            }
            if (this.current == -1) {
                bcContent.classList.add("hidden");
            }
            else if (this.current >= 0) {
                var souap = this.sequence[this.current];
                // move elements
                cardElements[this.code[souap.fst]].style.left = (20 + souap.snd * 20) + "vw";
                cardElements[this.code[souap.snd]].style.left = (20 + souap.fst * 20) + "vw";
                // swap content in code
                var tmp = this.code[souap.fst];
                this.code[souap.fst] = this.code[souap.snd];
                this.code[souap.snd] = tmp;                
            }
            this.current++;
        }
        
    }
    
    
    this.getCode = function() {
        return code;
    }
    
    
    this.start = function() {
        swaps.reset();   
        console.log(code);
        element.classList.add("show");
    }
    
    this.stop = function() {
        element.classList.remove("show");
        if (this.game) {
            this.game.endgame("gobelet");   
        }
    }
    
    this.update = function(now) {
        swaps.update(now)
    }
    
}