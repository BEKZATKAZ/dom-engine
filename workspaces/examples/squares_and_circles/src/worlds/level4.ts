import { BaseWorld } from "./base-world";
import { float2 } from "low-level";
import { Level5 } from "./level5";
import { PathLoop, StaticWall } from "obstacles";

export class Level4 extends BaseWorld {
  constructor() {
    super();

    for (let i = -4; i <= 4; i++) {
      const isEven = (i & 1) === 0;
      const x = i * 1.3;

      this.addObject(new StaticWall({ scale: float2(1.2, 8) }))
        .addComponent(new PathLoop({
          path: [
            { position: float2(x, isEven ? 1 : -1) },
            { position: float2(x, isEven ? -1 : 1) }
          ],
          stepDuration: 0.6,
          delayBetweenTransforms: 0.2
        }));
    }

    this.createPoints("middle-left", "middle-right", () => new Level5());
  }
}
