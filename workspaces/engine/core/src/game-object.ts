import { Component } from "./component";
import { Float2, type float2 } from "low-level";
import { layer } from "./layers";
import type { Transform } from "./transform";
import type { World } from "./worlds";

let lastId = 0;

export type TransformParams = {
  position?: float2;
  rotation?: number;
  scale?: float2;
};

export type GameObjectId = number & { readonly __brand: unique symbol };

export class GameObject {
  constructor(transform?: TransformParams) {
    this.transform = {
      position: transform?.position ?? Float2.zero,
      rotation: transform?.rotation ?? 0,
      scale: transform?.scale ?? Float2.one
    };
  }

  public readonly id = ++lastId as GameObjectId;
  public readonly transform: Transform;

  public active = true;
  public layer = layer(0);

  private readonly components = new Map<unknown, Component>();
  private _world: World = null!;
  private hasStarted = false;

  public get world() {
    return this._world;
  }

  public setWorld(world: World) {
    this._world = world;
  }

  public addComponent<T extends Component>(component: T): T {
    const key = component.constructor.prototype;
    if (this.components.has(key)) throw new Error("Component already exists");

    component.setOwner(this);
    this.components.set(key, component);
    
    component.construct();
    return component;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getComponent<T extends Component>(ctor: new (...args: any[]) => T): T {
    const result = this.components.get(ctor.prototype);
    if (!result) throw new TypeError("No component found");
    return result as T;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getComponentOrNull<T extends Component>(ctor: new (...args: any[]) => T): T | null {
    const result = this.components.get(ctor.prototype);
    return result ? result as T : null;
  }

  protected onStart(): void {}
  protected onDestroy(): void {}
  protected onUpdate(): void {}

  public destroy() {
    this.onDestroy();
    for (const component of this.components.values()) {
      component.onDestroy();
    }
  }

  public update() {
    if (this.hasStarted === false) {
      this.onStart();
      this.hasStarted = true;
    }

    for (const component of this.components.values()) {
      component.tryStart();
      component.update();
    }
  }
};
