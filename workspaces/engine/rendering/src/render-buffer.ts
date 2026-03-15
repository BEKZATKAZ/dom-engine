import { clear, draw } from "./canvas-drawer";
import { WorldManager } from "@engine/core";
import type { Renderer } from "./renderer";

const renderers: Renderer[] = [];

export class RenderBuffer {
  public static schedule(renderer: Renderer) {
    renderers.push(renderer);
  }

  public static clear() {
    for (const camera of WorldManager.getActiveCameras()) clear(camera);
    renderers.length = 0;
  }

  public static renderScheduled() {
    for (const camera of WorldManager.getActiveCameras()) {
      for (let i = 0; i < renderers.length; i++) {
        try { draw(renderers[i]!, camera); }
        catch (err) { console.error(err); }
      }
    }
  }
};
