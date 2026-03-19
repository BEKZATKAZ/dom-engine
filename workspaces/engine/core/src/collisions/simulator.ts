import { Collider } from "./collider";
import { broadIntersects, narrowIntersects } from "./phases";
import { LayerMatrix } from "layers";
import type { GameObject, GameObjectId } from "../game-object";

const colliders: Collider[] = [];
const lastIntersections = new Map<GameObjectId, Collider[]>();

function registerIntersection(a: Collider, b: Collider) {
  const id = a.gameObject.id;
  const array = lastIntersections.get(id) || [];
  array.push(b);
  lastIntersections.set(id, array);
}

function checkIntersection(a: Collider, b: Collider): boolean {
  if (LayerMatrix.isContactAllowed(a.gameObject.layer, b.gameObject.layer) === false) return false;
  return broadIntersects(a, b) && narrowIntersects(a, b);
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
        try {
          const a = colliders[i]!;
          const b = colliders[j]!;

          if (checkIntersection(a, b) === false) continue;
          registerIntersection(a, b);
          registerIntersection(b, a);
        }
        catch (err) {
          console.error("Collision simulation failed", err);
        }
      }
    }

    colliders.length = 0;
  }
};
