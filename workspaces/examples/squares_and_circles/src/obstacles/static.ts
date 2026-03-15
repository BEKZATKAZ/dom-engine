import { Collider, GameObject, type TransformParams } from "@engine/core";
import { Color, color, float2, Float2, hex } from "low-level";
import { RectRenderer } from "@engine/rendering";

export type StaticWallParams = {
  pivot?: float2;
  color?: color;
};

export class StaticWall extends GameObject {
  constructor(transform: TransformParams, params?: StaticWallParams) {
    super(transform);
    this.params = {
      pivot: params?.pivot ?? float2(0.5),
      color: params?.color ?? Color.red
    };
  }

  private readonly params: Required<StaticWallParams>;

  protected override onStart(): void {
    const pivot = this.params.pivot;

    this.addComponent(new Collider({
      type: "rect",
      center: Float2.sub(float2(0.5), pivot),
      halfSize: float2(0.5)
    }));

    this.addComponent(new RectRenderer({
      pivot,
      fillColor: hex(this.params.color),
      outline: {
        color: hex("#000"),
        width: 12
      }
    }));
  }
}
