/* --- Conversion de coordonnés--- */
function toPolar (cord : Sup.Math.Vector2) : PolarCoordinate {
  let pol = new PolarCoordinate(cord.length(), 0);
  pol.angle = Math.acos(cord.x / pol.radius);
  pol.angle = (cord.y < 0) ? - pol.angle : pol.angle;
  
  return pol;
}
function toCarthesian (pol : PolarCoordinate) : Sup.Math.Vector2 {
  let x = pol.radius * Math.cos(pol.angle);
  let y = pol.radius * Math.sin(pol.angle);
  
  return new Sup.Math.Vector2(x,y);
}

/* --- Conversion de nombre pour le score --- */
function zeropad(n:number, digits:number) : string {
  let str = '' + n;
  while (str.length < digits) str = '0' + str;   
  return str;
}