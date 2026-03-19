import { layer } from "layers";

const TestLayers = {
  Player: 0,
  Wall: 1,
  Pickup: 2,
  TooSmallLayer: -1,
  TooLargeLayer: 100
} as const;

it("creates succesfully when within range", () => {
  for (let i = 0; i < 64; i++) {
    const l = layer(i);
    assert.strictEqual(l, i, "Values differ");
  }
});

it("creates from enum name", () => {
  assert.strictEqual(layer(TestLayers, "Player"), 0, "Value dismatch");
  assert.strictEqual(layer(TestLayers, "Wall"), 1, "Value dismatch");
  assert.strictEqual(layer(TestLayers, "Pickup"), 2, "Value dismatch");
});

it("throws if an enum value is out of range or invalid", () => {
  assert.throws(() => layer(TestLayers, "TooSmallLayer"), RangeError);
  assert.throws(() => layer(TestLayers, "TooLargeLayer"), RangeError);
  assert.throws(() => layer(TestLayers, "Invalid" as keyof typeof TestLayers), TypeError);
});

it("throws when out of range", () => {
  for (let i = 64; i < 1024; i++) assert.throws(() => layer(i), RangeError);
  for (let i = -1024; i < 0; i++) assert.throws(() => layer(i), RangeError);
});
