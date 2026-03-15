import { BaseWorld } from "./base-world";
import { float2 } from "low-level";
import { Level7 } from "./level7";
import { PathLoop, StaticWall } from "obstacles";

export class Level6 extends BaseWorld {
  constructor() {
    super();
    this.spawnWall(false);
    this.spawnWall(true);
    this.createPoints("middle-left", "middle-right", () => new Level7());
  }

  private spawnWall(bottom: boolean) {
    this.addObject(new StaticWall({
      position: float2(0, bottom ? -5 : 5)
    }, {
      pivot: float2(0.5, bottom ? 0 : 1)
    }))
      .addComponent(new PathLoop({
        path: [
          { scale: float2(5, 2) },
          { scale: float2(5, 5) }
        ],
        delayBetweenTransforms: 0,
        stepDuration: 0.5
      }));
  }
}
