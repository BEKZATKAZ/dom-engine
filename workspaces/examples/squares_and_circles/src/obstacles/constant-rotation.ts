import { Component, Time } from "@engine/core";

export type ConstantRotationProps = {
  speed: number;
};

export class ConstantRotation extends Component {
  constructor(params: ConstantRotationProps) {
    super();
    this.speedDegrees = params.speed;
  }

  private readonly speedDegrees: number;

  public override update(): void {
    this.transform.rotation += this.speedDegrees * Time.deltaTime;
  }
}
