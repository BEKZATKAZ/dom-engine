import { Camera } from "@engine/core";
import { Color, Float2, float2, hex } from "low-level";
import { Screen } from "screen";

let camera: Camera;
const defaultSize = float2(Screen.width, Screen.height);
const defaultHalfSize = Float2.mul(defaultSize, float2(0.5));

beforeEach(() => {
  camera = new Camera({
    backgroundColor: hex(Color.white),
    size: 10
  });
});

describe("Conversions", () => {
  test("toWorldCoords()", () => {
    const worldPosition = Screen.toWorldCoords(defaultHalfSize, camera);
    const expected = Float2.zero;

    assert.isTrue(Float2.equals(worldPosition, Float2.zero),
      `Expected: ${Float2.toString(expected)}, ` +
      `But was: ${Float2.toString(worldPosition)}`);
  });

  test("toScreenCoords()", () => {
    const screenPosition = Screen.toScreenCoords(float2(0), camera);

    assert.isTrue(Float2.equals(screenPosition, defaultHalfSize),
      `Expected: ${Float2.toString(defaultHalfSize)}, ` +
      `But was: ${Float2.toString(screenPosition)}`);
  });
});
