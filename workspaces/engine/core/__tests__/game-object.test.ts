import { Camera } from "camera";
import { GameObject } from "game-object";
import { hex } from "low-level";
import type { Mock } from "vitest";

let gameObject: GameObject;
let component: Camera;
let componentConstructSpy: Mock<() => void>;

beforeEach(() => {
  gameObject = new GameObject();
  component = new Camera({
    backgroundColor: hex("#000"),
    size: 10
  });
  componentConstructSpy = vi.spyOn(component, "construct");
});

describe("Transform", () => {
  it("returns the owner transform from the component", () => {
    gameObject.addComponent(component);
    assert.strictEqual(component.transform, gameObject.transform);
  });

  it("throws if the component is not added", () => {
    assert.throws(() => component.transform);
  });
});

describe("addComponent()", () => {
  it("adds and initializes a component", () => {
    const camera = gameObject.addComponent(component);
    assert.strictEqual(camera, component, "Reference change");
    assert.strictEqual(camera.gameObject, gameObject, "No owner specified");
    expect(componentConstructSpy).toHaveBeenCalledOnce();
  });

  it("throws if components of the same type get added", () => {
    gameObject.addComponent(component);
    assert.throws(() => gameObject.addComponent(component));
    expect(componentConstructSpy).toHaveBeenCalledOnce();
  });
});

describe("getComponent()", () => {
  it("should be accessable through getComponent() once added", () => {
    const a = gameObject.addComponent(component);
    const b = gameObject.getComponent(Camera);
    assert.strictEqual(b, a, "Reference change");
  });

  it("throws if not added", () => {
    assert.throws(() => gameObject.getComponent(Camera));
  });
});

describe("getComponentOrNull()", () => {
  it("returns a non-null value if added", () => {
    const a = gameObject.addComponent(component);
    const b = gameObject.getComponentOrNull(Camera);
    assert.strictEqual(b, a);
  });

  it("returns null if not added", () => {
    const component = gameObject.getComponentOrNull(Camera);
    assert.isNull(component, "Did we add it somewhere?");
  });
});
