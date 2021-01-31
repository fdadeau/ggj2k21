
function Character(element) {
 
    // coordonnées d'origine du personnage dans le monde 
    this.setPosition = function(perX, perY) {
        this.position.x = perX;
        this.position.y = perY;
    }
    
    // element representing the character
    this.element = element;
    
    // starting position 
    this.position = {x: 70, y: 50 }; 
        
    // set of zones in which the hero can go 
    this.zonesOK = [];
    this.setZonesOK = function(scenes) {
        for (var i in scenes) {
            this.zonesOK = this.zonesOK.concat(scenes[i].zonesOK);
        }
        console.log(this.zonesOK);
    }
        
    // movement vector
    this.vec = {x: 0, y: 0 };

    // changes the direction (called when the stick is used)
    this.setDirection = function(vecX, vecY) {
        // update animation
        if (vecX > 0) {
            this.element.className = "animMarcheD";
        }
        else if (vecX < 0) {
            this.element.className = "animMarcheG";
        }
        else if (vecY == 0) {
            this.element.className = "";
        }   
        // sets new direction
        this.vec.x = vecX;
        this.vec.y = vecY;
    }
    
    // speed
    this.speed = 20;
    
    // update for game loop    
    var lastU = Date.now();
    this.update = function(now) {
        var dt = now - lastU;
        lastU = now;
        
        // not moving -> nothing to do
        if (!this.vec.x && !this.vec.y) {
             return;  
        }
        
        // compute new position
        var newX = this.position.x + this.vec.x * this.speed * dt / 1000;
        var newY = this.position.y + this.vec.y * this.speed * dt / 1000;
        
        // check if new position is correct in both coordinates
        if (this.zonesOK.some(z => newX >= z.x && newX <= z.x + z.w && newY >= z.y && newY <= z.y + z.h)) {
            this.position.x = newX;   
            this.position.y = newY;   
            return true;
        }
        
        // if not, check new X coordinate with existing Y coordinate
        if (this.zonesOK.some(z => newX >= z.x && newX <= z.x + z.w && this.position.y >= z.y && this.position.y <= z.y + z.h)) {
            this.position.x = newX;   
            return true;
        }
        
        // if not, check new Y coordinate with existing X coordinate
        if (this.zonesOK.some(z => this.position.x >= z.x && this.position.x <= z.x + z.w && newY >= z.y && newY <= z.y + z.h)) {
            this.position.y = newY;   
            return true;
        }
        
        // otherwise -> impossible to move 
        return false;
    }
}
    