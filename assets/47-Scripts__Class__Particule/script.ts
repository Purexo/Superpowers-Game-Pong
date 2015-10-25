class Color {
  r:number;
  v:number;
  b:number;
  
  new () {
    this.r = Random.integer(0, 100) / 100;
    this.v = Random.integer(0, 100) / 100;
    this.b = Random.integer(0, 100) / 100;
  }
  
  constructor () {
    this.new();
  }
}

class Borne {
  min : any;
  max : any;
  
  constructor(min : any, max : any) {
    this.min = min;
    this.max = max;
  }
}

class Particule {
  private static scaleBorne : Borne = new Borne(0.125, 0.75);
  public static get bScale() {return Particule.scaleBorne;}
  scale : number;

  color : Color;
  opacity : number;

  private static spread : Borne = new Borne(-Math.PI / 6, Math.PI / 6);
  direction : Sup.Math.Vector2;
  
  private static rotateBorne : Borne = new Borne(0, Math.PI * 2);
  rotation : Sup.Math.Vector3;

  private static vitesseMax : number = 250;

  private static dt : Borne = new Borne(20, 30); // durée de la particule
  time : number; otime : number;

  sprite : Sup.Sprite;

  run() {
    let sb = Particule.scaleBorne;
    this.scale = Random.integer(sb.min * 1000, sb.max * 1000) / 1000;
    
    let rb = Particule.rotateBorne;
    let r = Random.integer(rb.min * 100, rb.max * 100) / 100;
    this.rotation = new Sup.Math.Vector3(0,0,r);
    
    this.color.new();
    this.opacity = this.time / this.otime;
    
    this.time--;
  }

  constructor (direction : Sup.Math.Vector2) {
    let dr = toPolar(direction);
    dr.angle += Random.integer(Particule.spread.min * 100, Particule.spread.max * 100) / 100;
    dr.radius = Random.integer(0, Particule.vitesseMax) / 1000;
    this.direction = toCarthesian(dr);
    
    this.time = this.otime = Random.integer(Particule.dt.min, Particule.dt.max) + 1;
    this.color = new Color();
    
    this.run();
    
    /* --- A editer quand plus de particule --- */
    let tab = ["Square", "Cercle", "Coeur", "Disque", "Etoile1", "Etoile2", "Triangle", "Gear"];
    let r = Random.integer(0, tab.length - 1);
    this.sprite = Sup.get("Assets/Sprites/Particules/" + tab[r], Sup.Sprite);
  }

}
