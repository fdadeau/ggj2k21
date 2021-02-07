"use strict";

function LinkyGame(element) {
    
    // block containing the checkboxes
    var bcLinky = element.querySelector("#bcLinkyBox");
    
    for (var i=1; i < 10; i++) {
        var input = document.createElement("input");
        input.type = "checkbox";
        input.value = i;
        input.id = "cb" + i;
        input.checked = (Math.random() < 0.5);
        input.addEventListener("change", checkCode);
        bcLinky.appendChild(input);
        var label = document.createElement("label");
        label.setAttribute("for", input.id);
        label.dataset.number = i;
        bcLinky.appendChild(label);
    }
        
    var that = this;
    
    element.querySelector(".btnBack").addEventListener("click", function() {
        that.stop(); 
    });
    
    function checkCode() {
        var bcLight = document.querySelector('[class$="light"]');
        if (alarmIsDisabled && bcLight) {
            // check code 
            if (that.getCode().length == zeCode.length && that.getCode().every(e => zeCode.indexOf(1*e) >= 0)) {
                bcLight.className = "";
                element.classList.add("alarmoff");
            }
        }
        else {
            this.checked = !this.checked;  
        }
    };

    this.getCode = function() {
        var selected = bcLinky.querySelectorAll('input[type="checkbox"]:checked');
        var ret = [];
        for (var i=0; i < selected.length; i++) {
            ret.push(selected.item(i).value);
        }
        return ret;
    }
    
    
    var alarmIsDisabled;
    var zeCode = [-1];
    
    this.start = function(code, alarmOff) {
        zeCode = code;
        alarmIsDisabled = alarmOff;
        element.classList.add("show");   
        console.log("zeCode = ", zeCode);
        console.log("current = ", this.getCode());
    }
    
    this.stop = function() {
        element.classList.remove("show");  
        if (this.game) {
            this.game.endgame("disjunct");   
        }
    }
    
    this.update = function(now) {
        // not used here   
    }
    
}