import { BaseWorld } from "./base-world";
import { Color, Float2, float2 } from "low-level";
import { PathLoop, StaticWall, type PathLoopTransform } from "obstacles";

export class Level9 extends BaseWorld {
  constructor() {
    super({ width: 24, height: 12, cameraSize: 23 });

    this.addObject(new StaticWall({
      position: float2(0, 2),
      scale: float2(20, 4)
    }, {
      pivot: float2(0.5, 0)
    }));

    this.addObject(new StaticWall({
      position: float2(0, -2),
      scale: float2(20, 4)
    }, {
      pivot: float2(0.5, 1)
    }));
    
    for (let i = 0; i < 10; i++) this.spawnBouncingObject(i);

    for (let i = 1; i < 9; i++) {
      const x = (i / 9) * 20 - 10;
      const y = (i & 1) === 0 ? -2 : 2;

      this.addObject(new StaticWall({
        position: float2(x, y),
        scale: float2(0.25, 2)
      }, {
        pivot: float2(0.5, i & 1),
        color: Color.black
      }));

      this.addObject(new StaticWall({
        position: float2(x, y + ((i & 1) === 0 ? 2 : -2)),
        scale: float2(0.5, 0.5)
      }));
    }

    this.createPoints("top-left", "top-right");
  }

  private spawnBouncingObject(indexOffset: number) {
    const path: PathLoopTransform[] = [];

    for (let i = indexOffset; i < 10; i++) {
      const x = (i / 9) * 20 - 10;
      const y = (i & 1) === 0 ? 1.5 : -1.5;
      path.push({ position: float2(x, y) });
    }
    
    const lastPosition = path[path.length - 1]!.position!;

    path.push({ position: float2(Float2.x(lastPosition), -5.5) });
    path.push({ position: float2(-10, -5.5) });

    for (let i = 0; i < indexOffset; i++) {
      const x = (i / 9) * 20 - 10;
      const y = (i & 1) === 0 ? 1.5 : -1.5;
      path.push({ position: float2(x, y) });
    }

    this.addObject(new StaticWall({}, { color: Color.orange })).addComponent(new PathLoop({
      path,
      ease: "sine-out",
      delayBetweenTransforms: 0,
      stepDuration: 0.4
    }));
  }
}
