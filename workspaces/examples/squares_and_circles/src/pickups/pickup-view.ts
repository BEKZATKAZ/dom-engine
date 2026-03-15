import { Component, Time } from "@engine/core";
import { float2, Float2 } from "low-level";

export type PickUpViewProps = {
  basePosition: float2;
  speed?: number;
  height?: number;
};

export class PickUpView extends Component {
  constructor(params: PickUpViewProps) {
    super();
    this.props = { ...params } as Required<PickUpViewProps>;
    this.props.speed = 1;
    this.props.height = 0.2;
  }

  private readonly props: Required<PickUpViewProps>;

  public override update(): void {
    const maxHeight = this.props.height;
    const speed = this.props.speed;
    const height = Math.sin(Time.timeSinceStart * Math.PI * speed) * maxHeight;
    const y = Float2.y(this.props.basePosition) + height;
    this.transform.position = float2(Float2.x(this.transform.position), y);
  }
}
