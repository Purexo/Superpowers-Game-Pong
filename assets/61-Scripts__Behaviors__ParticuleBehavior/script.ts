class ParticuleBehavior extends Sup.Behavior {
  p : Particule;
  renderer : Sup.SpriteRenderer;
  direction : Sup.Math.Vector2;                // you must precise this parameter when you set behavior on actor

  run () {
    if (this.p.time <= 0) this.actor.destroy();
    
    this.renderer.setOpacity(this.p.opacity);
    this.renderer.setColor(this.p.color.r, this.p.color.v, this.p.color.b);
    
    let ls = new Sup.Math.Vector3(this.p.scale, this.p.scale, 1);
    this.actor.setLocalScale(ls);
    this.actor.move(this.p.direction);
    this.actor.setEulerAngles(this.p.rotation);
    
    this.p.run();
  }

  awake() {
    this.p = new Particule(this.direction);
    this.renderer = new Sup.SpriteRenderer(this.actor, this.p.sprite);
    this.run();
  }

  update() {
    this.run();
  }
}
Sup.registerBehavior(ParticuleBehavior);
