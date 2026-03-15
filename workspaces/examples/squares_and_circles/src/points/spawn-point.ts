import { hex } from "low-level";
import { PlayerActor } from "player";
import { Point } from "./point";
import { RectRenderer } from "@engine/rendering";

export class SpawnPoint extends Point {
  protected override onStart(): void {
    super.onStart();

    this.addComponent(new RectRenderer({
      fillColor: hex("#000000ab"),
      outline: {
        color: hex("#ffef62"),
        width: 10
      }
    }));

    this.world.addObject(new PlayerActor({
      position: this.transform.position
    }));
  }
}
