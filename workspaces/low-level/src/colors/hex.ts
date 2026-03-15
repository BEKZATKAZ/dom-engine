import { Color, color } from "./color";

export type HexColor = `#${string}` & { readonly __brand: unique symbol };

export function hex(color: color): HexColor;

export function hex(input: string): HexColor;

export function hex(v: color | string): HexColor {
  if (typeof v === "string") {
    if (!/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6,8})$/.test(v)) throw new Error(`Invalid hex: ${v}`);
    return v as HexColor;
  }

  const r = Color.r(v).toString(16).padStart(2, "0");
  const g = Color.g(v).toString(16).padStart(2, "0");
  const b = Color.b(v).toString(16).padStart(2, "0");
  const a = Color.a(v).toString(16).padStart(2, "0");
  return hex(`#${r}${g}${b}${a}`);
}
