let Random = Sup.Math.Random;

let scoreP1  : number = 0;
let scoreP2  : number = 0;
let scoreTmp : number = 0;

let MAXSCORE : number = 500;

let trajectoireBalle : Sup.Math.Vector2;

let gravite : Sup.Math.Vector2;

let CONTROLE_P1 : {[key:string] : any} = {
  UP       : ["W", "Z"],
  DOWN     : ["S"],
  LEFT     : ["A", "Q"],
  RIGHT    : ["D"]
};

let CONTROLE_P2 : {[key:string] : any} = {
  UP       : ["UP"],
  DOWN     : ["DOWN"],
  LEFT     : ["LEFT"],
  RIGHT    : ["RIGHT"]
};

let CONTROLE_BALL : {[key:string] : any} = {
  RELOAD   : ["X", "R"],
  ECHAP    : ["ESCAPE"]
}