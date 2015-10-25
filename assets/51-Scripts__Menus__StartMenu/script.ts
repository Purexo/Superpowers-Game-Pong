class StartMenu {
  private static players : number = 2;
  
  private static p1 : Sup.Actor;
  private static p2 : Sup.Actor;
  private static ball : Sup.Actor;
  private static fleche : Sup.Actor;

  private static scoreTMP : Sup.TextRenderer;
  private static rscoreP1 : Sup.TextRenderer;
  private static rscoreP2 : Sup.TextRenderer;

  public static play() {
    if (verifScore()) {
      newGravity();

      scoreTmp = 1;

      Sup.loadScene( Sup.get( "Assets/Scenes/Game", Sup.Scene ) );

      this.p1 = Sup.getActor("Player1");
      this.p2 = Sup.getActor("Player2");
      this.ball = Sup.getActor("Ball");
      this.fleche = Sup.getActor("fleche");

      let acsound = new Sup.Actor("Sound Controller");

      this.ball.addBehavior(BallBehavior, {startDirection: trajectoireBalle, RELOAD: CONTROLE_BALL["RELOAD"], ECHAP: CONTROLE_BALL["ECHAP"]});
      this.p1.addBehavior(RaquetteBehavior);
      this.p2.addBehavior(RaquetteBehavior);
      let angle = new Sup.Math.Vector3(0,0,0);
      angle.z = toPolar(gravite).angle;
      this.fleche.setEulerAngles(angle);

      this.scoreTMP = Sup.getActor("ScoreTmp").textRenderer;
      this.rscoreP1 = Sup.getActor("ScoreP1").textRenderer;
      this.rscoreP2 = Sup.getActor("ScoreP2").textRenderer;

      acsound.addBehavior(SoundControllerBehavior);

      this.scoreTMP.setText( zeropad(scoreTmp, 3) );
      this.rscoreP1.setText( zeropad(scoreP1, 3) );
      this.rscoreP2.setText( zeropad(scoreP2, 3) );
    }
  }

  public static playerVsPlayer() {
    this.players = 2;
    
    this.play();

    this.p1.addBehavior(PlayerBehavior, CONTROLE_P1);
    this.p2.addBehavior(PlayerBehavior, CONTROLE_P2);
  }

  public static playerVsCPU() {
    this.players = 1;
    
    this.play();
    
    this.p1.addBehavior(PlayerBehavior, CONTROLE_P1);
    this.p2.addBehavior(CPUBehavior);
  }
  
  public static CPUVsCPU() {
    this.players = 0;
    
    this.play();
    
    this.p1.addBehavior(CPUBehavior);
    this.p2.addBehavior(CPUBehavior);
  }

  public static reload() {
    switch (this.players) {
        case 0: this.CPUVsCPU(); break;
        case 1: this.playerVsCPU(); break;
        case 2: this.playerVsPlayer(); break;
    } 
  }
  
  public static reset() {
    let rag = Random.integer(0, 1) >= 0.5 ? Math.PI : 0;
    trajectoireBalle = prepareNG( - Math.PI / 4 + rag, Math.PI / 4 + rag);
    scoreP1 = 0;
    scoreP2 = 0;
    
    this.reload();
  }

  public static load() {
    // chargement de la scene de menu
    Sup.loadScene( Sup.get( "Assets/Scenes/StartMenu", Sup.Scene ) );
    SoundController.newMusique();
  }
}