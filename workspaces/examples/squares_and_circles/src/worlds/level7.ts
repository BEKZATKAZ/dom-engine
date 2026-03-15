import { BaseWorld } from "./base-world";
import { ConstantRotation, PathLoop, StaticWall } from "obstacles";
import { float2 } from "low-level";
import { Level8 } from "./level8";
import { Windmail } from "obstacles/windmail";

export class Level7 extends BaseWorld {
  constructor() {
    super({ width: 24, height: 18, cameraSize: 23 });

    this.addObject(new StaticWall({
      position: float2(-12, -5),
      scale: float2(21, 2)
    }, {
      pivot: float2(0, 0)
    }));

    this.addObject(new StaticWall({
      position: float2(12, 9),
      scale: float2(22, 2)
    }, {
      pivot: float2(1, 1)
    }));

    this.addObject(new StaticWall({
      position: float2(-12, 5.5),
      scale: float2(2, 8.5)
    }, {
      pivot: float2(0, 1)
    }));

    this.addObject(new Windmail({ position: float2(4, 2) }, {}));
    this.addObject(new Windmail({
      position: float2(-4, 2),
      rotation: 45
    }, {
      speed: -90
    }));

    for (let i = 0; i < 10; i++) {
      const bottom = (i & 1) === 0;
      const x = i * 2 - 9.5;

      this.addObject(new StaticWall({
        position: float2(x, bottom ? -9 : -5)
      }, {
        pivot: float2(0.5, bottom ? 0 : 1)
      }))
        .addComponent(new PathLoop({
          path: [
            { scale: float2(1, bottom ? 1 : 4) },
            { scale: float2(1, bottom ? 4 : 1) }
          ],
          ease: "exponential-out",
          delayBetweenTransforms: (10 - i) * 0.025,
          stepDuration: 0.45
        }));
    }

    this.createPoints("bottom-left", "top-left", () => new Level8());
  }
}
