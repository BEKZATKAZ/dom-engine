import { Collider } from "collisions/collider";
import { CollisionSimulator } from "collisions/simulator";
import { GameObject } from "game-object";
import type { Mock } from "vitest";

let scheduleSpy: Mock<(collider: Collider) => void>;

beforeEach(() => {
  scheduleSpy = vi.spyOn(CollisionSimulator, "schedule");
});

it("schedules simulation when calling Collider.update()", () => {
  const a = new GameObject().addComponent(new Collider({ type: "rect" }));
  const b = new GameObject().addComponent(new Collider({ type: "rect" }));

  a.update();
  b.update();

  expect(scheduleSpy).toHaveBeenCalledTimes(2);
  CollisionSimulator.simulate();

  const aIntersections = CollisionSimulator.queryIntersections(a.gameObject);
  const bIntersections = CollisionSimulator.queryIntersections(b.gameObject);

  assert.isFalse(aIntersections.includes(a), "They should not intersect with themselves");
  assert.isFalse(bIntersections.includes(b), "They should not intersect with themselves");

  assert.isTrue(aIntersections.includes(b));
  assert.isTrue(bIntersections.includes(a));
});

it("returns no intersections if nothing was simulated", () => {
  const intersections = CollisionSimulator.queryIntersections(new GameObject());
  assert.strictEqual(intersections.length, 0);
});
