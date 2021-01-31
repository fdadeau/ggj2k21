"use strict";


function WaterGame(element) {
    
    
    element.querySelector("#bcWaterLevels").addEventListener("click", function(e) {
        
        if (e.target.tagName != "BUTTON") {
            return;
        }
        
        var plus = e.target.classList.contains("bcWaterBtnPlus");
        
        var c = e.target.parentElement.id.substr(-1);

        color.update(plus ? 1 : -1, c);
        
    });
    
    element.querySelector(".btnBack").addEventListener("click", function(e) {
        this.stop();
    }.bind(this));
    
        
    var color = {
        generate: function(lvl) {
            var ret = {};
            ["R", "G", "B", "A"].forEach(e => {
                var rand = Math.random() * lvl.length | 0;
                ret[e] = lvl[rand];
                lvl.splice(rand, 1);
            });            
            return ret;
        },
        init: function() {
            this.current = this.generate([0, 1, 2, 3, 4]);
            this.target = this.generate([1, 2, 3, 4]);
            element.querySelector("#bcWaterDebug").style.backgroundColor = this.getRGBA(this.target);
        },
        update: function(delta, which) {
            var newC = this.current[which] + delta;
            if (newC < 0) {
                newC = 0;   
            }
            else if (newC > 4) {
                newC = 4;   
            }
            this.current[which] = newC;
            this.render();
        },
        render: function() {
            element.querySelector("#bcWaterLevelR").dataset.level = this.current.R;
            element.querySelector("#bcWaterLevelG").dataset.level = this.current.G;
            element.querySelector("#bcWaterLevelB").dataset.level = this.current.B;
            element.querySelector("#bcWaterLevelA").dataset.level = this.current.A;
            element.querySelector("#bcWaterPipe").style.backgroundColor = this.getRGBA(this.current); 
        },
        getRGBA: function(data) {
            var lvl = [0, 63, 127, 191, 255];
            return "rgba(" + lvl[data.R] + ","+ lvl[data.G] + ","+ lvl[data.B] + "," + (data.A * 0.25) + ")"
        }
    }
    
    color.init();
    color.render();
    
    this.isSolved = function() {
        return color.getRGBA(color.target) == color.getRGBA(color.current);   
    }
    
    this.start = function() {
        element.classList.add("show");   
    }
    
    this.stop = function() {
        element.classList.remove("show");   
    }
    
    this.update = function(now) {
        // not used here   
    }
    
}