import { CircleRenderer } from "@engine/rendering";
import { Collider, GameObject } from "@engine/core";
import { CursorFollower } from "./cursor-follower";
import { Float2, hex } from "low-level";
import { LevelLoader } from "./level-loader";
import { LevelRestarter } from "./level-restarter";

export class PlayerActor extends GameObject {
  protected override onStart(): void {
    this.addComponent(new CursorFollower({
      stiffness: 700,
      damping: 25
    }));

    this.addComponent(new CircleRenderer({
      radius: 0.25,
      fillColor: hex("#00f"),
      outline: {
        color: hex("#000"),
        width: 5
      }
    }));

    this.addComponent(new Collider({
      type: "circle",
      center: Float2.zero,
      radius: 0.2
    }));

    this.addComponent(new LevelLoader());
    this.addComponent(new LevelRestarter());
  }
}
