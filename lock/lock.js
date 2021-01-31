"use strict";

function LockGame(element) {
    
    
    element.querySelector("#bcLockInputs").addEventListener("click", function(e) {
        
        if (e.target.tagName != "BUTTON") {
            return;
        }
        
        if (e.target.classList.contains("bcDigitBtnPlus")) {
            var value = 1 * e.target.parentElement.dataset.value + 1;
            if (value > 4) {
                value = 1;   
            }
            e.target.parentElement.dataset.value = value;            
        }
        else if (e.target.classList.contains("bcDigitBtnMoins")) {
            var value = 1 * e.target.parentElement.dataset.value - 1;
            if (value < 1) {
                value = 4;   
            }
            e.target.parentElement.dataset.value = value;            
        }
        else if (e.target.classList.contains("bcDigitBtnColor")) {
            var parent = e.target.parentElement;
            switch (parent.dataset.color) {
                case 'red': 
                    parent.dataset.color = "green";
                    break;
                case 'green': 
                    parent.dataset.color = "yellow";
                    break;
                case 'yellow': 
                    parent.dataset.color = "blue";
                    break;
                case 'blue': 
                    parent.dataset.color = "red";
                    break;
            }
        }
                                                     
    });
    
    element.querySelector(".btnBack").addEventListener("click", function(e) {
        this.stop();
    }.bind(this));
        
    
    this.getCode = function() {
        var tab = [];
        var items = element.querySelectorAll("#bcLockInputs > div");
        for (var i=0; i < items.length; i++) {
            var elem = items.item(i);
            tab.push(elem.dataset.value);
            tab.push(elem.dataset.color);
        }        
        return tab.join("-");
    }
    
    this.isSolved = function() {
        return color.getRGBA(color.target) == color.getRGBA(color.current);   
    }
    
    this.start = function() {
        element.classList.add("show");   
    }
    
    this.stop = function() {
        element.classList.remove("show");   
        console.log(this.getCode());
    }
    
    this.update = function(now) {
        // not used here   
    }
    
}