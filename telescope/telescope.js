"use strict";


function TelescopeGame(element, code) {
    
    // code is only the list of 4 constellations used
    code = Object.keys(code);
    
    var that = this;
    
    var allStarsElement = element.querySelector("#bcTelescopeStars");
        
    var HEIGHT = window.innerHeight * 2;
    var WIDTH = window.innerWidth;

    var coords = []; 
    var starElements = [];
    
    var focusElt = element.querySelector("#bcTelescopeFocus");
    
    for (var i=0; i < code.length; i++) {
        
        var sign = code[i];
        
        var starElement = document.createElement("div");
        starElement.className = "star";
        
        switch (i) {
            case 1: 
                starElement.style.top = "75%";
                starElement.style.left = "50%";
                break;
            case 2: 
                starElement.style.top = "50%";
                starElement.style.left = "75%";
                break;
            case 3: 
                starElement.style.top = "50%";
                starElement.style.left = "25%";
                break;
            default: 
                starElement.style.top = "25%";
                starElement.style.left = "50%";
                break;                
        }
        starElement.style.transform = "translate(-50%,-50%) rotate(" + (Math.random() * 360 | 0) + "deg)";
        starElement.dataset.const = sign;
        allStarsElement.insertBefore(starElement, allStarsElement.lastChild);
        starElements.push(starElement);
    }
    
    var blur = {
        
        currentBlur: [5, 8, 12, 16],
        targetBlur: [5, 8, 12, 16],
        
        playerBlur: 10,
        playerTarget: 10,
        
        distance: function(i) {
            return Math.abs(this.currentBlur[i] - this.playerBlur);   
        }, 
        
        lastU: Date.now(),
        refreshDelta: 40, 
        update: function(now) {
            if (now - this.lastU < this.refreshDelta) {
                return;
            }
            
            if (this.playerBlur != this.playerTarget) {
                this.playerBlur += (this.playerBlur < this.playerTarget) ? 1 : -1;
            }
            
            for (var i in this.currentBlur) {
                if (/*this.currentBlur[i] == this.targetBlur[i] &&*/ this.distance(i) < 5) {
                    this.targetBlur[i] = (this.playerTarget + 10) % 20;
                }
                if (this.targetBlur[i] != this.currentBlur[i]) {
                    this.currentBlur[i] += (this.targetBlur[i] > this.currentBlur[i]) ? 1 : -1;
                }
            }
            this.lastU = now;
            focusElt.style.top = (5 + this.playerBlur * 85 / 20) + "vh";
        }
    }   
    
    
    this.getCode = function() {
        return code;   
    }
 
    var pressed = false;
    element.addEventListener("mousedown", function() { pressed = true; });
    element.addEventListener("mouseout", function() { pressed = false; });
    element.addEventListener("mouseup", function() { pressed = false; });
    element.addEventListener("mousemove", function(e) {
        if (pressed) 
            blur.playerTarget = e.clientY * 20 / window.innerHeight | 0;
    });
    element.addEventListener("touchmove", function(e) {
     //   e.preventDefault();
        if (e.changedTouches[0]) {
            blur.playerTarget = e.changedTouches[0].clientY * 20 / window.innerHeight | 0
        }
    }, { passive: true });

    
    element.querySelector(".btnBack")?.addEventListener("click", function() {
        that.stop(); 
    });
    
    this.start = function() {
        element.classList.add("show");
    }
    
    this.stop = function() {
        element.classList.remove("show");   
        if (this.game) {
            this.game.endgame("telescope");   
        }
    }
    
    this.update = function(now) {
        blur.update(now);   
        for (var i in starElements) {
            starElements[i].style.filter = "blur(" + (blur.distance(i) * 0.1) + "vw)";
        }

    }
    
}