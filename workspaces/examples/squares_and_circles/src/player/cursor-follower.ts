import type { BaseWorld } from "worlds";
import { Component, Time } from "@engine/core";
import { float2, Float2, hex } from "low-level";
import { LineRenderer } from "@engine/rendering";
import { Mouse, Screen } from "@engine/user";

export type CursorFollowerProps = {
  stiffness: number;
  damping: number;
};

export class CursorFollower extends Component {
  constructor(private readonly props: CursorFollowerProps) {
    super();
  }

  private velocity = Float2.zero;
  private targetPosition = Float2.zero;

  private path: LineRenderer = null!;
  private shadowPath: LineRenderer = null!;

  public override onStart(): void {
    this.targetPosition = this.transform.position;

    this.path = this.gameObject.world.createEmptyObject({
      position: this.transform.position
    }).addComponent(new LineRenderer({
      from: this.transform.position,
      to: this.targetPosition,
      outline: {
        color: hex("#00f"),
        width: 10
      }
    }));

    this.shadowPath = this.gameObject.world
      .createEmptyObject({ position: this.transform.position })
      .addComponent(new LineRenderer({
        from: this.transform.position,
        to: Float2.zero,
        dash: [20, 20],
        outline: {
          color: hex("#000"),
          width: 10
        }
      }));
  }

  public override onDestroy(): void {
    this.gameObject.world.destroyObject(this.path.gameObject);
    this.gameObject.world.destroyObject(this.shadowPath.gameObject);
  }

  public override update(): void {
    const camera = this.gameObject.world.getActiveCameraOrNull();

    if (!camera) {
      console.warn("No camera found");
      return;
    }

    this.shadowPath.props.to = Screen.toWorldCoords(Mouse.position, camera);

    const world = this.gameObject.world as BaseWorld;
    const isOutOfBounds = world.isOutOfBounds(this.shadowPath.props.to);
    this.shadowPath.props.outline!.color = hex(isOutOfBounds ? "#ff000080" : "#0000ff40");

    if (Mouse.pressed && isOutOfBounds === false) {
      this.targetPosition = Screen.toWorldCoords(Mouse.position, camera);
      this.path.props.to = this.targetPosition;
    }

    const pos = this.transform.position;
    const deltaTime = float2(Time.deltaTime);
    const damping = float2(this.props.damping);

    const distance = Float2.sub(this.targetPosition, pos);
    const step = Float2.mul(distance, float2(this.props.stiffness));

    this.velocity = Float2.add(this.velocity, Float2.mul(step, deltaTime));
    this.velocity = Float2.mul(this.velocity, Float2.sub(Float2.one, Float2.mul(damping, deltaTime)));
    
    this.transform.position = Float2.add(this.transform.position, Float2.mul(this.velocity, deltaTime));
    this.path.props.from = this.transform.position;
    this.shadowPath.props.from = this.transform.position;
  }
}
