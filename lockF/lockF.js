"use strict";

function LockFGame(element) {
    
    var that = this;

    var display = element.querySelector("table td[colspan]");
    element.querySelector("table").addEventListener("click", function(e) {
        
        if (e.target.tagName != "TD") {
            return;
        }
        
        switch (e.target.dataset.key) {
            case "C": 
                display.innerHTML = "";
                break;
            case "V": 
                that.check();
                break;
            default: 
                if (display.innerHTML.length < 6) {
                    display.innerHTML += e.target.dataset.key;
                }
        }
    });
    
    element.querySelector(".btnBack").addEventListener("click", function(e) {
        this.stop();
    }.bind(this));
        


    var code;
    
    this.check = function() {
        if (this.isSolved()) {
            this.stop();
        }
        else {
            element.querySelector("table tr td[colspan]").innerHTML = "-ERROR-";    
        }
    }
    
    this.isSolved = function() {
        return element.querySelector("table tr td[colspan]").innerHTML == code.join("");
    }
     
    this.start = function(expCode, expOrder) {
        if (DEBUG) console.log(expCode, expOrder);
        code = expOrder.map(e => expCode[e]);
        element.classList.add("show");   
    }
    
    this.stop = function() {
        element.classList.remove("show");   
        if (this.game){
            this.game.endgame("lockF");   
        }
    }
    
    this.update = function(now) {
        // not used here   
    }
    
}