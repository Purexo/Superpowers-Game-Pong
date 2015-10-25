class BallBehavior extends Sup.Behavior{
  increSpeed:number = 0.005;
  startSpeed:number = 0.05;

  RELOAD : string[];
  ECHAP : string[];
  startDirection : Sup.Math.Vector2 = toCarthesian(new PolarCoordinate(this.startSpeed, Math.PI / 8));

  COLLIDE_OPTION = {
    width: 0.5,
    height: 0.5,
    movable: true,
    bounceX: 1,
    bounceY: 1
  };

  body   : Sup.ArcadePhysics2D.Body;
  bodyP1 : Sup.ArcadePhysics2D.Body; P1 : Sup.Actor;
  bodyP2 : Sup.ArcadePhysics2D.Body; P2 : Sup.Actor;
  bodyMP1: Sup.ArcadePhysics2D.Body;
  bodyMP2: Sup.ArcadePhysics2D.Body;
  scoreTmp : Sup.TextRenderer;

  isAnimate : boolean;
  dAnimate = 15;
  dtAnimate : number;
  scale : Sup.Math.Vector3;

  color : Color = new Color();
  
  awake() {
    this.body = new Sup.ArcadePhysics2D.Body(this.actor, Sup.ArcadePhysics2D.BodyType.Box, this.COLLIDE_OPTION);
  }

  start() {
    this.isAnimate = false;
    this.dtAnimate = this.dAnimate;
    
    this.body.setVelocity(this.startDirection);
    
    this.P1 = Sup.getActor("Player1");
    this.P2 = Sup.getActor("Player2");
    this.bodyP1 = this.P1.arcadeBody2D;
    this.bodyP2 = this.P2.arcadeBody2D;
    this.bodyMP1 = Sup.getActor("MurP1").arcadeBody2D;
    this.bodyMP2 = Sup.getActor("MurP2").arcadeBody2D;
    this.scoreTmp = Sup.getActor("ScoreTmp").textRenderer;
    this.color.r = 1; this.color.v = 1; this.color.b = 1;
    
    this.scale = this.actor.getLocalScale().clone();
  }

  shadow() {
    let shadow = new Sup.Actor("ShadowB");
    
    shadow.setPosition(this.actor.getPosition());
    shadow.setEulerAngles(this.actor.getEulerAngles());
    shadow.setLocalScale(this.actor.getLocalScale());
    
    let renderer = new Sup.SpriteRenderer(shadow, this.actor.spriteRenderer.getSprite());
    renderer.setColor(this.color.r, this.color.v, this.color.b);
    
    shadow.addBehavior(ShadowBehavior, {otime: 15, renderer: renderer});
  }

  rcolor() {
    let r = Sup.Math.Random.integer(0, 100) / 100;
    let v = Sup.Math.Random.integer(0, 100) / 100;
    let b = Sup.Math.Random.integer(0, 100) / 100;
    //let o = Sup.Math.Random.integer(50, 100) / 100; // 0.5 et 1
    this.actor.spriteRenderer.setColor(r, v, b);
    //this.actor.spriteRenderer.setOpacity(o);
    this.color.r = r; this.color.v = v; this.color.b = b;
  }

  animate() : boolean {
    if (!this.isAnimate) { return false; }
    
    if (this.dtAnimate <= 0) {
      this.dtAnimate = this.dAnimate;
      this.color.r = 1; this.color.v = 1; this.color.b = 1;
      this.actor.spriteRenderer.setColor(1, 1, 1);
      //this.actor.spriteRenderer.setOpacity(1);
      this.actor.setLocalScale(this.scale);
      this.actor.setEulerAngles(new Sup.Math.Vector3(0,0,0));
      return false;
    }
    
    let xy = Random.integer(1, 150) / 100;
    this.actor.setLocalScale(new Sup.Math.Vector3(xy, xy, 1));
    let randVector = new Sup.Math.Vector3(0, 0, Sup.Math.Random.integer(0, Math.PI / 2 * 100)/100);
    this.actor.setEulerAngles(randVector);
    
    this.rcolor();
    
    this.dtAnimate--;
    return true;
  }

  particule(offsetX, offsetY, dX?, dY?) {
    for (let i = 0; i < Random.integer(10, 20); i++) {
      let pos = this.actor.getPosition();
      let offpos = new Sup.Math.Vector3(offsetX,offsetY,1);
      
      let p = new Sup.Actor("particule"+i);
      p.setPosition(pos.add(offpos));
      
      if (dX != undefined && dY != undefined) {
        offpos = new Sup.Math.Vector3(dX, dY, 1);
      }      
            
      p.addBehavior(ParticuleBehavior, {direction: offpos});
    }
  }

  input() {
    for (let i = 0; i < this.RELOAD.length; i++)
      if(Sup.Input.wasKeyJustPressed(this.RELOAD[i]))
        StartMenu.reset();
    for (let i = 0; i < this.ECHAP.length; i++)
      if (Sup.Input.wasKeyJustPressed(this.ECHAP[i]))
        EndMenu.load();
  }

  update() {
    this.input();
    
    let pos = this.actor.getPosition();
    let flagSon = Sup.ArcadePhysics2D.collides(this.body, Sup.ArcadePhysics2D.getAllBodies());
    
    if (Math.abs(pos.x) >= 13 || Math.abs(pos.y) >= 8) StartMenu.play(); // si la balle sors de l'arene, on reset la balle.
    
    /* --- Collision Mur gauche et droit --- */
    let cMP1 : boolean = Sup.ArcadePhysics2D.collides(this.body, this.bodyMP1);
    let cMP2 : boolean = Sup.ArcadePhysics2D.collides(this.body, this.bodyMP2);
    if (cMP1 || cMP2) son.playBruitage("fond");
    if (cMP1) {
      scoreP2 += scoreTmp;
      trajectoireBalle = prepareNG(-3*Math.PI/4, 3*Math.PI/4);
      StartMenu.reload();
    } else if (cMP2) {
      scoreP1 += scoreTmp;
      trajectoireBalle = prepareNG(Math.PI/4, -Math.PI/4);
      StartMenu.reload();
    }
    
    /* --- Collision raquette --- */
    let cP1 : boolean = Sup.ArcadePhysics2D.collides(this.body, this.bodyP1);
    let cP2 : boolean = Sup.ArcadePhysics2D.collides(this.body, this.bodyP2);
    if (cP1 || cP2) {                                                         // Si il y a collision avec la raquette du P1 ou P2
      /* --- Gestion de l'angle de rebond --- */
      let posP = cP1 ? this.P1.getPosition() : this.P2.getPosition();
      posP.x = pos.x >= posP.x ? posP.x - 1 : posP.x + 1; // décalage du point pour le calcul de la trajectoire
      let offset = new Sup.Math.Vector2(pos.x - posP.x, pos.y - posP.y);
      let a : PolarCoordinate = toPolar( offset ); // récupération d'un vecteur trajectoire
      
      /* --- modification de l'angle et de la vitesse de la balle --- */
      let pol = toPolar(this.body.getVelocity());                      // recuperation d'un vecteur vitesse
      pol.radius += this.increSpeed;                                   // on applique la nouvelle vitesse
      pol.angle = a.angle;                                             // on applique le nouvel angle
      let velocity = toCarthesian(pol);                                // set de la velocité
      
      /* --- Set de la velocity et lancement de l'animation de rebond --- */
      this.body.setVelocity(velocity);
      this.isAnimate = true;
      scoreTmp++;
      this.scoreTmp.setText( zeropad(scoreTmp, 3) );
      
      son.playBruitage("raquette");
      let dx = pos.x > 0 ? 1 : -1;
      this.particule(-offset.x / 2, offset.y / 2, dx, 0);
      
      flagSon = false;
    }
    
    if (flagSon) {
      let offsetY = pos.y > 0 ? 0.5 : -0.5;
      this.particule(0, offsetY / 2);
      son.playBruitage("mur");
    }
    this.isAnimate = this.animate();
    this.shadow();
  }

}
Sup.registerBehavior(BallBehavior);