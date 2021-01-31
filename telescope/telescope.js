"use strict";


function TelescopeGame(element) {
    
    var values = [1,2,3,4,5,6,7,8,9];
    var coordsX = [ 30, 40, 50, 60, 70, 80 ];
    var coordsY = [ 70, 60, 50, 30, 40, 30 ];

    var code = [];
    
    var allStarsElement = element.querySelector("#bcTelescopeStars");
        
    var HEIGHT = window.innerHeight * 2;
    var WIDTH = window.innerWidth;

    var coords = []; 
    var starElements = [];
    
    while (code.length < 4) {
        var i = Math.random() * values.length | 0;
        code.push(values[i]);
        var starElement = document.createElement("div");
        starElement.className = "star";
        
        do {
            var x = (Math.random() * WIDTH * 0.8 + WIDTH * 0.1) | 0;
            var y = (Math.random() * HEIGHT * 0.8 + HEIGHT * 0.1) | 0;
            var xM = WIDTH / 2;
            var yM = HEIGHT / 2;
            var deltaX = (x-xM)*(x-xM);
            var deltaY = (y-yM)*(y-yM);
            var dist = Math.sqrt(deltaX + deltaY);
        }
        while (dist < HEIGHT*0.2 || dist > HEIGHT*0.4 || coords.some(e => {
            return ((x-e.x)*(x-e.x)+(y-e.y)*(y-e.y)) < 40000;
        }));
        coords.push({x: x, y: y });
        
        starElement.style.top = (100 * y / HEIGHT) + "%";
        starElement.style.left = (100 * x / WIDTH) + "%";
        starElement.style.transform = "translate(-50%,-50%) rotate(" + (Math.random() * 360 | 0) + "deg)";
        starElement.dataset.number = values[i];
        starElement.dataset.order = code.length;
        allStarsElement.appendChild(starElement);
        starElements.push(starElement);
        values.splice(i, 1);
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
        }
    }   
    
 
    element.addEventListener("touchmove", function(e) {
        e.preventDefault();
        if (e.changedTouches[0]) {
            blur.playerTarget = e.changedTouches[0].clientY * 20 / window.innerHeight | 0
        }
    });
    
    this.start = function() {
        element.classList.add("show");
    }
    
    this.stop = function() {
        element.classList.remove("show");   
    }
    
    this.update = function(now) {
        blur.update(now);   
        for (var i in starElements) {
            starElements[i].style.filter = "blur(" + (blur.distance(i) * 0.1) + "vw)";
        }

    }
    
}