import { CircleRenderer } from "@engine/rendering";
import { Collider, GameObject } from "@engine/core";
import { float2, Float2, hex } from "low-level";
import { GameLayers } from "layers";
import { PickUpView } from "./pickup-view";

export class PickUp extends GameObject {
  private view: GameObject = null!;

  protected override onStart(): void {
    this.layer = GameLayers.Pickup;

    this.view = this.world
      .createEmptyObject({
        position: Float2.zero,
        scale: float2(0.7, 1)
      })
      .addComponent(new PickUpView({
        basePosition: this.transform.position
      })).gameObject
      .addComponent(new CircleRenderer({
        radius: 0.2,
        fillColor: hex("#ff0"),
        outline: {
          color: hex("#000"),
          width: 2
        }
      })).gameObject;

    this.addComponent(new Collider({
      type: "circle",
      radius: 0.2,
      center: Float2.zero
    }));
  }

  protected override onDestroy(): void {
    this.world.destroyObject(this.view);
    this.world.destroyObject(this);
  }
}
