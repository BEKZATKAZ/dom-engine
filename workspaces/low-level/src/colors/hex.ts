import { Color, color } from "./color";

const lookUpTable: Record<number, string> = {};
const lookUpTableSingle: Record<number, string> = {};

for (let i = 0; i < 256; i++) {
  const result = i.toString(16);
  lookUpTableSingle[i] = result[0]!;
  lookUpTable[i] = result.padStart(2, "0");
}

export type HexColor = `#${string}` & { readonly __brand: unique symbol };

export function hex(color: color): HexColor;

export function hex(input: string): HexColor;

export function hex(v: color | string): HexColor {
  if (typeof v === "string") {
    if (!/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6,8})$/.test(v)) throw new Error(`Invalid hex: ${v}`);
    return v as HexColor;
  }

  const r = Color.r(v);
  const g = Color.g(v);
  const b = Color.b(v);
  const a = Color.a(v);

  if (
    isDoubleHex(Color.r(v)) &&
    isDoubleHex(Color.g(v)) &&
    isDoubleHex(Color.b(v)) &&
    isDoubleHex(Color.a(v))
  ) {
    const rh = lookUpTableSingle[r];
    const gh = lookUpTableSingle[g];
    const bh = lookUpTableSingle[b];
    const ah = a === 255 ? "" : lookUpTableSingle[a];

    return `#${rh}${gh}${bh}${ah}` as HexColor;
  }

  const rh = lookUpTable[r]!;
  const gh = lookUpTable[g]!;
  const bh = lookUpTable[b]!;
  const ah = a === 255 ? "" : lookUpTable[a]!;

  return `#${rh}${gh}${bh}${ah}` as HexColor;
}

function isDoubleHex(byte: number) {
  return (byte >> 4) === (byte & 0xF);
}
