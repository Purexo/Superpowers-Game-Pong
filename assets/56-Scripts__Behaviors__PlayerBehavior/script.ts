class PlayerBehavior extends Sup.Behavior{
  
  UP : string[];
  DOWN : string[];
  LEFT : string[];
  RIGHT : string[];
  
  speed : number = 0.25;

  move() : boolean {
    /* --- Gestion de la vitesse et de la direction de la raquette --- */
    let velocity = new Sup.Math.Vector2(0,0);
    let pos = this.actor.getPosition();
    let flagv = false;
    let flagh = false;
    // haut
    for (let i=0; i < this.UP.length; i++) {
      if (Sup.Input.isKeyDown(this.UP[i])) {
        velocity.y = this.speed;
        flagv = true;
      }
    }
    // bas
    for (let i=0; i < this.DOWN.length; i++) {
      if (Sup.Input.isKeyDown(this.DOWN[i])) {
        velocity.y = -this.speed;
        flagv = true
      }
    }
    //gauche
    for (let i=0; i < this.LEFT.length; i++) {
      if (Sup.Input.isKeyDown(this.LEFT[i])) {
        velocity.x = (Math.abs(pos.x) <= 5) ? (pos.x > 0) ? this.speed  : -this.speed : -this.speed;
        flagh = true
      }
    }
    //droite
    for (let i=0; i < this.RIGHT.length; i++) {
      if (Sup.Input.isKeyDown(this.RIGHT[i])) {
        velocity.x = (Math.abs(pos.x) <= 5) ? (pos.x < 0) ? -this.speed :  this.speed :  this.speed;
        flagh = true
      }
    }
    
    velocity.y = flagv ? velocity.y : 0;            // Si pas de touche pressé alors on ne bouge pas la raquette
    velocity.x = flagh ? velocity.x : 0;            // Si pas de touche pressé alors on ne bouge pas la raquette
    this.actor.arcadeBody2D.setVelocity(velocity);
    
    return (flagv || flagh); // vrai si il y a eu mouvement
  }

  update(){
    this.move();
  }
  
} Sup.registerBehavior(PlayerBehavior);