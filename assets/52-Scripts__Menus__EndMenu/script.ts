class EndMenu {
  
  public static exit() {
    son.lastBruitage.stop();
    son.musique.stop();
    Sup.destroyAllActors();
    Sup.exit();
  }
  
  public static load() {
    Sup.loadScene( Sup.get( "Assets/Scenes/EndMenu", Sup.Scene ) );
  }
  
}
