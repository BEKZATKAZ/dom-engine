import { layer, LayerMask } from "layers";

it("does not mutate the original", () => {
  const mask1 = LayerMask.create(layer(5), layer(3));

  const mask2 = LayerMask.include(mask1, layer(4));
  assert.isFalse(LayerMask.has(mask1, layer(4)), "The original should not be mutated");
  assert.isTrue(LayerMask.has(mask2, layer(4)), "The instance should include the new layer");
  
  const mask3 = LayerMask.exclude(mask2, layer(5));
  assert.isTrue(LayerMask.has(mask2, layer(5)), "The original should not be mutated");
  assert.isFalse(LayerMask.has(mask3, layer(5)), "The instance should not include the new layer");
});

it("merges two masks into one", () => {
  const a = LayerMask.create(layer(5), layer(3));
  const b = LayerMask.create(layer(2), layer(1));

  const c = LayerMask.merge(a, b);
  const d = LayerMask.merge(b, a);

  assert.strictEqual(d, c, "Order should not matter");
  assert.strictEqual(c, LayerMask.create(layer(5), layer(3), layer(2), layer(1)));
});

it.each([
  [layer(0), layer(1), layer(2), layer(3), layer(4)],
  [layer(1), layer(2), layer(3), layer(4), layer(5)],
  [layer(10), layer(2), layer(1), layer(3), layer(11)],
  [layer(63), layer(32), layer(16), layer(8), layer(12)],
  [layer(32), layer(32), layer(5), layer(3), layer(0)]
])("packes layers into one number", (l1: layer, l2: layer, l3: layer, l4: layer, l5: layer) => {
  const mask = LayerMask.create(l1, l2, l3, l4, l5);

  assert.isTrue(LayerMask.has(mask, l1), "Layer 1 is packed but does not exit");
  assert.isTrue(LayerMask.has(mask, l2), "Layer 2 is packed but does not exit");
  assert.isTrue(LayerMask.has(mask, l3), "Layer 3 is packed but does not exit");
  assert.isTrue(LayerMask.has(mask, l4), "Layer 4 is packed but does not exit");
  assert.isTrue(LayerMask.has(mask, l5), "Layer 5 is packed but does not exit");
});

it("packes layers called from helper create() methods", () => {
  assert.strictEqual(
    LayerMask.create(),
    LayerMask.create(undefined!, undefined!, undefined!, undefined!, undefined!));

  assert.strictEqual(
    LayerMask.create(layer(1)),
    LayerMask.create(layer(1), undefined!, undefined!, undefined!, undefined!));

  assert.strictEqual(
    LayerMask.create(layer(1), layer(2)),
    LayerMask.create(layer(1), layer(2), undefined!, undefined!, undefined!));

  assert.strictEqual(
    LayerMask.create(layer(1), layer(2), layer(3)),
    LayerMask.create(layer(1), layer(2), layer(3), undefined!, undefined!));

  assert.strictEqual(
    LayerMask.create(layer(1), layer(2), layer(3), layer(4)),
    LayerMask.create(layer(1), layer(2), layer(3), layer(4), undefined!));
});

test("constants", () => {
  let mask = LayerMask.empty;

  assert.strictEqual(0, mask, "Empty mask is not empty");

  for (let i = 0; i < 64; i++) {
    mask = LayerMask.include(mask, layer(i));
  }

  assert.strictEqual(mask, LayerMask.all);
});
