"use strict";

function LockGame(element) {
    
    
    element.querySelector("#bcLockColorInputs").addEventListener("click", function(e) {
        
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
        else if (e.target.classList.contains("bcDigitBtnMinus")) {
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
        

    var that = this;
    var alarm = new Audio("./lock/assets/alarm.mp3");
    
    element.querySelector("#bcLockColorHandle").addEventListener("click", function(e) {
        if (!alarmIsDisabled) {
            alarm.play();
        }
        that.stop();
        if (that.game) {
            that.game.endgame("colorlock");   
        }
    });
    
    
    this.getCode = function() {
        var tab = [];
        var items = element.querySelectorAll("#bcLockColorInputs > div");
        for (var i=0; i < items.length; i++) {
            var elem = items.item(i);
            tab.push({ color: elem.dataset.color, value: elem.dataset.value });
        }        
        return tab;
    }
    

    // intternal data - to be set up when the puzzle starts
    var alarmIsDisabled = false; 
    var expectedCode;
    var expectedOrder;
    
    
    /**
     *  Returns:
     *      1  -> solved
     *      -1 -> alarm is not disabled
     *      -2 -> wrong code
     *      -3 -> good code, but wrong order
     */
    this.isSolved = function() {
        // first, check alarm
        if (!alarmIsDisabled) {
            return -1;   
        }
        var key = { red: "R", green: "G", yellow: "A", blue: "B" };
        // check number and values
        var code = this.getCode();      // [ { color: value }, ... x 4 ]
        for (var i in code) {
            var c = code[i].color;
            var v = code[i].value;
            if (expectedCode[c] != v) {
                return -2;   
            }
        }
        // check ordering
        for (var i=0; i < code.length; i++) {
            var c = code[i].color;
            var k = key[c];
            if (expectedOrder[k] != i+1) {
                return -3;
            }
        }
        // all right
        return 1;
    }
     
    this.start = function(colorCode, order, alarmOff) {
        alarmIsDisabled = alarmOff;
        expectedCode = colorCode;   // { red: 1..4, green: 1..4, yellow: 1..4, blue: 1..4 }
        expectedOrder = order;      // { R: 1..4, G: 1..4, B: 1..4, 
        element.classList.add("show");   
        console.log("expected code", colorCode);
        console.log("expected order", order);
    }
    
    this.stop = function() {
        element.classList.remove("show");   
        console.log("solved = ", this.isSolved());
    }
    
    this.update = function(now) {
        // not used here   
    }
    
}