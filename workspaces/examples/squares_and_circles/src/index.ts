import { CollisionSimulator, Time, WorldManager } from "@engine/core";
import { Level1, BackgroundWorld } from "./worlds";
import { Level8 } from "./worlds/level8";
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
  WorldManager.load(new BackgroundWorld());
  WorldManager.load(new Level8());
  requestAnimationFrame(update);
});
