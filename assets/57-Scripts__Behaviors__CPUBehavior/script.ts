/* --- Note sur le comportement à coder --- 
 [*] A chaque rebonds
   [*] la raquette determinera une position en x "aleatoire" a atteindre lors du prochain rebonds
   [*] choisira un deltaY pour influer sur l'angle de la balle au rebonds
   
 [*] A chaque tic,
   [*] calcule la position de la balle au prochain tic
   [*] calcule le vecteur de velocite a adopter sachant l'emplacement x à atteindre, et le y extrapolé a partir du calcul precedent
     [*] en gros : on fait un vecteur grossier avec le x a atteindre, le y de la prediction de la position de la balle
     [*] => coordonnées polaire, on ajuste la distance
     [*] => et on retransforme en coordonnees carthesienne.
   
 [*] Comportement de feinte
   [*] au derniers moment la raquette va monter un peu plus ou un peu moins pour modifier le rebond de la balle (en mode suprise MOTHAFUCKER)
   
 le fait que le mouvement du CPU est basé non pas sur la position de la balle, mais l'anticipation de la position de la balle, Le CPU est très complexe à battre (haute vitesse + chance)
 le comportement de feinte et le deltaY enrichisse l'interaction avec le CPU, et lui fourni un comportement "a risque" : il est certe plus compliqué a prevoir, peut surprendre
   mais il pourra mal ce placer à cause d'une feinte (en plus de son deltaY)
   Je previens, les feintes sont perturbantes xD.
   
 [ ] Pour finir, l'ideal serait d'avoir une interpolation fluide fonction de l'éloignement de la balle corellé à la distance cad
   la balle rebondi sur la raquette = deplacement tres lent vers sa destination (eloignement positif, distance faible)
   la balle rebondi sur la raquette adversse = deplacement vitesse "normal" (eloignement nul, distance maximal)
   la balle ce rapproche de plus en plus de la raquette = deplacement accelere de plus en plus (vitesse max : this.speed) (eloignement negatif, distance faible)
     
   en fait il y a 3 truc
     l'eloignement (raquette-balle)    -[22 -> 0] => [speed/2 -> speed]
     la distance raquette-balle         [0 -> 22] => [0 -> speed/2]
     "derniere emplacement de la raquette au dernier rebond"-"position raquette futur" [-11 -> -5 | 5 -> 11] => [-1 -> 1]
   
 [*] Et prise de risque en fonction du nombre de rebonds (pour compenser le temps de reaction humain)
*/

class CPUBehavior extends Sup.Behavior {
  speed : number = 0.25;
  maxSpeed : number = 0.25;

  ball : Sup.Actor;
  bodyBall : Sup.ArcadePhysics2D.Body;
  body : Sup.ArcadePhysics2D.Body;

  lastBallPosition : Sup.Math.Vector3;
  lastPosition : Sup.Math.Vector3; // (rebonds)

  lastDistance : number; // raquette-balle

  nextX : number;
  deltaNextY : number;
  feinteY : number = 0; feinteMode : boolean = false;
  rng : RNG;

  risque() : number {
    // on condidere que le score temp est entre 1 et 100 (peu de chance de garger la balle "en vie" plus longtemps que ça) : clamp
    // la valeur de retours doit etre entre -1 et 1
    return this.rng.uniform() > 0.5 ? scoreTmp / 100 : -scoreTmp / 100;
  }

  randomXY() { // met à jours nextX, la position en X vers la quelle la raquette va chercher à ce deplacer. ainsi que le deltaY
    this.nextX = this.actor.getPosition().x < 0 ? - this.rng.random(50, 110) / 10 : this.nextX = this.rng.random(50, 110) / 10;
    this.deltaNextY = this.rng.random(-100, 100) / 100 + this.risque();
    this.lastPosition = this.actor.getPosition();
  }

