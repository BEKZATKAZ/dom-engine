import { Component, Time } from "@engine/core";
import { Float2, GamingMath, type float2 } from "low-level";

type Snapshot = {
  position: float2;
  rotation: number;
  scale: float2;
};

export type PathLoopTransform = {
  position?: float2;
  rotation?: number;
  scale?: float2;
};

export type PathLoopProps = {
  path: readonly PathLoopTransform[];
  stepDuration?: number;
  delayBetweenTransforms?: number;
};

export class PathLoop extends Component {
  constructor(params: Readonly<PathLoopProps>) {
    super();
    this.path = params.path;
    this.stepDuration = params.stepDuration || 0.5;
    this.delayBetweenTransforms = params.delayBetweenTransforms || 0;
  }

  private readonly path: readonly PathLoopTransform[];
  private readonly stepDuration: number;
  private readonly delayBetweenTransforms: number;

  private previousSnapshot: Snapshot = null!;
  private previousIndex = 0;
  private targetIndex = 1;
  private progress = 0;

  private captureSnapshot() {
    this.previousSnapshot = {
      scale: this.transform.scale,
      position: this.transform.position,
      rotation: this.transform.rotation
    };
  }

  private nextPosition() {
    this.captureSnapshot();
    this.progress = 0;

    if (++this.targetIndex < this.path.length) {
      this.previousIndex++;
      return;
    }

    this.previousIndex = this.path.length - 1;
    this.targetIndex = 0;
  }

  private onReach() {
    const delay = this.delayBetweenTransforms ?? 0;

    if (delay > 0) {
      setTimeout(() => this.nextPosition(), delay * 1000);
      return;
    }

    this.nextPosition();
  }

  public override construct(): void {
    if (this.path.length < 2) {
      throw new RangeError("Path loop should have at least 2 positions");
    }

    const { position, rotation, scale } = this.path[0]!;

    if (rotation !== undefined) this.transform.rotation = rotation;
    if (position !== undefined) this.transform.position = position;
    if (scale !== undefined) this.transform.scale = scale;

    this.captureSnapshot();
  }

  public override update(): void {
    if (this.progress >= 1) return;

    const target = this.path[this.targetIndex]!;
    const duration = this.stepDuration;
    const snapshot = this.previousSnapshot;

    this.progress = Math.min(this.progress + Time.deltaTime / duration);

    if (target.rotation !== undefined) {
      this.transform.rotation = GamingMath.lerp(snapshot.rotation, target.rotation, this.progress);
    }

    if (target.position !== undefined) {
      this.transform.position = Float2.lerp(snapshot.position, target.position, this.progress);
    }

    if (target.scale !== undefined) {
      this.transform.scale = Float2.lerp(snapshot.scale, target.scale, this.progress);
    }

    if (this.progress >= 1) this.onReach();
  }
};
