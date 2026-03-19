export type layer =
  | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7
  | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15
  | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23
  | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31
  | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39
  | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47
  | 48 | 49 | 50 | 51 | 52 | 53 | 54 | 55
  | 56 | 57 | 58 | 59 | 60 | 61 | 62 | 63;

export function layer(value: number): layer;
export function layer<T extends Record<string, number>>(layers: T, layerName: keyof T): layer;
export function layer<T extends Record<string, number>>(layers: T | number, layerName?: keyof T): layer {
  if (typeof layers === "number") {
    if (layers < 0 || layers > 63) throw new RangeError(`Layer out of range (0-63): ${layers}`);
    return layers as layer;
  }
  
  const layer = layers[layerName!];
  if (layer === undefined) throw new TypeError("Undefined layer");
  if (layer < 0 || layer > 63) throw new RangeError(`Layer out of range (0-63): ${layer}`);

  return layers[layerName!] as layer;
}
