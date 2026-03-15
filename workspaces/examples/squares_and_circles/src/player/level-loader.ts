import type { BaseWorld } from "worlds";
import { Collider, CollisionSimulator, Component } from "@engine/core";
import { DestinationPoint } from "points";

export class LevelLoader extends Component {
  public override update(): void {
    const isEnd = CollisionSimulator
      .queryIntersections(this.gameObject)
      .some((x: Collider) => x.gameObject instanceof DestinationPoint);

    if (isEnd === false) return;

    const world = this.gameObject.world as BaseWorld;
    world.loadNextLevel();
  }
}
