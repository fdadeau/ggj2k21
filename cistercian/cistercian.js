"use strict";

function CistercianGame(element) {
    
    
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

    var zeCode = [-1];
    
    function check() {
        for (var i=1; i < 5; i++) {
            if (element.querySelector("#bcCistercianCode > div:nth-child("+i+")").dataset.number !=
                element.querySelector(".bcCistercianNumber:nth-child("+i+")").innerHTML) {
                    return false;   
            }
        }
        return true;
    }
    
    this.start = function(code) {
        zeCode = code;
        code = "" + code;
        element.querySelector("#bcCistercianCode > div:nth-child(1)").dataset.number = code.substr(0,1);
        element.querySelector("#bcCistercianCode > div:nth-child(2)").dataset.number = code.substr(1,1);
        element.querySelector("#bcCistercianCode > div:nth-child(3)").dataset.number = code.substr(2,1);
        element.querySelector("#bcCistercianCode > div:nth-child(4)").dataset.number = code.substr(3,1);
        element.classList.add("show");   
    }
    
    this.stop = function() {
        element.classList.remove("show");   
    }
    
    this.update = function(now) {
        // not used here   
    }
    
}