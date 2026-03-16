import { color, hex } from "colors";

it.each([
  [255, 255, 255, 255, "#fff"],
  [128, 4, 3, 2, "#80040302"],
  [128, 4, 3, 255, "#800403"],
  [0, 0, 0, 17, "#0001"],
  [170, 255, 204, 255, "#afc"]
])("correctly transforms Color to HEX", (r: number, g: number, b: number, a: number, code: string) => {
  assert.strictEqual(hex(color(r, g, b, a)), hex(code));
});

it.each([
  "000000",
  "#0",
  "#00",
  "##000",
  "#0000000000"
])("throws on invalid formats", (code: string) => {
  assert.throw(() => hex(code));
});
