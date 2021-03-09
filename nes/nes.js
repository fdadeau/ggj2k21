"use strict";

function NesGame(element) {
    
    const N = 200;
    
    var cvs = document.getElementById("bcNesCvs");
    cvs.width = window.innerWidth;
    cvs.height = window.innerHeight;
    var ctx = document.getElementById("bcNesCvs").getContext("2d");
    ctx.fillStyle="white";
    // generate background
    for (var i=0; i < N; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * window.innerWidth | 0, Math.random() * window.innerHeight | 0, Math.random()*3 | 0 + 1, 0, 2*Math.PI);
        ctx.fill();
    }
    
    var img = new Image();
    img.src = "./assets/dead.png";
    img.id="bcNesPerso";
    document.getElementById("bcNes").appendChild(img);
    
    element.querySelector(".btnBack").addEventListener("click", function(e) {
        this.stop();
    }.bind(this));
        
    
    this.start = function() {
        element.classList.add("show");   
        if (this.game) {
            var time = Date.now() - this.game.startTime;
            time = time / 1000 | 0;
            document.getElementById("bcNesGO").innerHTML = "Your time: " + (time/60 | 0) + " min " + (time % 60) + " sec";
        }
    }
    
    this.stop = function() {
        element.classList.remove("show");   
        if (this.game) {
            document.location.reload();
        }
    }
    
    this.update = function(now) {
    
    }
    
}