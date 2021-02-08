"use strict";

function CistercianGame(element) {
    
    
    var that = this;
    element.querySelector(".btnBack").addEventListener("click", function(e) {
        that.stop();
    });

            
    element.querySelector("#bcCistercianLock").addEventListener("click", function(e) {
        if (e.target.classList.contains("bcCistercianNumber")) {
            e.preventDefault();
            var value = parseInt(e.target.innerHTML);   
            var previous, next;
            var bb = e.target.getBoundingClientRect();
            if (e.clientY < (bb.top + bb.bottom) / 2) {
                value++;
                previous = value - 1;
                next = value + 1;
                if (value > 9) {
                    value = 0;   
                }
                if (next > 9) {
                    next -= 10;   
                }
            }
            else {
                value--;
                previous = value - 1;
                next = value + 1;
                if (value < 0) {
                    value = 9;
                }
                if (previous < 0) {
                    previous += 10;   
                }
            }
            e.target.innerHTML = value;
            e.target.dataset.previous = previous;
            e.target.dataset.next = next;
            if (check()) {
                element.classList.add("opened");
            }
        }
    });

    var zeCode = [Math.random() * 8 + 1 | 0, Math.random() * 8 + 1 | 0, Math.random() * 8 + 1 | 0, Math.random() * 8 + 1 | 0];
    var solved = false;
    
    function check() {
        for (var i=1; i < 5; i++) {
            if (element.querySelector(".bcCistercianNumber:nth-child("+i+")").innerHTML != zeCode[i-1]) {
                    return false;   
            }
        }
        solved = true;
        return true;
    }

    
    this.start = function() {
        element.classList.add("show");   
    }
    
    this.isSolved = function() {
        return solved;
    }
    
    this.getCode = function() {
        return zeCode.join("");   
    }
    
    this.stop = function() {
        element.classList.remove("show");   
        if (this.game) {
            this.game.endgame("cistercian");   
        }
    }
    
    this.update = function(now) {
        // not used here   
    }
    
}