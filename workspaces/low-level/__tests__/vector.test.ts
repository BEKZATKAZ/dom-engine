import { float2, Float2 } from "vectors";

function vectorEquals(a: float2, b: float2, delta = 0.01, message?: string) {
  assert.approximately(Float2.x(a), Float2.x(b), delta, message);
  assert.approximately(Float2.y(a), Float2.y(b), delta, message);
  assert.isTrue(Float2.equals(a, b, delta), "Broken equals()");
}

it.each([
  [0, 10],
  [10, 0],
  [-10000, 128],
  [65536, -65536]
])("packs two values into one on the stack", (x: number, y: number) => {
  const vector = float2(x, y);
  assert.approximately(Float2.x(vector), x, 0.01);
  assert.approximately(Float2.y(vector), y, 0.01);
  vectorEquals(vector, float2(x, y));
});

test.each([
  [float2(0, 0), Float2.zero],
  [float2(1, 1), Float2.one],
  [float2(-10000, -10000.01), float2(-10000.01, -10000)]
])("equals() returns whether both vectors are equal or close", (a: float2, b: float2) => {
  assert.isTrue(Float2.equals(a, b));
  assert.isTrue(Float2.equals(b, a), "Worked (a == b) but not (b == a)?");
});

test("toString() returns a human readable string", () => {
  const input = float2(128, 96);
  assert.strictEqual(Float2.toString(input), "{ x: 128, y: 96 }");
});

test("constants must be valid", () => {
  vectorEquals(Float2.zero, float2());
  vectorEquals(Float2.one, float2(1));

  vectorEquals(Float2.left, float2(-1, 0));
  vectorEquals(Float2.right, float2(1, 0));

  vectorEquals(Float2.up, float2(0, 1));
  vectorEquals(Float2.down, float2(0, -1));
});

describe("Mathematics", () => {
  function testOperation(func: (a: float2, b: float2) => float2, a: float2, b: float2, expected: float2) {
    const c = func(a, b);
    vectorEquals(c, expected);
  }

  test("addition", () => {
    testOperation(Float2.add, float2(5, 2), float2(3, 1), float2(8, 3));
  });

  test("substraction", () => {
    testOperation(Float2.sub, float2(5, 2), float2(3, 1), float2(2, 1));
  });

  test("multiplication", () => {
    testOperation(Float2.mul, float2(5, 2), float2(3, 1), float2(15, 2));
  });

  test("division", () => {
    testOperation(Float2.divide, float2(5, 2), float2(2.5, 1), float2(2, 2));
  });
});

describe("Functions", () => {
  test("basic functions", () => {
    vectorEquals(
      Float2.abs(float2(-128, -1)),
      float2(128, 1), 0.01, "Broken abs()");

    vectorEquals(
      Float2.negate(float2(128, -50)),
      float2(-128, 50), 0.01, "Broken negate()");
  });

  test("geometry", () => {
    const a = float2(10, 5);
    const b = float2(20, 6);

    assert.strictEqual(Float2.dot(a, b), 230, "Broken dot()");
    assert.strictEqual(Float2.lengthsq(a), Float2.dot(a, a), "Broken lengthsq()");
    assert.strictEqual(Float2.length(a), Math.sqrt(Float2.dot(a, a)), "Broken length()");

    vectorEquals(
      Float2.lerp(a, b, 0.5),
      float2(15, 5.5), 0.01, "Broken lerp()");
  });

  test("clamping", () => {
    const a = float2(10, 6);
    const b = float2(20, 5);

    assert.strictEqual(Float2.cmax(a), 10, "Broken cmax()");
    assert.strictEqual(Float2.cmin(b), 5, "Broken cmin()");

    assert.strictEqual(Float2.max(a, b), float2(20, 6), "Broken max()");
    assert.strictEqual(Float2.min(a, b), float2(10, 5), "Broken min()");

    vectorEquals(
      Float2.clamp(a, Float2.zero, Float2.one),
      float2(1, 1), 0.01, "Broken clamp()");
  });
});
