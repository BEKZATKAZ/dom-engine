import { layer, LayerMatrix } from "layers";

it.each([
  [layer(1), layer(2)],
  [layer(0), layer(5)],
  [layer(32), layer(32)],
  [layer(53), layer(1)]
])("returns true when both layers are allowed to contact", (a: layer, b: layer) => {
  LayerMatrix.allowContactBetween(a, b);
  assert.isTrue(LayerMatrix.isContactAllowed(a, b));

  LayerMatrix.forbideContactBetween(a, b);
  assert.isFalse(LayerMatrix.isContactAllowed(a, b), "It is reset");
});

it("returns false if registered neither as allowed nor forbidden", () => {
  LayerMatrix.allowContactBetween(layer(10), layer(12));
  assert.isFalse(LayerMatrix.isContactAllowed(layer(10), layer(11)));
  assert.isFalse(LayerMatrix.isContactAllowed(layer(11), layer(10)));
});

it("returns true on everything after calling includeAll()", () => {
  LayerMatrix.includeAll();

  for (let i = 0; i < 63; i++) {
    for (let j = 0; j < 63; j++) {
      assert.isTrue(LayerMatrix.isContactAllowed(layer(i), layer(j)));
    }
  }
});

it("returns false on everything after calling excludeAll()", () => {
  LayerMatrix.excludeAll();

  for (let i = 0; i < 63; i++) {
    for (let j = 0; j < 63; j++) {
      assert.isFalse(LayerMatrix.isContactAllowed(layer(i), layer(j)));
    }
  }
});