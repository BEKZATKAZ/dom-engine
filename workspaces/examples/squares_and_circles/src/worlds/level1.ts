import { BaseWorld } from "./base-world";
import { hex } from "low-level";
import { Level2 } from "./level2";
import { TextRenderer } from "@engine/rendering";

export class Level1 extends BaseWorld {
  constructor() {
    super();

    this.createEmptyObject()
      .addComponent(new TextRenderer({
        text: "LEFT-CLICK TO MOVE",
        font: "1px monospace",
        fillColor: hex("#00000080")
      }));

    this.createPoints("middle-left", "middle-right", () => new Level2());
  }
}
