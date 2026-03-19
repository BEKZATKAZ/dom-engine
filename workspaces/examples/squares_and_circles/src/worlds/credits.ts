import { BaseWorld } from "./base-world";
import { hex } from "low-level";
import { TextRenderer } from "@engine/rendering";

export class CreditsLevel extends BaseWorld {
  constructor() {
    super();

    this.createEmptyObject()
      .addComponent(new TextRenderer({
        text: "THANKS FOR PLAYING!",
        font: "1px monospace",
        fillColor: hex("#00000080")
      }));

    this.createPoints("middle-left", "middle-right");
  }
}
