import { Camera, World, WorldManager } from "@engine/core";
import { float2, Float2, hex } from "low-level";
import { DestinationPoint, SpawnPoint } from "points";
import { RectRenderer } from "@engine/rendering";

type PointLocation = |
  "top-left" | "middle-left" | "bottom-left" |
  "top-center" | "middle-center" | "bottom-center" |
  "top-right" | "middle-right" | "bottom-right";

const locationMap = {
  "top-left": float2(-1, 1),
  "middle-left": float2(-1, 0),
  "bottom-left": float2(-1, -1),

  "top-center": float2(0, 1),
  "middle-center": float2(0, 0),
  "bottom-center": float2(0, -1),

  "top-right": float2(1, 1),
  "middle-right": float2(1, 0),
  "bottom-right": float2(1, -1)
} satisfies Record<PointLocation, float2>;

export class BaseWorld extends World {
  constructor(params?: { width?: number, height?: number, cameraSize?: number }) {
    super();
        
    this.createEmptyObject()
      .addComponent(new Camera({
        size: params?.cameraSize || 15,
        backgroundColor: hex("#6488ff")
      }));

    this.width = params?.width || 16;
    this.height = params?.height || 10;

    this.createEmptyObject({ scale: float2(this.width + 0.5, this.height + 0.5) })
      .addComponent(new RectRenderer({ fillColor: hex("#000") }));

    this.createEmptyObject({ scale: float2(this.width, this.height) })
      .addComponent(new RectRenderer({ fillColor: hex("#ffffff") }));
  }

  public readonly width: number;
  public readonly height: number;

  private nextLevelFunc?: (() => World) | undefined;

  protected createPoints(
    spawn: PointLocation,
    end: PointLocation,
    nextLevelFunc?: () => World
  ) {
    this.nextLevelFunc = nextLevelFunc;

    let area = float2(this.width * 0.5, this.height * 0.5);
    area = Float2.sub(area, Float2.one); // Substract one to stay within area
    
    this.addObject(new SpawnPoint({
      position: Float2.mul(locationMap[spawn], area)
    }));

    this.addObject(new DestinationPoint({
      position: Float2.mul(locationMap[end], area)
    }));
  }

  public isOutOfBounds(worldPosition: float2, radius?: number) {
    radius ??= 0;

    const x = Float2.x(worldPosition);
    const y = Float2.y(worldPosition);

    return x < -this.width * 0.5 + radius || x > this.width * 0.5 - radius ||
      y < -this.height * 0.5 + radius || y > this.height * 0.5 - radius;
  }

  public loadNextLevel() {
    if (this.active === false) return;
    if (!this.nextLevelFunc) return;
    
    WorldManager.load(this.nextLevelFunc());
    WorldManager.unload(this);
  }

  public restart() {
    if (this.active === false) return;
    WorldManager.load(new (this.constructor as { new (): BaseWorld })());
    WorldManager.unload(this);
  }
};
