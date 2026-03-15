import { GameObject } from "./game-object";

export abstract class Component {
  private _gameObject: GameObject = null!;
  private hasStarted = false;

  public get gameObject() {
    return this._gameObject;
  }

  public get transform() {
    return this._gameObject.transform;
  }

  public setOwner(gameObject: GameObject) {
    this._gameObject = gameObject;
  }

  public tryStart() {
    if (this.hasStarted) return;
    this.hasStarted = true;
    this.onStart();
  }

  public construct(): void {}
  public onStart(): void {}
  public onDestroy(): void {}
  public update(): void {}
}
