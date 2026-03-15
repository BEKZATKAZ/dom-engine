import { GameObject, type GameObjectId, type TransformParams as TransformParams } from "../game-object";
import type { Camera } from "../camera";

export class World {
  private readonly objects = new Map<GameObjectId, GameObject>();
  private _activeCamera: Camera | null = null;
  private _active = true;

  public get active() {
    return this._active;
  }

  public destroy() {
    if (this._active === false) return; // Prevent repeated destroy
    this._active = false;
    
    for (const gameObject of this.objects.values()) {
      try { gameObject.destroy(); }
      catch (err) { console.log("GameObject.destroy() has thrown an error", err); }
    }
  }

  public getActiveCameraOrNull(): Camera | null {
    return this._activeCamera;
  }

  public setActiveCamera(camera: Camera | null) {
    this._activeCamera = camera;
  }

  public createEmptyObject(transform?: TransformParams): GameObject {
    const instance = new GameObject(transform);
    this.objects.set(instance.id, instance);
    instance.setWorld(this);
    return instance;
  }

  public addObject<T extends GameObject>(instance: T): T {
    this.objects.set(instance.id, instance);
    instance.setWorld(this);
    return instance;
  }

  public destroyObject(gameObject: GameObject) {
    if (this.objects?.delete(gameObject.id)) gameObject.destroy();
  }

  public update() {
    for (const gameObject of this.objects.values()) {
      if (this._active === false) return;
      if (gameObject.active === false) continue;

      try { gameObject.update(); }
      catch (err) { console.log("GameObject.update() has thrown an error", err); }
    }
  }
}
