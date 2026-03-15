import { color, float2 } from "low-level";
import { ParticleEmitter } from "@engine/rendering";
import { World } from "@engine/core";

export class BackgroundWorld extends World {
  constructor() {
    super();

    this.createEmptyObject()
      .addComponent(new ParticleEmitter({
        duration: 2,
        size: { min: 0.75, max: 2.5 },
        amount: { min: 1000, max: 140 },
        lifeTime: { min: 10, max: 16 },

        loop: true,
        radius: { min: 2, max: 20 },
        baseColor: {
          min: color(255, 255, 255, 40),
          max: color(255, 255, 255, 80)
        },
        
        linearVelocity: { min: float2(-0.2), max: float2(0.2) },
        angularVelocity: { min: -10, max: 10 }
      }));
  }
}
