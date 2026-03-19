import type { layer } from "./layer";

export type layermask = number & { readonly __brand: unique symbol };

export class LayerMask {
  public static get empty() { return LayerMask.create(); }
  public static get all() { return ~0 as layermask; }

  public static has(mask: layermask, layer: layer): boolean {
    return (mask & (1 << layer)) !== 0;
  }

  public static include(mask: layermask, layer: layer): layermask {
    return ((mask as number) |= 1 << layer) as layermask;
  }

  public static exclude(mask: layermask, layer: layer): layermask {
    return ((mask as number) &= ~(1 << layer)) as layermask;
  }

  public static merge(a: layermask, b: layermask): layermask {
    return (a | b) as layermask;
  }

  public static create(): layermask;
  public static create(l1: layer): layermask;
  public static create(l1: layer, l2: layer): layermask;
  public static create(l1: layer, l2: layer, l3: layer): layermask;
  public static create(l1: layer, l2: layer, l3: layer, l4: layer): layermask;
  public static create(l1: layer, l2: layer, l3: layer, l4: layer, l5: layer): layermask;
  public static create(l1?: layer, l2?: layer, l3?: layer, l4?: layer, l5?: layer): layermask {
    let mask = 0;
    if (l1 !== undefined) mask |= 1 << l1;
    if (l2 !== undefined) mask |= 1 << l2;
    if (l3 !== undefined) mask |= 1 << l3;
    if (l4 !== undefined) mask |= 1 << l4;
    if (l5 !== undefined) mask |= 1 << l5;
    return mask as layermask;
  }
}