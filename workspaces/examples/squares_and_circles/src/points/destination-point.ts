import { Collider } from "@engine/core";
import { float2, hex } from "low-level";
import { Point } from "./point";
import { RectRenderer } from "@engine/rendering";

export class DestinationPoint extends Point {
  protected override onStart(): void {
    super.onStart();

    this.addComponent(new Collider({
      type: "rect",
      center: float2(0),
      halfSize: float2(0.5)
    }));

    this.addComponent(new RectRenderer({
      fillColor: hex("#000000ab"),
      outline: {
        color: hex("#0f0"),
        width: 10
      }
    }));
  }
}
