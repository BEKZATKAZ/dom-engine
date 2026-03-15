import { color, Color } from "colors";
import { GamingMath } from "math";

it("creates (0,0,0,255) with empty parameters", () => {
  assert.strictEqual(color(), Color.black);
});

describe("Constants", () => {
  test("standard colors", () => {
    assert.strictEqual(Color.black, color(), "This is not black");
    assert.strictEqual(Color.white, color(255, 255, 255), "This is not white");
    assert.strictEqual(Color.gray, color(128, 128, 128), "This is not gray");

    assert.strictEqual(Color.red, color(255, 0), "This is not red");
    assert.strictEqual(Color.green, color(0, 255), "This is not green");
    assert.strictEqual(Color.blue, color(0, 0, 255), "This is not blue");
  });

  test("standard colors 2", () => {
    assert.strictEqual(Color.yellow, color(255, 255, 0));
    assert.strictEqual(Color.orange, color(255, 128, 0));
    assert.strictEqual(Color.cyan, color(0, 255, 255));

    assert.strictEqual(Color.magenta, color(255, 0, 255));
    assert.strictEqual(Color.pink, color(255, 128, 255));
    assert.strictEqual(Color.purple, color(128, 0, 255));
  });
});

describe("Getters", () => {
  it.each([
    [511, 1000, -1000, -100],
    [-1, -129, 234, 1000000],
    [255, 255, 128, -64],
    [0, 0, 0, 0]
  ])("does not go beyond range (0-255)", (r: number, g: number, b: number, a: number) => {
    const c = color(r, g, b, a);
    assert.strictEqual(Color.r(c), GamingMath.clamp(r, 0, 255));
    assert.strictEqual(Color.g(c), GamingMath.clamp(g, 0, 255));
    assert.strictEqual(Color.b(c), GamingMath.clamp(b, 0, 255));
    assert.strictEqual(Color.a(c), GamingMath.clamp(a, 0, 255));
  });

  it.each([
    [0, 0, 0, 0],
    [128, 64, 32, 16],
    [255, 255, 255, 255]
  ])("correctly reads bits", (r: number, g: number, b: number, a: number) => {
    const c = color(r, g, b, a);
    assert.strictEqual(Color.r(c), r);
    assert.strictEqual(Color.g(c), g);
    assert.strictEqual(Color.b(c), b);
    assert.strictEqual(Color.a(c), a);
  });
});

describe("Setters", () => {
  it.each([
    [511, 1000, 10000, -100],
    [0, 0, 0, 0]
  ])("correctly writes bits", (r: number, g: number, b: number, a: number) => {
    let c = color(r, g, b, a);
    c = Color.withR(c, 100);
    c = Color.withG(c, 120);
    c = Color.withB(c, 140);
    c = Color.withA(c, 160);

    assert.strictEqual(Color.r(c), 100);
    assert.strictEqual(Color.g(c), 120);
    assert.strictEqual(Color.b(c), 140);
    assert.strictEqual(Color.a(c), 160);
  });
});

describe("Functions", () => {
  test("lerp", () => {
    const a = Color.blue;
    const b = Color.red;
    assert.strictEqual(Color.lerp(a, b, 0.5), color(127, 0, 127));
  });
});
