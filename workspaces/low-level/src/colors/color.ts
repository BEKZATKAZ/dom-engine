import { GamingMath } from "math";

export type color = number & { readonly __brand: unique symbol };

const byte = (value: number) => GamingMath.clamp(Math.floor(value), 0, 255);

export function color(r?: number, g?: number, b?: number, a?: number): color {
  let result = 0 as color;
  result = Color.withR(result, r ?? 0);
  result = Color.withG(result, g ?? 0);
  result = Color.withB(result, b ?? 0);
  result = Color.withA(result, a ?? 255);
  return result;
}

export class Color {
  public static get black() { return color(0, 0, 0); }
  public static get white() { return color(255, 255, 255); }
  public static get gray() { return color(128, 128, 128); }

  public static get red() { return color(255, 0, 0); }
  public static get green() { return color(0, 255, 0); }
  public static get blue() { return color(0, 0, 255); }

  public static get yellow() { return color(255, 255, 0); }
  public static get orange() { return color(255, 128, 0); }
  public static get cyan() { return color(0, 255, 255); }

  public static get magenta() { return color(255, 0, 255); }
  public static get pink() { return color(255, 128, 255); }
  public static get purple() { return color(128, 0, 255); }

  public static r(color: color): number {
    return byte(color & 255);
  }

  public static g(color: color): number {
    return byte((color >>> 8) & 255);
  }

  public static b(color: color): number {
    return byte((color >>> 16) & 255);
  }

  public static a(color: color): number {
    return byte((color >>> 24) & 255);
  }

  public static withR(color: color, value: number): color {
    return color = ((color & ~255) | byte(value)) as color;
  }

  public static withG(color: color, value: number): color {
    return color = ((color & ~(255 << 8)) | (byte(value) << 8)) as color;
  }

  public static withB(color: color, value: number): color {
    return color = ((color & ~(255 << 16)) | (byte(value) << 16)) as color;
  }

  public static withA(color: color, value: number): color {
    return color = ((color & ~(255 << 24)) | (byte(value) << 24)) as color;
  }

  public static lerp(first: color, second: color, t: number): color {
    const r = GamingMath.lerp(this.r(first), this.r(second), t);
    const g = GamingMath.lerp(this.g(first), this.g(second), t);
    const b = GamingMath.lerp(this.b(first), this.b(second), t);
    const a = GamingMath.lerp(this.a(first), this.a(second), t);
    return color(r, g, b, a);
  }
}
