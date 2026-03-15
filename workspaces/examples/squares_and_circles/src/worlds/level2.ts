import { BaseWorld } from "./base-world";
import { float2, hex } from "low-level";
import { Level3 } from "./level3";
import { PickUp } from "pickups";
import { StaticWall } from "obstacles";
import { TextRenderer } from "@engine/rendering";

export class Level2 extends BaseWorld {
  constructor() {
    super();
    this.createEmptyObject()
      .addComponent(new TextRenderer({
        text: "DON'T HIT OBSTACLES",
        font: "1px monospace",
        fillColor: hex("#00000080")
      }));

    this.addObject(new StaticWall({
      position: float2(0, -5),
      scale: float2(2.5)
    }, {
      pivot: float2(0.5, 0)
    }));

    this.addObject(new StaticWall({
      position: float2(0, 5),
      scale: float2(2.5)
    }, {
      pivot: float2(0.5, 1)
    }));

    this.addObject(new PickUp({
      position: float2(0, -2)
    }));
    
    this.addObject(new PickUp({
      position: float2(0, 2)
    }));

    this.createPoints("bottom-left", "top-right", () => new Level3());
  }
}
