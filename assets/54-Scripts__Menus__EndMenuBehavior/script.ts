class EndMenuBehavior extends Sup.Behavior {
  update() {
    if (Sup.Input.isKeyDown("SPACE") || Sup.Input.isKeyDown("RETURN"))
      StartMenu.load();
    
    if (Sup.Input.wasKeyJustPressed("ESCAPE"))
      EndMenu.exit();
  }
}
Sup.registerBehavior(EndMenuBehavior);
