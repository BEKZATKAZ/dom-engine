import { ConstantRotation } from "./constant-rotation";
import { Color, float2, hex } from "low-level";
import { GameObject, type TransformParams } from "@engine/core";
import { StaticWall } from "./static";
import { CircleRenderer } from "@engine/rendering";

export type WindmailParams = {
  iterations: number;
  scale: number;
  width: number;
  speed: number;
};

export class Windmail extends GameObject {
  constructor(transform: TransformParams, params: Partial<WindmailParams>) {
    super(transform);
    this.params = params as WindmailParams;
    this.params.iterations ??= 2;
    this.params.scale ??= 9.5;
    this.params.width ??= 1;
    this.params.speed ??= 90;
  }

  private readonly params: WindmailParams;

  protected override onStart(): void {
    const step = 180 / this.params.iterations;

    for (let i = 0; i < this.params.iterations; i++) {
      this.world.addObject(new StaticWall({
        position: this.transform.position,
        rotation: step * i + this.transform.rotation,
        scale: float2(this.params.width, this.params.scale)
      })).addComponent(new ConstantRotation({ speed: this.params.speed }));
    }

    this.world.createEmptyObject({ position: this.transform.position })
      .addComponent(new CircleRenderer({
        radius: this.params.width * 2,
        fillColor: hex(Color.black)
      }));
  }
}
