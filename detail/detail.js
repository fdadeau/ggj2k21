"use strict";

function DetailGame(element) {
    
    var that = this;
    element.querySelector(".btnBack").addEventListener("click", function() {
        that.stop();
    });
    
    var tab = ["hearts", "clubs", "spades", "diams"];
    var nbAliens = [0, 1, 5, 2];
    function shuffle(tab) {
        for (var i=0; i < 20; i++) {
            var j = Math.random() * tab.length | 0;
            var k = Math.random() * tab.length | 0;
            var tmp = tab[j];
            tab[j] = tab[k];
            tab[k] = tmp;
        }
    }
    shuffle(tab);

    function changePhoto(d) {
        if (d > 0) {
            var premier = tab.splice(0, 1)[0];
            tab.push(premier);
        }
        else if (d < 0) {
            var dernier = tab.pop();
            tab.unshift(dernier);
        }
        tab.forEach(function(e, i) {
            element.querySelector(".photo[data-card='" + e + "']").style.zIndex = (4 - i);
        });
    }
    
    this.getCode = function() {
        var code = {}; 
        for (var i=0; i < tab.length; i++) {
            code[tab[i]] = nbAliens[i];
        }
        return code;
    }
    
    this.which = undefined;
    
    this.start = function(which, code) {
        var bcContent = element.querySelector("#bcDetailContent");
        bcContent.className = which;
        this.which = which;
        switch (which) {
            case 'constellations':
                var all_signs = ["aries", "cancer", "taurus", "sagittarius", "leo", "scorpio", "aquarius", "virgo", "capricorn", "pisces", "gemini", "libra"];
                bcContent.innerHTML = all_signs.map(e => "<div class='" + e + "'></div>").join("");
                break;
            case 'towel':
                bcContent.innerHTML = ('<div class="cistercianCode">' + 
                                        '<div data-number="' + code[0] + '"></div>' + 
                                        '<div data-number="' + code[1] + '"></div>' + 
                                        '<div data-number="' + code[2] + '"></div>' + 
                                        '<div data-number="' + code[3] + '"></div>' + 
                                    '</div>').repeat(5);
                break;
            case "photos":                
                bcContent.innerHTML = [1,2,3,4].map(e => "<div class='photo' data-card='" + tab[e-1] + "'><img src='../assets/photo" + e + ".png'></div>").join("") + 
                        "<button class='btnPrevious'></button><button class='btnNext'></button>";
                changePhoto(0);
                bcContent.querySelector(".btnPrevious").addEventListener("click", function() { changePhoto(-1); });
                bcContent.querySelector(".btnNext").addEventListener("click", function() { changePhoto(1); });
                if (DEBUG) console.log(this.getCode());
                break;
            default: 
                bcContent.innerHTML = "";
        }
        element.classList.add("show");   
        if (DEBUG) console.log(this.which);
    }
    
    this.stop = function() {
        element.classList.remove("show");   
        if (this.game){
            this.game.endgame(this.which);   
        }
    }
    
    this.update = function(now) {
        // not used here   
    }
    
}