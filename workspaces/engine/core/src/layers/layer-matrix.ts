import { layer } from "./layer";
import { LayerMask, type layermask } from "./layer-mask";

const matrix = {} as Record<layer, layermask>;

export class LayerMatrix {
  public static includeAll() {
    for (let i = 0; i < 64; i++) matrix[layer(i)] = LayerMask.all;
  }
  
  public static excludeAll() {
    for (let i = 0; i < 64; i++) matrix[layer(i)] = LayerMask.empty;
  }

  public static isContactAllowed(a: layer, b: layer): boolean {
    return ((matrix[a] ?? LayerMask.empty) & (1 << b)) !== 0;
  }

  public static allowContactBetween(a: layer, b: layer) {
    matrix[a] = LayerMask.include(matrix[a], b);
    matrix[b] = LayerMask.include(matrix[b], a);
  }

  public static forbideContactBetween(a: layer, b: layer) {
    matrix[a] = LayerMask.exclude(matrix[a], b);
    matrix[b] = LayerMask.exclude(matrix[b], a);
  }
}
