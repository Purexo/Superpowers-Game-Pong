class StartMenuBehavior extends Sup.Behavior {
  update() {
    if (Sup.Input.isKeyDown("NUMPAD0") || Sup.Input.isKeyDown("0"))
      StartMenu.CPUVsCPU();
    
    if (Sup.Input.isKeyDown("NUMPAD1") || Sup.Input.isKeyDown("1"))
      StartMenu.playerVsCPU();
    
    if (Sup.Input.isKeyDown("NUMPAD2") || Sup.Input.isKeyDown("2"))
      StartMenu.playerVsPlayer();
  }
}
Sup.registerBehavior(StartMenuBehavior);
