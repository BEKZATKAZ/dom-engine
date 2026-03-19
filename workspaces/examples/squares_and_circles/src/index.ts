import { CollisionSimulator, Time, WorldManager } from "@engine/core";
import { Level1, BackgroundWorld } from "./worlds";
import { setupLayerMatrix } from "./layers";
import { RenderBuffer } from "@engine/rendering";
import * as music from "./music-player";

function update(time: number) {
  Time.updateTimeSinceStart(time * 0.001);
  RenderBuffer.clear();

  WorldManager.update();
  CollisionSimulator.simulate();
  
  RenderBuffer.renderScheduled();
  requestAnimationFrame(update);
}

window.addEventListener("load", () => {
  setupLayerMatrix();
  WorldManager.load(new BackgroundWorld());
  WorldManager.load(new Level1());
  requestAnimationFrame(update);
});
