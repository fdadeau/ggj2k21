
function Character(element) {
 
    // coordonnées d'origine du personnage dans le monde 
    this.setPosition = function(perX, perY) {
        this.position.x = perX;
        this.position.y = perY;
    }
    
    this.position = {x: 70, y: 50 }; 
        
    this.zonesOK = [];
    this.setZonesOK = function(zok) {
        this.zonesOK = zok;
    }
    
    this.setPOI = function(po) {
        this.poi = po;   
    }
    
    // taille du personnage (en vw)
    this.size = { w: 10, h: 20 };
    
    this.vec = {x: 0, y: 0 };
    
    this.speed = 20;
    
    
    this.isOnPOI = function() {
        for (var i in this.poi) {
            var p = this.poi[i];
            if (this.position.x >= p.x && this.position.x <= p.x + p.w && this.position.y >= p.y && this.position.y <= p.y + p.h) {
                return i;
            }
        }
        return null;
    }
    
    
    var lastU = Date.now();
    this.update = function(now) {
        var dt = now - lastU;
        lastU = now;
        if (!this.vec.x && !this.vec.y) {
             return;  
        }
        var newX = this.position.x + this.vec.x * this.speed * dt / 1000;
        var newY = this.position.y + this.vec.y * this.speed * dt / 1000;
        
        if (this.zonesOK.some(z => newX >= z.x && newX <= z.x + z.w && newY >= z.y && newY <= z.y + z.h)) {
            this.position.x = newX;   
            this.position.y = newY;   
            return true;
        }
        
        if (this.zonesOK.some(z => newX >= z.x && newX <= z.x + z.w && this.position.y >= z.y && this.position.y <= z.y + z.h)) {
            this.position.x = newX;   
            return true;
        }
        
        if (this.zonesOK.some(z => this.position.x >= z.x && this.position.x <= z.x + z.w && newY >= z.y && newY <= z.y + z.h)) {
            this.position.y = newY;   
            return true;
        }
        
        return false;
    }
}
    