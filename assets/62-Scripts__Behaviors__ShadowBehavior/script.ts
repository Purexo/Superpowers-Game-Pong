class ShadowBehavior extends Sup.Behavior {
  otime : number;
  time  : number;
  renderer : Sup.SpriteRenderer;
  omodifier : number = 1;
  
  awake() {
    this.time = this.otime;
  }

  update() {
    if (this.time <= 0) this.actor.destroy();
    this.renderer.setOpacity((this.time / this.otime) / this.omodifier);
    this.time--;
  }
}
Sup.registerBehavior(ShadowBehavior);
