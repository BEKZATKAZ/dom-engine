export class GamingMath {
  public static clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(value, max));
  }

  public static lerp(a: number, b: number, t: number) {
    return a + t * (b - a);
  }
};
