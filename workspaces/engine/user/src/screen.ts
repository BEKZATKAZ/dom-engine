import type { Camera } from "@engine/core";
import { Float2, float2 } from "low-level";

export class Screen {
  public static get width() { return window.innerWidth; }
  public static get height() { return window.innerHeight; }

  public static toWorldCoords(screenPosition: float2, camera: Camera): float2 {
    const halfWidth = Screen.width * 0.5;
    const halfHeight = Screen.height * 0.5;
    const sizeMultiplier = Math.min(halfWidth, halfHeight) * 2 / camera.size;

    const x = -(halfWidth - Float2.x(screenPosition)) / sizeMultiplier;
    const y = (halfHeight - Float2.y(screenPosition)) / sizeMultiplier;
    return float2(x, y);
  }

  public static toScreenCoords(worldPosition: float2, camera: Camera): float2 {
    const halfWidth = Screen.width * 0.5;
    const halfHeight = Screen.height * 0.5;
    const sizeMultiplier = Math.min(halfWidth, halfHeight) * 2 / camera.size;
    
    const x = halfWidth + Float2.x(worldPosition) * sizeMultiplier;
    const y = halfHeight - Float2.y(worldPosition) * sizeMultiplier;
    return float2(x, y);
  }
}
