class Rand {
  
  private static Seed = (Math.random() + Date.now()).toString();
  private static rng = new RNG(Rand.Seed);

  static set seed(seed) { this.rng = new RNG(seed); }
  static get seed() { return this.Seed; }

  static nextInt(min? : number, max? : number) : number {
    return this.rng.random(min, max);
  }

  static nextByte() : number {
    return this.rng.nextByte();
  }

  /**
  * retourne un nombre aleatoire (flotant) entre les bornes [min ; max[
  * suporte les répartition uniform, normal, exponential, poisson
  *  pour poisson, vous pouvez précisez le mean, sinon il sera à 1
  *  pour eviter tout probleme dans l'interpretation des argument, spécifiez-en le plus.
  *  si vous souhaitez les argument pas défaut, remplacer par null.
  *    exemple : Rand.nextFloat(null, 10, null) => Rand.nextFloat("uniform", 10, 11)
  */
  static nextFloat(type? : string, min? : number, max? : number, mean?: number) : number {
    if (type != "uniform" || type != "normal" || type != "exponential" || type != "poisson")
      type = "uniform";

    if (min == null)
      min = 0;

    if (max == null)
      max = min + 1;
    
    if (type == "poisson") {
      if (mean == null) mean = 1;
      return this.rng[type](mean) * (max - min) + min;
    }

    return this.rng[type]() * (max - min) + min;
  }
  
  static nextGamma(a : number, min? : number, max? : number) : number {
    if (min == null) {
        return this.rng.gamma(a);
    
    } else if (max == null) {
        max = min;
        min = 0;
    }
    
    return this.rng.gamma(a) * (max - min) + min;
  }

  static roller(expr : string, rng?: RNG) : number {
    return RNG.roller(expr, rng);
  }
  
}