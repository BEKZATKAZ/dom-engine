import { Collider } from "collisions/collider";
import { float2 } from "low-level";
import { GameObject } from "game-object";
import { CirclevsCircle, intersects, OBBvsCircle, OBBvsOBB } from "collisions/collision-math";

type ColliderType = "rect" | "circle";

describe("Incorrect method calls", () => {
  it("throws when calling intersects() with invalid types", () => {
    assert.throws(() => intersects(
      new Collider({ type: "invalid-type" as ColliderType, radius: 1 }),
      new Collider({ type: "rect" })
    ));

    assert.throws(() => intersects(
      new Collider({ type: "invalid-type" as ColliderType, radius: 1 }),
      new Collider({ type: "circle", radius: 1 })
    ));

    assert.throws(() => intersects(
      new Collider({ type: "circle", radius: 1 }),
      new Collider({ type: "invalid-type" as ColliderType, radius: 1 })
    ));

    assert.throws(() => intersects(
      new Collider({ type: "rect" }),
      new Collider({ type: "invalid-type" as ColliderType, radius: 1 })
    ));
  });

  it.each([
    ["rect" as ColliderType, "circle" as ColliderType],
    ["circle" as ColliderType, "rect" as ColliderType],
    ["circle" as ColliderType, "circle" as ColliderType]
  ])("throws when calling OBBvsOBB() with wrong types", (a: ColliderType, b: ColliderType) => {
    assert.throws(() => OBBvsOBB(
      new Collider({ type: a, radius: 1 }),
      new Collider({ type: b, radius: 1 })
    ), TypeError);
  });

  it.each([
    ["rect" as ColliderType, "rect" as ColliderType],
    ["circle" as ColliderType, "rect" as ColliderType],
    ["circle" as ColliderType, "circle" as ColliderType]
  ])("throws when calling OBBvsCircle() with wrong types", (a: ColliderType, b: ColliderType) => {
    assert.throws(() => OBBvsCircle(
      new Collider({ type: a, radius: 1 }),
      new Collider({ type: b, radius: 1 })
    ), TypeError);
  });

  it.each([
    ["rect" as ColliderType, "rect" as ColliderType],
    ["rect" as ColliderType, "circle" as ColliderType],
    ["circle" as ColliderType, "rect" as ColliderType]
  ])("throws when calling CirclevsCircle() with wrong types", (a: ColliderType, b: ColliderType) => {
    assert.throws(() => CirclevsCircle(
      new Collider({ type: a, radius: 1 }),
      new Collider({ type: b, radius: 1 })
    ), TypeError);
  });
});

describe("OBB vs OBB", () => {
  it.each([
    [float2(10, 5),  float2(9.6, 5.6)],
    [float2(2, 20),  float2(2, 20)],
    [float2(1, 200), float2(1.4, 199.6)],
    [float2(0, 0),   float2(0, 0)]
  ])("returns true if both rectangles overlap", (ap: float2, bp: float2) => {
    for (let i = 0; i < 8; i++) {
      const rotation = i * 45;

      const a = new GameObject({ position: ap, rotation })
        .addComponent(new Collider({ type: "rect" }));

      const b = new GameObject({ position: bp, rotation: rotation + 15 })
        .addComponent(new Collider({ type: "rect" }));

      assert.isTrue(intersects(a, b));
      assert.isTrue(intersects(b, a), "Worked with (a <-> b) but not with (b <-> a)?");
    }
  });

  it.each([
    [float2(50, 5),  float2(10, 5.6)],
    [float2(2, 20),  float2(2, 1000)]
  ])("returns false if both rectangles are separate", () => {
    const a = new GameObject({ position: float2(20, 5) })
      .addComponent(new Collider({ type: "rect" }));

    const b = new GameObject({ position: float2(5, 100) })
      .addComponent(new Collider({ type: "rect" }));

    assert.isFalse(intersects(a, b));
    assert.isFalse(intersects(b, a), "Worked with (a <-> b) but not with (b <-> a)?");
  });
});

describe("OBB vs Circle", () => {
  it.each([
    [float2(10, 5),  float2(9.6, 5.6)],
    [float2(2, 20),  float2(2, 20)],
    [float2(1, 200), float2(1.4, 199.6)],
    [float2(0, 0),   float2(0, 0)]
  ])("returns true if both overlap", (ap: float2, bp: float2) => {
    const a = new GameObject({ position: ap })
      .addComponent(new Collider({ type: "rect" }));

    const b = new GameObject({ position: bp })
      .addComponent(new Collider({ type: "circle", radius: 1 }));

    assert.isTrue(intersects(a, b));
    assert.isTrue(intersects(b, a), "Worked with (a <-> b) but not with (b <-> a)?");
  });

  it.each([
    [float2(50, 5),  float2(10, 5.6)],
    [float2(2, 20),  float2(2, 1000)]
  ])("returns false if both are separate", (ap: float2, bp: float2) => {
    const a = new GameObject({ position: ap })
      .addComponent(new Collider({ type: "rect" }));

    const b = new GameObject({ position: bp })
      .addComponent(new Collider({ type: "circle", radius: 1 }));

    assert.isFalse(intersects(a, b));
    assert.isFalse(intersects(b, a), "Worked with (a <-> b) but not with (b <-> a)?");
  });
});

describe("Circle vs Circle", () => {
  it.each([
    [float2(10, 5),  float2(9.6, 5.6)],
    [float2(2, 20),  float2(2, 20)],
    [float2(1, 200), float2(1.4, 199.6)],
    [float2(0, 0),   float2(0, 0)]
  ])("returns true if both circles overlap", (ap: float2, bp: float2) => {
    const a = new GameObject({ position: ap })
      .addComponent(new Collider({ type: "circle", radius: 10 }));

    const b = new GameObject({ position: bp })
      .addComponent(new Collider({ type: "circle", radius: 0.1 }));

    assert.isTrue(intersects(a, b));
    assert.isTrue(intersects(b, a), "Worked with (a <-> b) but not with (b <-> a)?");
  });

  it.each([
    [float2(50, 5),  float2(10, 5.6)],
    [float2(2, 20),  float2(2, 1000)]
  ])("returns false if both circles are separate", (ap: float2, bp: float2) => {
    const a = new GameObject({ position: ap })
      .addComponent(new Collider({ type: "circle", radius: 5 }));

    const b = new GameObject({ position: bp })
      .addComponent(new Collider({ type: "circle", radius: 15 }));

    assert.isFalse(intersects(a, b));
    assert.isFalse(intersects(b, a), "Worked with (a <-> b) but not with (b <-> a)?");
  });
});
