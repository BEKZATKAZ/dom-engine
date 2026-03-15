import { Color, float2, Float2, GamingMath, hex, Random, type color } from "low-level";
import { Component, GameObject, ObjectPool, Time, type GameObjectId } from "@engine/core";
import { Particle } from "./particle";
import { RectRenderer } from "../renderer";

function evaluateNumber(range: ParticleRange<number>): number {
  return GamingMath.lerp(range.min, range.max, Math.random());
}

function evaluateColor(range: ParticleRange<color>): color {
  return Color.lerp(range.min, range.max, Math.random());
}

function evaluateVector(range: ParticleRange<float2>): float2 {
  return Float2.lerp(range.min, range.max, Math.random());
}

export type ParticleRange<T = number> = {
  min: T;
  max: T;
};

export type ParticleEmitterProps = {
  size?: ParticleRange<number>;
  rotation?: ParticleRange<number>;

  baseColor: ParticleRange<color>;
  lifeTime: ParticleRange<number>;
  amount: ParticleRange<number>;

  duration?: number;
  loop?: boolean;

  linearVelocity?: ParticleRange<float2>;
  angularVelocity?: ParticleRange<number>;
  radius?: ParticleRange<number>;
};

export class ParticleEmitter extends Component {
  constructor(params: ParticleEmitterProps) {
    super();
    const props = { ...params };

    props.size ??= { min: 1, max: 1 };
    props.rotation ??= { min: 0, max: 0 };
    props.duration ??= 0.2;
    props.loop ??= true;
    props.linearVelocity ??= { min: float2(0, 0.5), max: float2(0, 1) };
    props.angularVelocity ??= { min: -180, max: 180 };
    props.radius ??= { min: 0, max: 0.5 };

    this.props = props as Required<ParticleEmitterProps>;
  }

  private readonly props: Required<ParticleEmitterProps>;
  private readonly activeParticles = new Map<GameObjectId, Particle>();
  private readonly toDeactiveBuffer: GameObjectId[] = [];

  private particlePool: ObjectPool<GameObject> = null!;
  private lastBurstTime = -99999;

  public override construct(): void {
    this.particlePool = new ObjectPool<GameObject>({
      initialSize: this.props.amount.max,
      createFunc: () => {
        const particle = this.gameObject.world.createEmptyObject();
        particle.addComponent(new Particle());
        particle.addComponent(new RectRenderer({ fillColor: hex("#fff") }));
        return particle;
      },
      requestFunc: x => x.active = true,
      returnFunc: x => x.active = false,
      destroyFunc: this.gameObject.world.destroyObject
    });
  }

  public override onDestroy(): void {
    for (const particle of this.activeParticles.values()) {
      this.particlePool.return(particle.gameObject);
    }

    this.toDeactiveBuffer.length = 0;
    this.activeParticles.clear();
    this.particlePool.close();
  }

  public override update(): void {
    const now = Time.timeSinceStart;
    this.returnDead();

    if ((now - this.lastBurstTime) < this.props.duration) return;
    if (this.lastBurstTime >= 0 && this.props.loop === false) return; // Return if not a loop

    this.lastBurstTime = now;
    const amountRange = this.props.amount;

    if (this.activeParticles.size >= amountRange.max) return;

    let burstAmount = evaluateNumber(amountRange);
    burstAmount = Math.min(burstAmount, amountRange.max - this.activeParticles.size);
    this.burst(burstAmount, now);
  }

  private burst(amount: number, now: number) {
    const props = this.props;

    for (let i = 0; i < amount; i++) {
      const instance = this.particlePool.request();
      const particle = instance.getComponent(Particle);
      const transform = instance.transform;

      particle.linearVelocity = evaluateVector(props.linearVelocity);
      particle.angularVelocity = evaluateNumber(props.angularVelocity);
      particle.baseColor = evaluateColor(props.baseColor);
      particle.lifeTime = evaluateNumber(props.lifeTime);
      particle.startTime = now;

      const size = float2(evaluateNumber(props.size));
      const angle = Random.uniform(0, Math.PI * 2);
      const radius = evaluateNumber(props.radius);
      const localPosition = float2(
        Math.sin(angle) * radius,
        Math.cos(angle) * radius
      );

      transform.rotation = evaluateNumber(props.rotation);
      transform.position = Float2.add(this.gameObject.transform.position, localPosition);
      transform.scale = size;

      this.activeParticles.set(instance.id, particle);
    }
  }

  private returnDead() {
    for (const [id, particle] of this.activeParticles) {
      if (particle.isDead() === false) continue;
      this.toDeactiveBuffer.push(id);
    }

    for (const id of this.toDeactiveBuffer) {
      this.particlePool.return(this.activeParticles.get(id)!.gameObject);
      this.activeParticles.delete(id);
    }

    this.toDeactiveBuffer.length = 0;
  }
}
