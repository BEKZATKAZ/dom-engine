import { BaseWorld } from "./base-world";
import { Level6 } from "./level6";
import { Windmail } from "obstacles/windmail";

export class Level5 extends BaseWorld {
  constructor() {
    super();
    this.addObject(new Windmail({}, { scale: 9.5 }));
    this.addObject(new Windmail({ rotation: 90 }, { scale: 9.5 }));
    this.createPoints("middle-left", "middle-right", () => new Level6());
  }
}
