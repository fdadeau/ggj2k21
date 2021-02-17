"use strict";

function LockZGame(element) {
    
    var that = this;

    element.querySelector("#bcLockZContent").addEventListener("click", function(e) {
        
        if (e.target.dataset.sign == undefined) {
            return;
        }
        
        var bb = e.target.getBoundingClientRect();
        var value = 1 * e.target.dataset.value;
        if (e.clientX > bb.left + (bb.width * 6 / 7)) {
            if (value < 4) {
                value++;
            }
        }
        else {
            if (value > 0) {
                value--;   
            }
        }
        e.target.dataset.value = value;    
        
        console.log(that.isSolved());
        if (that.isSolved()) {
            that.stop();   
        }
    });
    
    element.querySelector(".btnBack").addEventListener("click", function(e) {
        that.stop();
    });
        
    var code = {};
    
    this.isSolved = function() {
        var elems = element.querySelectorAll("#bcLockZContent > div");
        for (var i=0; i < elems.length; i++) {
            console.log(elems.item(i).dataset.value, elems.item(i).dataset.sign);
            if (code[elems.item(i).dataset.sign]) {
                if (elems.item(i).dataset.value != code[elems.item(i).dataset.sign]) {
                    return false;   
                }
            }
            else if (elems.item(i).dataset.value != 0) {
                return false;
            }
        }
        return true;
    }
     
    this.start = function(c) {
        code = c;
        console.log(c);
        element.classList.add("show");   
    }
    
    this.stop = function() {
        element.classList.remove("show");   
        console.log("solved = ", this.isSolved());
        if (this.game){
            this.game.endgame("lockZ");   
        }
    }
    
    this.update = function(now) {
        // not used here   
    }
    
}