class SoundControllerBehavior extends Sup.Behavior {
  // _MA master
  PLUS_MA  : string = "NUMPAD9"; 
  MOINS_MA : string = "NUMPAD3";
  // _MU musique
  PLUS_MU  : string = "NUMPAD8"; 
  MOINS_MU : string = "NUMPAD2";
  // _BR bruitage
  PLUS_BR  : string = "NUMPAD7"; 
  MOINS_BR : string = "NUMPAD1";
  
  update() {
    if (Sup.Input.isKeyDown(this.PLUS_MA))
      son.masterVolume++;
    if (Sup.Input.isKeyDown(this.MOINS_MA))
      son.masterVolume--;
    
    if (Sup.Input.isKeyDown(this.PLUS_MU))
      son.musiqueVolume++;
    if (Sup.Input.isKeyDown(this.MOINS_MU))
      son.musiqueVolume--;
    
    if (Sup.Input.isKeyDown(this.PLUS_BR))
      son.bruitageVolume++;
    if (Sup.Input.isKeyDown(this.MOINS_BR))
      son.bruitageVolume--;
  }
}
Sup.registerBehavior(SoundControllerBehavior);
