import { BaseWorld } from "./base-world";
import { float2 } from "low-level";
import { Windmail } from "obstacles/windmail";
import { Level9 } from "./level9";

export class Level8 extends BaseWorld {
  constructor() {
    super({ width: 24, height: 18, cameraSize: 23 });

    this.addObject(new Windmail({ position: float2(-3, 0) }, {
      iterations: 6,
      scale: 18,
      speed: -30
    }));

    this.addObject(new Windmail({ position: float2(7.5, 4.5), rotation: 50 }, {
      iterations: 3,
      scale: 9.25,
      width: 0.5,
      speed: 60
    }));

    this.addObject(new Windmail({ position: float2(7.5, -4.5), rotation: 10 }, {
      iterations: 3,
      scale: 9.25,
      width: 0.5,
      speed: 60
    }));

    this.createPoints("bottom-left", "top-left", () => new Level9());
  }
}
