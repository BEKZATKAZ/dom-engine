import { Collider } from "./collider";
import { intersects } from "./collision-math";
import type { GameObject, GameObjectId } from "../game-object";

const colliders: Collider[] = [];
const lastIntersections = new Map<GameObjectId, Collider[]>();

function registerIntersection(a: Collider, b: Collider) {
  const id = a.gameObject.id;
  const array = lastIntersections.get(id) || [];
  array.push(b);
  lastIntersections.set(id, array);
}

export class CollisionSimulator {
  public static queryIntersections(of: GameObject): readonly Collider[] {
    const array = lastIntersections.get(of.id);
    if (array) return array;
    
    const newArray: Collider[] = [];
    lastIntersections.set(of.id, newArray);
    return newArray;
  }

  public static schedule(collider: Collider) {
    colliders.push(collider);
  }

  public static simulate() {
    lastIntersections.clear();

    for (let i = 0; i < colliders.length - 1; i++) {
      for (let j = i + 1; j < colliders.length; j++) {
        const a = colliders[i]!;
        const b = colliders[j]!;

        if (intersects(a, b) === false) continue;

        registerIntersection(a, b);
        registerIntersection(b, a);
      }
    }

    colliders.length = 0;
  }
};
