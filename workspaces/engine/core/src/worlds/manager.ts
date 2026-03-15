import type { Camera } from "../camera";
import { World } from "./world";

export class WorldManager {
  private static loadedWorlds: World[] = [];

  public static get loadedWorldCount() {
    return this.loadedWorlds.length;
  }

  public static* getActiveCameras(): Iterable<Camera> {
    for (const world of this.loadedWorlds) {
      const camera = world.getActiveCameraOrNull();
      if (camera) yield camera;
    }
  }

  public static load(world: World): World {
    if (this.loadedWorlds.includes(world)) throw new Error("World already loaded");
    this.loadedWorlds.push(world);
    return world;
  }

  public static unload(world: World) {
    this.loadedWorlds = this.loadedWorlds.filter(x => x !== world);
    if (world.active) world.destroy();
  }

  public static update() {
    for (const world of this.loadedWorlds) world.update();
  }
};
