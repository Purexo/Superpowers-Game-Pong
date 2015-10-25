/* --- Game --- */
function prepareNG(aMin : number, aMax : number) : Sup.Math.Vector2 {
  let a = Random.integer(aMin * 100, aMax * 100) / 100;
  let r = Random.integer(55, 65) / 1000;
  return toCarthesian(new PolarCoordinate(r, a));
}

function verifScore() {
  if (scoreP1 < MAXSCORE && scoreP2 < MAXSCORE) return true;
  
  EndMenu.load();
  
  let winner = Sup.getActor("Winner").textRenderer;
  let P1 = Sup.getActor("ScoreP1").textRenderer;
  let P2 = Sup.getActor("ScoreP2").textRenderer;
  
  if (scoreP1 >= scoreP2) winner.setText("Player 1 : WIN");
  else winner.setText("Player 2 : WIN");
  
  P1.setText("" + scoreP1);
  P2.setText("" + scoreP2);
  
  return false;
}

let rag = Random.integer(0, 1) >= 0.5 ? Math.PI : 0;
trajectoireBalle = prepareNG( - Math.PI / 4 + rag, Math.PI / 4 + rag);

function newGravity() {
  let rng = new RNG();
  let ng = new PolarCoordinate(0,0);
  ng.radius = Random.integer(10, 20) / 100000;                       // 0.0001 <= force <= 0.0002
  ng.angle = rng.uniform() * Math.PI * 2;            // 0 <= angle <= 2*PI
  gravite = toCarthesian(ng);
  Sup.ArcadePhysics2D.setGravity( gravite );
}