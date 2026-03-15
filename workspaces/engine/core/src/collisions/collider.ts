import { CollisionSimulator } from "./simulator";
import { Component } from "../component";
import { Float2, float2 } from "low-level";

export type CircleColliderProps = {
  type: "circle";
  center?: float2;
  radius: number;
};

export type RectangeColliderProps = {
  type: "rect";
  center?: float2;
  halfSize?: float2;
};

export type ColliderProps = RectangeColliderProps | CircleColliderProps;

export class Collider extends Component {
  constructor(props: ColliderProps) {
    super();

    this.props = props as Required<ColliderProps>;
    this.props.center ??= Float2.zero;

    if (this.props.type !== "rect") return;
    this.props.halfSize ??= Float2.one;
  }

  public readonly props: Required<ColliderProps>;

  public override update(): void {
    CollisionSimulator.schedule(this);
  }
}
