class SoundController {
  public static MUSIC_PATH : string = 'Assets/Sounds/Musiques/'
  public static BRUIT_PATH : string = 'Assets/Sounds/Bruitages/'
  
  private static MusiqueVolume  : number = 100; // 0 - 100
  private static BruitageVolume : number = 100; // 0 - 100
  private static MasterVolume   : number = 100; // 0 - 100

  static get musiqueVolume() { return this.MusiqueVolume; }
  static get bruitageVolume() { return this.BruitageVolume; }
  static get masterVolume() { return this.MasterVolume; }

  public static bruitages : { [index: string]: Sup.Audio.SoundPlayer[] } = {};
  public static musique  : Sup.Audio.SoundPlayer = null;

  // private static lastMusique  : Sup.Audio.SoundInstance;
  static lastBruitage : Sup.Audio.SoundPlayer = null;

  static load() {
    Sup.Audio.setMasterVolume(this.MasterVolume / 500);
    
    this.bruitages["mur"] = [
      new Sup.Audio.SoundPlayer(Sup.get(SoundController.BRUIT_PATH + 'Mur 1', Sup.Sound)),
      new Sup.Audio.SoundPlayer(Sup.get(SoundController.BRUIT_PATH + 'Mur 2', Sup.Sound)),
      new Sup.Audio.SoundPlayer(Sup.get(SoundController.BRUIT_PATH + 'Mur 3', Sup.Sound))
    ];

    this.bruitages["raquette"] = [
      new Sup.Audio.SoundPlayer(Sup.get(SoundController.BRUIT_PATH + 'Raquette 1', Sup.Sound)),
      new Sup.Audio.SoundPlayer(Sup.get(SoundController.BRUIT_PATH + 'Raquette 2', Sup.Sound)),
      new Sup.Audio.SoundPlayer(Sup.get(SoundController.BRUIT_PATH + 'Raquette 3', Sup.Sound))
    ];
    this.bruitages["fond"] = [
      new Sup.Audio.SoundPlayer(Sup.get(SoundController.BRUIT_PATH + 'Fond 1', Sup.Sound))
    ];
  }

  static newMusique() {
    if (this.musique) this.musique.stop();
    let musiques = ["505 - Bounce", "505 - Render", "505 - Z", "Hardcore Scm - Capacitor chiptune"];
    let r = Sup.Math.Random.integer(0, musiques.length - 1);
    this.playMusique(musiques[r], true);
  }

  static playBruitage(type:string) : boolean {
    if (this.bruitages[type] == null || this.bruitages[type] == undefined) {
      Sup.log('"' + type + '"' + " introuvable");
      return false;
    }
    
    let r = Random.integer(0, this.bruitages[type].length - 1);
    this.bruitages[type][r].setVolume(this.BruitageVolume / 500);
    this.bruitages[type][r].play();
    this.lastBruitage = this.bruitages[type][r];
    return true;
  }

  static playMusique(name:string, loop:boolean) : boolean {
    this.musique = new Sup.Audio.SoundPlayer(Sup.get(SoundController.MUSIC_PATH + name, Sup.Sound));
    this.musique.setVolume(this.MusiqueVolume / 500);
    this.musique.setLoop(loop);
    this.musique.play();
    
    return false;
  }

  static set masterVolume(v : number) {
    this.MasterVolume = Sup.Math.clamp(v, 0, 100);
    Sup.Audio.setMasterVolume(this.MasterVolume / 500);
  }
  static set bruitageVolume(v : number) {
    this.BruitageVolume = Sup.Math.clamp(v, 0, 100);
    if (this.lastBruitage)
      this.lastBruitage.setVolume(this.BruitageVolume / 500);
  }
  static set musiqueVolume(v : number) {
    this.MusiqueVolume = Sup.Math.clamp(v, 0, 100);
    if (this.musique)
      this.musique.setVolume(this.MusiqueVolume / 500);
  }
}
let son = SoundController;