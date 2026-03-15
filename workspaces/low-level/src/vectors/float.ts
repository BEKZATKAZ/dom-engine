import { GamingMath } from "math";

const buffer = new ArrayBuffer(8);
const f32 = new Float32Array(buffer);
const f64 = new Float64Array(buffer);

export type float2 = number & { readonly __brand: unique symbol };

export function float2(x?: number, y?: number): float2 {
  f32[0] = x ?? 0;
  f32[1] = y ?? x ?? 0;
  return f64[0]! as float2;
}

export class Float2 {
  public static get one() { return float2(1, 1); }
  public static get zero() { return float2(0, 0); }

  public static get left() { return float2(-1, 0); }
  public static get right() { return float2(1, 0); }
  
  public static get up() { return float2(0, 1); }
  public static get down() { return float2(0, -1); }

  public static toString(v: float2): string {
    return `{ x: ${Float2.x(v)}, y: ${Float2.y(v)} }`;
  }

  public static equals(a: float2, b: float2, delta = 0.01): boolean {
    const ax = Float2.x(a);
    const ay = Float2.y(a);

    const bx = Float2.x(b);
    const by = Float2.y(b);

    return Math.abs(ax - bx) <= delta && Math.abs(ay - by) <= delta;
  }

  public static x(x: float2): number {
    f64[0] = x;
    return f32[0]!;
  }

  public static y(x: float2): number {
    f64[0] = x;
    return f32[1]!;
  }

  public static add(a: float2, b: float2): float2 {
    return float2(
      Float2.x(a) + Float2.x(b),
      Float2.y(a) + Float2.y(b)
    );
  }

  public static sub(a: float2, b: float2): float2 {
    return float2(
      Float2.x(a) - Float2.x(b),
      Float2.y(a) - Float2.y(b)
    );
  }

  public static mul(a: float2, b: float2): float2 {
    return float2(
      Float2.x(a) * Float2.x(b),
      Float2.y(a) * Float2.y(b)
    );
  }

  public static divide(a: float2, b: float2): float2 {
    return float2(
      Float2.x(a) / Float2.x(b),
      Float2.y(a) / Float2.y(b)
    );
  }

  public static negate(x: float2): float2 {
    return float2(-Float2.x(x), -Float2.y(x));
  }

  public static abs(x: float2): float2 {
    return float2(
      Math.abs(Float2.x(x)),
      Math.abs(Float2.y(x))
    );
  }

  public static dot(a: float2, b: float2): number {
    return Float2.x(a) * Float2.x(b) + Float2.y(a) * Float2.y(b);
  }

  public static lengthsq(x: float2): number {
    return Float2.dot(x, x);
  }

  public static length(x: float2): number {
    return Math.sqrt(Float2.dot(x, x));
  }

  public static cmax(x: float2): number {
    return Math.max(Float2.x(x), Float2.y(x));
  }

  public static cmin(x: float2): number {
    return Math.min(Float2.x(x), Float2.y(x));
  }

  public static max(a: float2, b: float2): float2 {
    return float2(Math.max(Float2.x(a), Float2.x(b)), Math.max(Float2.y(a), Float2.y(b)));
  }

  public static min(a: float2, b: float2): float2 {
    return float2(Math.min(Float2.x(a), Float2.x(b)), Math.min(Float2.y(a), Float2.y(b)));
  }

  public static clamp(value: float2, min: float2, max: float2): float2 {
    return Float2.min(Float2.max(value, min), max);
  }

  public static lerp(a: float2, b: float2, t: number): float2 {
    return float2(
      GamingMath.lerp(Float2.x(a), Float2.x(b), t),
      GamingMath.lerp(Float2.y(a), Float2.y(b), t)
    );
  }
};
