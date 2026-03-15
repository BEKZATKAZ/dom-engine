import { BaseWorld } from "./base-world";
import { float2 } from "low-level";
import { Level4 } from "./level4";
import { StaticWall } from "obstacles";

export class Level3 extends BaseWorld {
  constructor() {
    super();

    this.addObject(new StaticWall({
      position: float2(-8, 0),
      scale: float2(12.5, 5)
    }, {
      pivot: float2(0, 0.5)
    }));

    this.createPoints("bottom-left", "top-left", () => new Level4());
  }
}