  /**
  * @return vitesse (arbitraire) de X en prenant en correlant
  *   l'eloignement et la distance balle-raquette
  *   la position actuelle de la raquette, et la position future souhaité
  */
  interpolation() : number {
    let pos = this.actor.getPosition();
    let ballPos = this.ball.getPosition();
    let distance = pos.distanceTo(ballPos);
    
    let speed : number; //x
    
    if (distance > this.lastDistance) { // la balle s'eloigne
      speed = distance/22 * this.maxSpeed/2 + this.maxSpeed/2;
    } else { // la balle ce rapproche
      speed = distance/22 * this.maxSpeed/2;
    }
    
    //speed *= (this.nextX - pos.x - this.lastPosition.x) / 6 // (6 = 11 - 5 : les bornes entre lesquels ce trouvent les raquettes)
    speed *= 1 - Sup.Math.lerp(Math.abs(this.lastPosition.x)/11, Math.abs(this.nextX)/11, Math.abs(pos.x)/11);
    if (this.nextX - this.lastPosition.x < 0) speed = -speed;
    return speed;
  }

  predictBall() : Sup.Math.Vector3 { // retourne l'estimation de la balle à la prochaine Frame.
    let ballPos = this.ball.getPosition();
    
    let vPrediction = new Sup.Math.Vector3(ballPos.x - this.lastBallPosition.x, ballPos.y - this.lastBallPosition.y, 0);
    return ballPos.clone().add(vPrediction);
  }

  predictMove(predictBall : Sup.Math.Vector3) : Sup.Math.Vector2 { // retourne le vecteur de velocite à avoir
    let ballPos = predictBall;
    let pos = this.actor.getPosition();
    
    //let vPrediction = new Sup.Math.Vector3(this.interpolation(), ballPos.y - pos.y + this.feinteY + this.deltaNextY, 0); // vecteur de velocite "grossier"
    let vPrediction = new Sup.Math.Vector2(this.nextX - pos.x, ballPos.y - pos.y + this.feinteY + this.deltaNextY); // vecteur de velocite "grossier"
    // if (Math.abs(pos.x) <= 5) vPrediction.x = -vPrediction.x; // correction du placement
    // plus de probleme d'effet de bords en X, la raquette souhaitera ce deplacer entre deux bornes qui ne posent pas de soucis en x
    
    let polarVelocity = toPolar(vPrediction);
    polarVelocity.radius = this.speed;
    let velocity = toCarthesian(polarVelocity);
    
    //velocity.x = this.interpolation();
    
    return velocity; // vecteur de velocité ajusté a la bonne vitesse
  }

  feinte() {
    let pos = this.actor.getPosition();
    let ballPos = this.ball.getPosition();
    if (!this.feinteMode) { // si on est pas en mode feinte
      if (pos.distanceTo(ballPos) <= 1 && pos.distanceTo(this.lastBallPosition) > 1) { // on enclenche le mode feinte aux conditions enoncé
        this.feinteMode = true;
        this.feinteY = this.rng.random(-75, 75) / 100;
      }
    } else { // si on est en mode feinte
      if (pos.distanceTo(ballPos) > 1 && pos.distanceTo(this.lastBallPosition) <= 1) { // on enleve le mode feinte aux conditions enoncé
        this.feinteMode = false;
        this.feinteY = 0;
      }
    }
  }

  awake() {
    this.rng = new RNG('1337');
  }

  start() {
    this.body = this.actor.arcadeBody2D;
    this.ball = Sup.getActor("Ball");
    this.bodyBall = this.ball.arcadeBody2D;
    this.lastBallPosition = this.ball.getPosition();
    this.lastDistance = this.lastBallPosition.distanceTo(this.actor.getPosition());
    
    this.randomXY();
  }

  update() {
    this.feinte();
    
    let velocity = this.predictMove(this.predictBall());
    this.actor.arcadeBody2D.setVelocity(velocity);
    
    this.lastBallPosition = this.ball.getPosition();
    this.lastDistance = this.lastBallPosition.distanceTo(this.actor.getPosition());
    if (Sup.ArcadePhysics2D.collides(this.body, this.bodyBall)) this.randomXY();
  }
}
Sup.registerBehavior(CPUBehavior);