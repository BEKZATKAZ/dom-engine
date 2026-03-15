import { Component } from "./component";
import type { HexColor } from "low-level";

export type CameraProps = {
  size: number;
  backgroundColor: HexColor;
};

export class Camera extends Component {
  constructor(params: CameraProps) {
    super();
    this.size = params.size;
    this.backgroundColor = params.backgroundColor;
  }

  public readonly size: number;
  public readonly backgroundColor: HexColor;

  public override update(): void {
    this.gameObject.world.setActiveCamera(this);
  }
};
