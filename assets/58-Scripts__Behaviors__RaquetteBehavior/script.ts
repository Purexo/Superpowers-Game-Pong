/* --- Gestion de l'animation de la raquette et des colisions --- */

class RaquetteBehavior extends Sup.Behavior {

  COLLIDE_OPTION = {
    width: 0.5,
    height: 4,
    movable: true,
    bounceX: 0,
    bounceY: 0
  };

  ball : Sup.Actor;
  bodyBall : Sup.ArcadePhysics2D.Body;
  body : Sup.ArcadePhysics2D.Body;

  isAnimate : boolean;
  dtAnimate : number = 10;
  dAnimate  : number = 10;

  animate() : boolean {
    if (!this.isAnimate) return false;
    
    if (this.dtAnimate <= 0) {
      this.dtAnimate = this.dAnimate;
      this.actor.setEulerAngles(new Sup.Math.Vector3(0,0,0));
      return false;
    }
    
    let ang = Sup.Math.Random.integer(-(Math.PI / 16) * 100, (Math.PI / 16) * 100) / 100;
    this.actor.setEulerAngles(new Sup.Math.Vector3(0, 0, ang));
    
    this.dtAnimate--;
    return true;
  }

  shadow() {
    let shadow = new Sup.Actor("ShadowR");
    
    shadow.setPosition(this.actor.getPosition());
    shadow.setEulerAngles(this.actor.getEulerAngles());
    shadow.setLocalScale(this.actor.getLocalScale());
    
    let renderer = new Sup.SpriteRenderer(shadow, this.actor.spriteRenderer.getSprite());
    //renderer.setColor(this.color.r, this.color.v, this.color.b);
    
    shadow.addBehavior(ShadowBehavior, {otime: 5, renderer: renderer, omodifier : 2});
  }

  awake(){
    this.body = new Sup.ArcadePhysics2D.Body(this.actor, Sup.ArcadePhysics2D.BodyType.Box, this.COLLIDE_OPTION);
  }

  start() {
    this.isAnimate = false;
    this.dtAnimate = this.dAnimate;
    
    this.ball = Sup.getActor("Ball");
    this.bodyBall = this.ball.arcadeBody2D;
  }

  update() {
    /* --- Collision avec les murs --- */
    Sup.ArcadePhysics2D.collides(this.body, Sup.ArcadePhysics2D.getAllBodies());
    
    if (Sup.ArcadePhysics2D.collides(this.body, this.bodyBall)) this.isAnimate = true;
    
    this.shadow();
    this.isAnimate = this.animate();
  }
}
Sup.registerBehavior(RaquetteBehavior);
