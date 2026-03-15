import { color, float2 } from "low-level";
import { GameObject } from "@engine/core";
import { ParticleEmitter } from "@engine/rendering";

export abstract class Point extends GameObject {
  protected override onStart(): void {
    this.addComponent(new ParticleEmitter({
      duration: 0.1,
      loop: true,
      amount: { min: 5, max: 20 },
      lifeTime: { min: 0.6, max: 1.2 },
      size: { min: 0.1, max: 0.2 },
      baseColor: {
        min: color(0, 0, 0, 96),
        max: color(0, 0, 0, 128)
      },
      radius: { min: 0.4, max: 0.6 },
      rotation: { min: -180, max: 180 },
      linearVelocity: { min: float2(-0.5), max: float2(0.5) },
      angularVelocity: { min: 20, max: 45 }
    }));
  }
}
