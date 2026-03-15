export class Time {
  private static _time = 0;
  private static _deltaTime = 0;

  public static get timeSinceStart() { return this._time; }
  public static get deltaTime() { return this._deltaTime; }

  public static updateTimeSinceStart(value: number) {
    this._deltaTime = Math.min(value - this._time, 1); // ! Max deltaTime = 1s
    this._time = value;
  }
};
