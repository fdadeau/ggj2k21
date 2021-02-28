"use strict";

function RadioGame(element) {

    const MIN_FREQUENCY = 87.5;
    const MAX_FREQUENCY = 107.9;

    var freq = {
        // movement delta
        delta: 0,
        // update delay (ms) 
        delay: 100,
        // last update
        lastU: 0,
        // target frequency
        target: 930,
        // current frequency
        current: 900,
        // element
        element: document.getElementById("bcRadioFrequency"),
        // generate random frequency 
        generate: function() {
            return (Math.random() * (1080 - 875) + 875) | 0;
        },
        // change date
        changeDate: null,
        // change delay
        changeDelay: 3000,
        // reset 
        reset: function(f) {
            this.target = f;
            do {
                this.current = this.generate();
            }
            while (this.distance() < 50);
            this.element.dataset.frequency = (this.current/10).toFixed(1);
            document.getElementById("bcRadioDebug").innerHTML = (this.target/10).toFixed(1);
        },
        // update
        update: function(now) {
            // change of frequency
             if (!this.changeDate) {
                 if (this.distance() < 2) {
                    this.changeDate = now + (Math.random() * 3000 | 0) + 3000;
                 }
            }
            else if (now > this.changeDate) {
                do {
                    this.target = this.generate();
                }
                while (this.distance() < 50);
                this.changeDate = null;
                document.getElementById("bcRadioDebug").innerHTML = (this.target/10).toFixed(1);
            }

            // no change
            if (this.delta == 0) {
                return;
            }
            if (now > this.lastU + this.delay) {
                // update 
                this.lastU = now;
                this.current += this.delta;
                if (this.current < 875) {
                    this.current = 1079;
                }
                else if (this.current > 1079) {
                    this.current = 875;   
                }
                this.element.dataset.frequency = (this.current/10).toFixed(1);
            }

        },
        distance: function() {
            return Math.abs(this.target - this.current);
        }

    }

    document.getElementById("bcRadioBtnPlus").addEventListener("mousedown", function(e) {
        e.preventDefault();
        freq.delta = 1;
    });
    document.getElementById("bcRadioBtnPlus").addEventListener("mouseup", function(e) {
        e.preventDefault();
        freq.delta = 0;
    });
    document.getElementById("bcRadioBtnPlus").addEventListener("mouseout", function(e) {
        e.preventDefault();
        freq.delta = 0;
    });
    document.getElementById("bcRadioBtnPlus").addEventListener("touchstart", function(e) {
        //e.preventDefault();
        freq.delta = 1;
    }, { passive: true });
    document.getElementById("bcRadioBtnPlus").addEventListener("touchend", function(e) {
        e.preventDefault();
        freq.delta = 0;
    });

    document.getElementById("bcRadioBtnMinus").addEventListener("mousedown", function(e) {
        e.preventDefault();
        freq.delta = -1;        
    });
    document.getElementById("bcRadioBtnMinus").addEventListener("mouseup", function(e) {
        e.preventDefault();
        freq.delta = 0;
    });
    document.getElementById("bcRadioBtnMinus").addEventListener("mouseout", function(e) {
        e.preventDefault();
        freq.delta = 0;
    });
    document.getElementById("bcRadioBtnMinus").addEventListener("touchstart", function(e) {
        //e.preventDefault();
        freq.delta = -1;        
    }, { passive: true });
    document.getElementById("bcRadioBtnMinus").addEventListener("touchend", function(e) {
        e.preventDefault();
        freq.delta = 0;
    });
    
    var that = this;
    document.querySelector("#bcRadio .btnBack").addEventListener("click", function(e) {
        that.stop();
    });
    

    createjs.Sound.registerSound("./assets/noise.mp3", 'noise');
    ["1", "2", "3", "4", "repeating", "yellow", "green", "blue", "red"].forEach(function(s) {
        createjs.Sound.registerSound("./assets/"+s+".mp3", s);
    });


    var code = {
        noise: null,
        code: null,
        step: 0,
        generate: function() {
            this.target = {};
            var ret = ["repeating"];
            var colors = ["red", "green", "yellow", "blue"];
            while (colors.length > 0) {
                var v = Math.random() * 4 + 1 | 0;
                ret.push(v);
                var c = Math.random() * colors.length | 0;
                ret.push(colors[c]);
                this.target[colors[c]] = v;
                colors.splice(c, 1);                
            }
            this.zeCode = ret;
        },
        playSounds: function() {
            // background noise
            if (! this.noise) {
                this.noise = createjs.Sound.play("noise");   
            }
            else {
                this.noise.paused = false;
            }
            this.noise.volume = 0.6;
            this.noise.loop = -1;
            // repeating code 
            this.step = 0;
            this.code = createjs.Sound.play(this.zeCode[this.step]);
//            this.code.src = "./radio/assets/" + this.zeCode[this.step] + ".mp3";            
            this.code.volume = 0;
//            this.code.play();
        },
        stopSounds: function() {
            this.noise.paused = true;   
            this.code.stop();   
        },
        update: function(dist) {
            if (!this.code) {
                return;   
            }
            // update code playing
            //if (this.code.ended) {
            if (this.code.playState == createjs.Sound.PLAY_FINISHED) {
                this.step++;
                if (this.step >= this.zeCode.length) {
                    this.step = 0;   
                }
//                this.code.src = "./radio/assets/" + this.zeCode[this.step] + ".mp3";
//                this.code.play();
                this.code = createjs.Sound.play(this.zeCode[this.step]);
            }
            // update volume
            if (dist < 2) {
                this.code.volume = 1 - dist/2;
                this.noise.volume = dist/2 * 0.6;
                return true;
            }
            this.code.volume = 0;
            this.noise.volume = 0.6;
        }
    }

    // init game data
    freq.reset(freq.generate());
    freq.target = freq.current + 3;
    document.getElementById("bcRadioDebug").innerHTML = (freq.target/10).toFixed(1);
    code.generate();

    /** API **/
    this.start = function() {
        element.classList.add("show");
        if (DEBUG) console.log(this.getCode());
        code.playSounds();   
    }    
    this.stop = function() {
        code.stopSounds();   
        element.classList.remove("show");
        if (this.game) {
            this.game.endgame("radio");   
        }
    }
    this.update = function(now) {
        freq.update(now);
        code.update(freq.distance());
    }
    
    this.getCode = function() {
        return code.target;   
    }
}