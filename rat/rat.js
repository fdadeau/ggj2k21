"use strict";


function RatGame(element) {
    
    function sqDistance(p1, p2) {
        return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
    }
    
    var beast = {
        
        speed: 0.6,
        
        timeBeforeMovement: 2000,   // 0: moving, > 0 delay before movement (ms)
        
        // current position
        position: { x: 50, y: 50 },
        
        // target point & destination
        target: null,
        direction: {x: 0, y: 0},
        
        step: 0,
        
        code: (function() {
            var values = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            var r = [];
            while (r.length < 4) {
                var i = Math.random() * values.length | 0;
                r.push(values[i]);
                values.splice(i, 1);
            }   
            console.log(r);
            return r;
        })(),
        
        lastU: 0,
        
        update: function(now) {
            var dt = now - this.lastU;
            this.lastU = now;
            // if it was sleeping
            if (this.timeBeforeMovement > 0) { 
                // decrement delay 
                this.timeBeforeMovement -= dt;
                // when delay is over
                if (this.timeBeforeMovement < 0) {
                    // compute new destination
                    this.target = this.next();
                    var dist = Math.sqrt(sqDistance(this.target, this.position));
                    this.direction.x = (this.target.x - this.position.x) / dist;
                    this.direction.y = (this.target.y - this.position.y) / dist;
                    this.elem.classList.add("anim");
                }
                return;
            }
            // is moving compute movement
            if (sqDistance(this.target, this.position) < 1) {
                this.position = this.target;
                if (Math.random() < 0.25) {
                    this.elem.classList.remove("anim");
                    this.timeBeforeMovement = 2000 + Math.random() * 2000 | 0;
                    this.step++;
                    if (this.step >= this.code.length) {
                        this.step = 0;   
                    }
                    this.elem.dataset.number = this.code[this.step];
                    return;
                }
                this.target = this.next();
                var dist = Math.sqrt(sqDistance(this.target, this.position));
                this.direction.x = (this.target.x - this.position.x) / dist;
                this.direction.y = (this.target.y - this.position.y) / dist;                    
            }
            this.position.x = this.position.x + this.direction.x * this.speed;
            this.position.y = this.position.y + this.direction.y * this.speed;
            return 1;
        },
        
        next: function() {
            var n = {};
            do {
                n.x = Math.random() * 80 + 10;
                n.y = Math.random() * 80 + 10;
            }
            while (sqDistance(n, this.position) < 20);
            return n;
        },
        
        elem: element.querySelector("#bcRatBeast"),
        render: function() {
            this.elem.style.left = this.position.x + "%";
            this.elem.style.top = this.position.y + "%";
        }
        
    }
    
    var flashlight = element.querySelector("#bcRatFlashlight");
    
    function move(e) {    
        var left = 100 * e.clientX / element.clientWidth;
        var top = 100 * e.clientY / element.clientHeight;
        flashlight.style.left = left + "%";
        flashlight.style.top = top + "%";
    };
    element.addEventListener("mousemove", function(e) {
        e.preventDefault();
        move(e);
    });
    element.addEventListener("touchmove", function(e) {
        e.preventDefault();
        move(e.touches[0]);   
    });        
    
    
    this.start = function() {
        beast.lastU = Date.now();
        beast.render();
        flashlight.style.left = "50%";
        flashlight.style.top = "50%";
        element.classList.add("show");
    }
    
    this.stop = function() {
        element.classList.add("show");
    }
    
    this.update = function(now) {
        if (beast.update(now)) {    
            beast.render();
        }
    }
    
}