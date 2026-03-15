import type { BaseWorld } from "worlds";
import type { GameObject } from "@engine/core";

import { Collider, CollisionSimulator, Component } from "@engine/core";
import { color, Color, float2 } from "low-level";
import { ParticleEmitter } from "@engine/rendering";
import { StaticWall } from "obstacles";

export class LevelRestarter extends Component {
  private deathParticleEmitter: GameObject = null!;

  private restart() {
    const world = this.gameObject.world as BaseWorld;
    
    world.destroyObject(this.gameObject);
    setTimeout(() => world.restart(), 600);

    this.deathParticleEmitter.transform.position = this.transform.position;
    this.deathParticleEmitter.active = true;
  }

  public override onStart(): void {
    this.deathParticleEmitter = this.gameObject.world
      .createEmptyObject()
      .addComponent(new ParticleEmitter({
        amount: { min: 10, max: 20 },
        lifeTime: { min: 0.3, max: 0.7 },
        baseColor: { min: color(0, 0, 255, 200), max: color(0, 0, 255) },
        size: { min: 0.1, max: 0.2 },
        linearVelocity: { min: float2(-1), max: float2(1) },
        angularVelocity: { min: -180, max: 180 },
        loop: false,
        duration: 10
      })).gameObject;

    this.deathParticleEmitter.active = false;
  }

  public override update(): void {
    const position = this.transform.position;
    const world = this.gameObject.world as BaseWorld;

    if (world.isOutOfBounds(position, 0.2)) {
      this.restart();
      return;
    }

    const intersects = CollisionSimulator
      .queryIntersections(this.gameObject)
      .some((x: Collider) => x.gameObject instanceof StaticWall);

    if (intersects) this.restart();
  }
}
